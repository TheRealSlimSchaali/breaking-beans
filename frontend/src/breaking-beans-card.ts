import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('breaking-beans-card')
export class BreakingBeansCard extends LitElement {
  @property({ attribute: false }) public hass?: any;
  @property({ attribute: false }) public config?: any;

  @state() private _selected_batch: string = '';
  @state() private _selected_grinder: string = '';
  @state() private _selected_machine: string = '';
  @state() private _dose: number = 18.0;
  @state() private _yield: number = 36.0;
  @state() private _time: number = 28;
  @state() private _grinder_setting: number = 10.0;
  @state() private _rating: number = 3;
  @state() private _acidity: number = 3;
  @state() private _bitterness: number = 3;
  @state() private _selected_person: string = '';

  private _translations: any = {
    en: {
        inventory: "Inventory",
        quick_log: "Quick Log Brew",
        batch: "Batch",
        grinder: "Grinder",
        machine: "Machine",
        dose: "Dose (g)",
        yield: "Yield (g)",
        time: "Time (s)",
        setting: "Setting",
        log: "Log Shot",
        logged: "Shot logged!",
        acidity: "Acidity (1-5)",
        bitterness: "Bitterness (1-5)",
        rating_1: "Not enough",
        rating_3: "Good",
        rating_5: "Too much",
        person: "Person",
        guest: "Guest",
        deplete: "Deplete"
    },
    de: {
        inventory: "Bestand",
        quick_log: "Bezug dokumentieren",
        batch: "Charge",
        grinder: "Mühle",
        machine: "Maschine",
        dose: "Menge In (g)",
        yield: "Menge Out (g)",
        time: "Zeit (s)",
        setting: "Mahlgrad",
        log: "Speichern",
        logged: "Bezug gespeichert!",
        acidity: "Säure (1-5)",
        bitterness: "Bitterkeit (1-5)",
        rating_1: "Zu Milde",
        rating_3: "Gut",
        rating_5: "Zu Stark",
        person: "Person",
        guest: "Gast",
        deplete: "Leeren"
    },
    fr: {
        inventory: "Inventaire",
        quick_log: "Enregistrer un café",
        batch: "Lot",
        grinder: "Moulin",
        machine: "Machine",
        dose: "Dose (g)",
        yield: "Rendement (g)",
        time: "Temps (s)",
        setting: "Réglage",
        log: "Enregistrer",
        logged: "Café enregistré !"
    },
    it: {
        inventory: "Inventario",
        quick_log: "Registra caffè",
        batch: "Lotto",
        grinder: "Macinacaffè",
        machine: "Macchina",
        dose: "Dose (g)",
        yield: "Resa (g)",
        time: "Tempo (s)",
        setting: "Macinatura",
        log: "Registra",
        logged: "Caffè registrato!"
    }
  };

  private _t(key: string) {
    const lang = this.hass?.language || 'en';
    const set = this._translations[lang.split('-')[0]] || this._translations.en;
    return set[key] || key;
  }

  public setConfig(config: any) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this.config = config;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('hass')) {
      return true;
    }
    return super.shouldUpdate(changedProps);
  }

  render() {
    if (!this.hass) {
      return html`<p>Loading...</p>`;
    }

    const batches = this._getEntities(['_remaining', '_verbleibend']).filter(b => parseFloat(b.state) > 0);
    const grinders = this._getEntities(['_maintenance', '_durchsatz', '_throughput', '_throughput_kg']);
    const machines = this._getEntities(['_maintenance', '_gesamtbezuge', '_total_shots']);

    const historySensor = Object.values(this.hass.states).find((s: any) => s.attributes.integration === 'breaking_beans' && s.attributes.history);
    const history = (historySensor as any)?.attributes?.history || [];

    return html`
      <ha-card>
        <div class="card-content">
          <div class="header">
             <ha-icon icon="mdi:coffee-beans"></ha-icon>
             <span class="title">Breaking Beans</span>
          </div>
          <div class="section-title">${this._t('inventory')}</div>
          ${this._renderInventory(batches)}
          <div class="section-title">${this._t('quick_log')}</div>
          ${this._renderBrewForm(batches, grinders, machines)}
          ${history.length > 0 ? html`
            <div class="section-title">Trends</div>
            ${this._renderGraph(history)}
            <div class="section-title">History</div>
            <div class="history-table">
               ${[...history].reverse().slice(0, 5).map(h => {
                 let dateStr = "Unknown";
                 if (h.timestamp) {
                   const d = new Date(h.timestamp);
                   if (!isNaN(d.getTime())) {
                       dateStr = d.toLocaleDateString([], {day: 'numeric', month: 'short'});
                   }
                 }
                 return html`
                 <div class="history-row">
                   <div class="hist-col-date">
                     <strong>${dateStr}</strong><br>
                     <small style="color:var(--secondary-text-color)">${h.bean_name || 'Coffee'}</small>
                   </div>
                   <div class="hist-col-stats">
                     ${h.dose}g ➔ ${h.yield}g<br>
                     <small>${h.time}s @ ${h.grinder_setting}</small>
                   </div>
                   <div class="hist-col-rating">
                     <span class="rating">${'★'.repeat(h.rating || 0)}</span><br>
                     <small>A:${h.acidity||3} B:${h.bitterness||3} | ${h.person || 'G'}</small>
                   </div>
                   <div class="hist-col-actions">
                     <ha-icon-button title="Delete (Return Beans)" @click=${() => this._deleteBrew(h.id, true)}>
                       <ha-icon icon="mdi:delete-restore"></ha-icon>
                     </ha-icon-button>
                     <ha-icon-button title="Delete (Permanent)" @click=${() => this._deleteBrew(h.id, false)}>
                       <ha-icon icon="mdi:delete"></ha-icon>
                     </ha-icon-button>
                   </div>
                 </div>
               `})}
            </div>
          ` : ''}
        </div>
      </ha-card>
    `;
  }

  private _renderGraph(history: any[]) {
      const data = history.slice(-7).map(h => parseFloat(h.yield));
      const max = Math.max(...data, 50);
      return html`
        <div class="trends">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                <polyline
                    fill="none" stroke="#6F4E37" stroke-width="1.5"
                    points="${data.map((v, i) => `${(i / 6) * 100},${40 - (v / max) * 40}`).join(' ')}"
                />
            </svg>
        </div>
      `;
  }

  private _getEntities(suffixes: string[]) {
    return Object.keys(this.hass.states)
      .filter(eid => {
        const state = this.hass.states[eid];
        return state.attributes.integration === 'breaking_beans' && 
               suffixes.some(s => eid.endsWith(s));
      })
      .map(eid => this.hass.states[eid]);
  }

  private _getCleanName(entity: any, suffixes: string[]) {
    if (!entity) return '';
    let name = entity.attributes.friendly_name || entity.entity_id;
    for (const suffix of suffixes) {
      name = name.replace(suffix, '');
    }
    return name.trim();
  }

  private _getInternalId(eid: string, prefix: string) {
    if (!eid) return '';
    const state = this.hass.states[eid];
    if (state && state.attributes.internal_id) {
        return state.attributes.internal_id;
    }
    const parts = eid.split('.');
    const slug = parts[parts.length - 1];
    const clean = slug.replace('_remaining', '').replace('_verbleibend', '')
                      .replace('_maintenance', '').replace('_durchsatz', '')
                      .replace('_gesamtbezuge', '');
    return clean.startsWith(prefix) ? clean : prefix + clean;
  }

  private async _deleteBrew(id: string, returnBeans: boolean) {
      if (!id) return;
      if (confirm(`Delete this brew${returnBeans ? ' AND return the beans to stock' : ''}?`)) {
          await this.hass.callService('breaking_beans', 'delete_brew', { brew_id: id, return_beans: returnBeans });
      }
  }

  private async _depleteBatch(eid: string) {
      if (confirm('Are you sure you want to mark this batch as completely empty?')) {
          await this.hass.callService('breaking_beans', 'deplete_batch', { batch_id: this._getInternalId(eid, 'batch_') });
      }
  }

  private _renderInventory(batches: any[]) {
    if (batches.length === 0) return html`<p>No active beans found.</p>`;

    return html`
      <div class="inventory">
        ${batches.map(batch => {
          const name = this._getCleanName(batch, [' Verbleibend', ' Remaining']);
          const weight = batch.state;
          const unit = batch.attributes.unit_of_measurement || 'g';
          // Progress relative to 250g bag size
          const progress = Math.min(1.0, parseFloat(weight) / 250);
          return html`
            <div class="batch-item">
              <div class="batch-info">
                <span class="batch-name">${name}</span>
                <span class="batch-weight">${weight}${unit}</span>
              </div>
              <ha-progressbar .value=${progress}></ha-progressbar>
              <div class="batch-actions" style="margin-top: 4px; text-align: right;">
                 <a href="#" @click=${(e: Event) => { e.preventDefault(); this._depleteBatch(batch.entity_id); }} style="font-size: 11px; color: var(--secondary-text-color);">${this._t('deplete')}</a>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderBrewForm(batches: any[], grinders: any[], machines: any[]) {
    const people = Object.keys(this.hass.states)
                         .filter(eid => eid.startsWith('person.'))
                         .map(eid => this.hass.states[eid]);

    return html`
      <div class="brew-form">
        <div class="form-grid">
            <div class="native-select-wrapper">
                <label>${this._t('batch')}</label>
                <select @change=${(e: any) => this._selected_batch = e.target.value} .value=${this._selected_batch || batches[0]?.entity_id || ''}>
                    ${batches.map(b => html`<option value="${b.entity_id}">${this._getCleanName(b, [' Verbleibend', ' Remaining'])}</option>`)}
                </select>
            </div>
            <div class="native-select-wrapper">
                <label>${this._t('grinder')}</label>
                <select @change=${(e: any) => this._selected_grinder = e.target.value} .value=${this._selected_grinder || grinders[0]?.entity_id || ''}>
                    ${grinders.map(g => html`<option value="${g.entity_id}">${this._getCleanName(g, [' Durchsatz', ' Throughput'])}</option>`)}
                </select>
            </div>
            <div class="native-select-wrapper">
                <label>${this._t('machine')}</label>
                <select @change=${(e: any) => this._selected_machine = e.target.value} .value=${this._selected_machine || machines[0]?.entity_id || ''}>
                    ${machines.map(m => html`<option value="${m.entity_id}">${this._getCleanName(m, [' Gesamtbezüge', ' Total Shots'])}</option>`)}
                </select>
            </div>
            <div class="native-select-wrapper">
                <label>${this._t('person')}</label>
                <select @change=${(e: any) => this._selected_person = e.target.value} .value=${this._selected_person || this._t('guest')}>
                    <option value="${this._t('guest')}">${this._t('guest')}</option>
                    ${people.map(p => html`<option value="${p.attributes.friendly_name || p.entity_id}">${p.attributes.friendly_name || p.entity_id}</option>`)}
                </select>
            </div>
        </div>
        <div class="form-grid">
            <ha-textfield label="${this._t('dose')}" type="number" .value=${this._dose.toString()} @input=${(e: any) => this._dose = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t('yield')}" type="number" .value=${this._yield.toString()} @input=${(e: any) => this._yield = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t('time')}" type="number" step="1" .value=${this._time.toString()} @input=${(e: any) => this._time = parseInt(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t('setting')}" type="number" step="0.1" .value=${this._grinder_setting.toString()} @input=${(e: any) => this._grinder_setting = parseFloat(e.target.value)}></ha-textfield>
        </div>
        
        <div class="sliders" style="margin-top: 16px;">
            <div class="slider-container">
                <div class="slider-header">
                    <span>${this._t('acidity')}</span>
                    <span>${this._acidity}</span>
                </div>
                <div class="slider-row">
                    <small>${this._t('rating_1')}</small>
                    <input type="range" min="1" max="5" .value=${this._acidity.toString()} @input=${(e: any) => this._acidity = parseInt(e.target.value)}>
                    <small>${this._t('rating_5')}</small>
                </div>
            </div>
            
            <div class="slider-container">
                <div class="slider-header">
                    <span>${this._t('bitterness')}</span>
                    <span>${this._bitterness}</span>
                </div>
                <div class="slider-row">
                    <small>${this._t('rating_1')}</small>
                    <input type="range" min="1" max="5" .value=${this._bitterness.toString()} @input=${(e: any) => this._bitterness = parseInt(e.target.value)}>
                    <small>${this._t('rating_5')}</small>
                </div>
            </div>
            
            <div class="slider-container">
                <div class="slider-header">
                    <span>Rating (Ovrl.)</span>
                    <span>${'★'.repeat(this._rating)}</span>
                </div>
                <div class="slider-row">
                    <input type="range" min="1" max="5" .value=${this._rating.toString()} @input=${(e: any) => this._rating = parseInt(e.target.value)}>
                </div>
            </div>
        </div>

        <ha-button raised @click=${this._logBrew} style="margin-top:20px;">${this._t('log')}</ha-button>
      </div>
    `;
  }

  private async _logBrew() {
    // Determine the selected entities, fallback to the first available if not explicitly selected
    const batches = this._getEntities(['_remaining', '_verbleibend']).filter(b => parseFloat(b.state) > 0);
    const grinders = this._getEntities(['_maintenance', '_durchsatz', '_throughput', '_throughput_kg']);
    const machines = this._getEntities(['_maintenance', '_gesamtbezuge', '_total_shots']);

    const batch_eid = this._selected_batch || batches[0]?.entity_id || '';
    const grinder_eid = this._selected_grinder || grinders[0]?.entity_id || '';
    const machine_eid = this._selected_machine || machines[0]?.entity_id || '';
    const person = this._selected_person || this._t('guest');

    await this.hass.callService('breaking_beans', 'add_brew', {
        batch_id: this._getInternalId(batch_eid, 'batch_'),
        grinder_id: this._getInternalId(grinder_eid, 'grinder_'),
        machine_id: this._getInternalId(machine_eid, 'machine_'),
        dose: this._dose,
        yield: this._yield,
        time: this._time,
        grinder_setting: this._grinder_setting,
        rating: this._rating,
        acidity: this._acidity,
        bitterness: this._bitterness,
        person: person,
        bean_name: (Object.values(this.hass.states) as any[]).find((s:any) => s.entity_id === batch_eid)?.attributes?.friendly_name?.split(' Verbleibend')[0]?.split(' Remaining')[0] || 'Unknown Bean'
    });
    alert(this._t('logged'));
  }

  static styles = css`
    ha-card {
      background: var(--card-background-color, #fff);
      padding: 16px;
      border-radius: 12px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2));
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .header ha-icon {
      color: #6F4E37;
      --mdc-icon-size: 32px;
    }
    .title {
      font-size: 24px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--secondary-text-color);
      margin-top: 16px;
      margin-bottom: 8px;
    }
    .inventory {
      background: var(--secondary-background-color);
      padding: 12px;
      border-radius: 8px;
    }
    .batch-item {
      margin-bottom: 12px;
    }
    .batch-item:last-child { margin-bottom: 0; }
    .batch-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .batch-name { font-weight: 500; font-size: 14px; }
    .batch-weight { color: var(--primary-color); font-weight: bold; }
    ha-progressbar {
      --ha-progressbar-height: 6px;
      --ha-progressbar-border-radius: 3px;
      --ha-progressbar-progress-color: #6F4E37;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin-top: 8px;
    }
    .native-select-wrapper {
        display: flex;
        flex-direction: column;
    }
    .native-select-wrapper label {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
        padding-left: 2px;
    }
    .native-select-wrapper select {
        width: 100%;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid var(--divider-color, #e0e0e0);
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font-size: 14px;
        appearance: none;
        outline: none;
    }
    .native-select-wrapper select:focus {
        border-color: var(--primary-color);
    }
    ha-textfield { width: 100%; }
    ha-button { width: 100%; --mdc-theme-primary: #6F4E37; }
    
    .sliders {
        display: flex;
        flex-direction: column;
        gap: 16px;
        background: var(--secondary-background-color);
        padding: 12px;
        border-radius: 8px;
    }
    .slider-container {
        display: flex;
        flex-direction: column;
    }
    .slider-header {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 4px;
    }
    .slider-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .slider-row small {
        width: 60px;
        text-align: center;
        color: var(--secondary-text-color);
        font-size: 11px;
    }
    .slider-row input[type=range] {
        flex: 1;
        accent-color: #6F4E37;
    }
    
    .history-table {
      margin-top: 8px;
      font-size: 13px;
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 8px;
    }
    .history-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .hist-col-date { flex: 2; }
    .hist-col-stats { flex: 2; text-align: center; }
    .hist-col-rating { flex: 2; text-align: center; }
    .hist-col-actions { flex: 1; text-align: right; display: flex; gap: 4px; justify-content: flex-end; }
    .hist-col-actions ha-icon-button { color: var(--secondary-text-color); --mdc-icon-button-size: 32px; --mdc-icon-size: 20px; }
    .history-row:last-child { border-bottom: none; }
    .rating { color: #f1c40f; }
    .trends {
      height: 60px;
      margin: 8px 0;
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 12px 8px;
    }
    .trends svg { width: 100%; height: 100%; overflow: visible; }
    .trends polyline { vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'breaking-beans-card': BreakingBeansCard
  }
}
