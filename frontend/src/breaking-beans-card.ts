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
        logged: "Shot logged!"
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
        logged: "Bezug gespeichert!"
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
               ${[...history].reverse().slice(0, 5).map(h => html`
                 <div class="history-row">
                   <span>${new Date(h.timestamp * 1000).toLocaleDateString([], {day: 'numeric', month: 'short'})}</span>
                   <span>${h.dose}g ➔ ${h.yield}g</span>
                   <span class="rating">${'★'.repeat(h.rating)}</span>
                 </div>
               `)}
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
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderBrewForm(batches: any[], grinders: any[], machines: any[]) {
    return html`
      <div class="brew-form">
        <div class="form-grid">
            <ha-select label="${this._t('batch')}" @change=${(e: any) => this._selected_batch = e.target.value} .value=${this._selected_batch || batches[0]?.entity_id || ''} fixedMenuPosition>
                ${batches.map(b => html`<ha-list-item value="${b.entity_id}">${this._getCleanName(b, [' Verbleibend', ' Remaining'])}</ha-list-item>`)}
            </ha-select>
            <ha-select label="${this._t('grinder')}" @change=${(e: any) => this._selected_grinder = e.target.value} .value=${this._selected_grinder || grinders[0]?.entity_id || ''} fixedMenuPosition>
                ${grinders.map(g => html`<ha-list-item value="${g.entity_id}">${this._getCleanName(g, [' Durchsatz', ' Throughput'])}</ha-list-item>`)}
            </ha-select>
            <ha-select label="${this._t('machine')}" @change=${(e: any) => this._selected_machine = e.target.value} .value=${this._selected_machine || machines[0]?.entity_id || ''} fixedMenuPosition>
                ${machines.map(m => html`<ha-list-item value="${m.entity_id}">${this._getCleanName(m, [' Gesamtbezüge', ' Total Shots'])}</ha-list-item>`)}
            </ha-select>
        </div>
        <div class="form-grid">
            <ha-textfield label="${this._t('dose')}" type="number" .value=${this._dose.toString()} @input=${(e: any) => this._dose = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t('yield')}" type="number" .value=${this._yield.toString()} @input=${(e: any) => this._yield = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t('time')}" type="number" .value=${this._time.toString()} @input=${(e: any) => this._time = parseInt(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t('setting')}" type="number" step="0.1" .value=${this._grinder_setting.toString()} @input=${(e: any) => this._grinder_setting = parseFloat(e.target.value)}></ha-textfield>
        </div>
        <ha-button raised @click=${this._logBrew}>${this._t('log')}</ha-button>
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

    // Call HA service
    // We need to resolve ID back to our internal ID from the entity state if possible
    const getInternalId = (eid: string, prefix: string) => {
        if (!eid) return '';
        const state = this.hass.states[eid];
        if (state && state.attributes.internal_id) {
            return state.attributes.internal_id;
        }
        // fallback to guessing if integration hasn't been reloaded yet
        const parts = eid.split('.');
        const slug = parts[parts.length - 1];
        const clean = slug.replace('_remaining', '').replace('_verbleibend', '')
                          .replace('_maintenance', '').replace('_durchsatz', '')
                          .replace('_gesamtbezuge', '');
        return clean.startsWith(prefix) ? clean : prefix + clean;
    };
    
    await this.hass.callService('breaking_beans', 'add_brew', {
        batch_id: getInternalId(batch_eid, 'batch_'),
        grinder_id: getInternalId(grinder_eid, 'grinder_'),
        machine_id: getInternalId(machine_eid, 'machine_'),
        dose: this._dose,
        yield: this._yield,
        time: this._time,
        grinder_setting: this._grinder_setting,
        rating: this._rating
    });
    alert('Shot logged!');
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
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-top: 8px;
    }
    ha-textfield, ha-select { width: 100%; }
    ha-button { width: 100%; margin-top: 20px; --mdc-theme-primary: #6F4E37; }
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
      padding: 4px 0;
      border-bottom: 1px solid var(--divider-color);
    }
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
