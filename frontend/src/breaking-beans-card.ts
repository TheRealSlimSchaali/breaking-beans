import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './breaking-beans-predictor-card';
import './breaking-beans-analytics-card';

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
  @state() private _drink_type: string = 'Espresso (Double)';
  @state() private _basket_type: string = 'DOUBLE';
  @state() private _edit_mode: boolean = false;
  @state() private _edit_brew_id: string = '';
  @state() private _is_choked: boolean = false;
  @state() private _is_dial_in: boolean = false;
  @state() private _show_all_history: boolean = false;

  private _coffeeTypes: string[] = [
    'Espresso (Single)', 'Espresso (Double)', 'Ristretto', 'Lungo', 'Americano', 
    'Long Black', 'Café Crème (Schümli)', 'Cappuccino', 'Flat White', 
    'Latte Macchiato', 'Espresso Macchiato', 'Mokka', 'French Press', 'n/a'
  ];

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
        deplete: "Deplete",
        rating_ovrl: "Rating (Ovrl.)",
        basket_type: "Basket Type",
        coffee_type: "Coffee Type",
        basket_double: "18g basket",
        basket_single: "9g basket",
        choked: "Choked Shot",
        dial_in: "Dial-In Shot",
        show_all: "Show All History",
        show_less: "Show Less",
        untracked: "Untracked",
        untracked_shot: "Subtract beans without tracking"
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
        deplete: "Leeren",
        rating_ovrl: "Bewertung (Gesamt)",
        basket_type: "Korb-Typ",
        coffee_type: "Kaffee-Typ",
        basket_double: "18g Korb",
        basket_single: "9g Korb",
        choked: "Bezug blockiert",
        dial_in: "Einstell-Bezug (Dial-In)",
        show_all: "Gesamten Verlauf anzeigen",
        show_less: "Weniger anzeigen",
        untracked: "Nur abziehen",
        untracked_shot: "Nur Bohnen abziehen ohne Bezug zu speichern"
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
        logged: "Café enregistré !",
        choked: "Bouché (Choked)",
        dial_in: "Réglage (Dial-in)",
        show_all: "Tout afficher",
        show_less: "Réduire"
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
        logged: "Caffè registrato!",
        choked: "Bloccato (Choked)",
        dial_in: "Regolazione (Dial-In)",
        show_all: "Mostra Tutto",
        show_less: "Mostra Meno"
    },
    es: {
        inventory: "Inventario",
        quick_log: "Registrar Café",
        batch: "Lote",
        grinder: "Molinillo",
        machine: "Máquina",
        dose: "Dosis (g)",
        yield: "Rendimiento (g)",
        time: "Tiempo (s)",
        setting: "Ajuste",
        log: "Guardar",
        logged: "¡Café guardado!",
        acidity: "Acidez (1-5)",
        bitterness: "Amargor (1-5)",
        rating_1: "Muy Leve",
        rating_3: "Bueno",
        rating_5: "Muy Fuerte",
        person: "Persona",
        guest: "Invitado",
        deplete: "Vaciar",
        rating_ovrl: "Calificación",
        basket_type: "Tipo de Cesta",
        coffee_type: "Bebida",
        basket_double: "Cesta de 18g",
        basket_single: "Cesta de 9g",
        choked: "Bloqueado (Choked)",
        dial_in: "Calibración (Dial-In)",
        show_all: "Mostrar Todo",
        show_less: "Mostrar Menos"
    }
  };

  private _t(key: string) {
    const lang = this.hass?.language || 'en';
    const set = this._translations[lang.split('-')[0]] || this._translations.en;
    return set[key] || this._translations.en[key] || key;
  }

  @state() private _defaults_loaded: boolean = false;

  public setConfig(config: any) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this.config = config;
  }

  updated(changedProps: PropertyValues) {
    if (changedProps.has('hass') && this.hass && !this._defaults_loaded && !this._edit_mode) {
      const historySensor = Object.values(this.hass.states).find((s: any) => s.attributes.integration === 'breaking_beans' && s.attributes.history);
      const history = (historySensor as any)?.attributes?.history || [];
      if (history.length > 0) {
        const lastShot = history[history.length - 1];
        this._dose = parseFloat(lastShot.dose) || 18.0;
        this._yield = parseFloat(lastShot.yield) || 36.0;
        this._time = parseInt(lastShot.time) || 28;
        this._grinder_setting = parseFloat(lastShot.grinder_setting) || 10.0;
        this._rating = parseInt(lastShot.rating) || 3;
        this._acidity = parseInt(lastShot.acidity) || 3;
        this._bitterness = parseInt(lastShot.bitterness) || 3;
        this._drink_type = lastShot.drink_type || 'Espresso (Double)';
        this._basket_type = lastShot.basket_type || 'DOUBLE';
      }
      this._defaults_loaded = true;
    }
    super.updated(changedProps);
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
    const baskets = (Object.values(this.hass.states) as any[]).filter((s: any) => s.attributes.integration === 'breaking_beans' && s.attributes.weight_load !== undefined);

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
          ${this._renderBrewForm(batches, grinders, machines, baskets)}
          ${history.length > 0 ? html`
            <div class="section-title">History</div>
            <div class="history-table">
               ${[...history].reverse().slice(0, this._show_all_history ? history.length : 5).map(h => {
                 let dateStr = "Unknown";
                 if (h.timestamp) {
                   const d = new Date(h.timestamp);
                   if (!isNaN(d.getTime())) {
                       dateStr = d.toLocaleDateString([], {day: 'numeric', month: 'short'});
                   }
                 }
                 return html`
                 <div class="history-item">
                   <div class="hist-header">
                     <div class="hist-title">
                       <span class="hist-type">${h.drink_type && h.drink_type !== 'n/a' ? h.drink_type : 'Espresso'}</span>
                       <span class="hist-date">${dateStr}</span>
                     </div>
                     <div class="hist-rating">
                       <span class="rating">${'★'.repeat(h.rating || 0)}</span>
                     </div>
                   </div>
                   
                   <div class="hist-bean">
                     ${h.bean_name || 'Coffee'} <span class="hist-person">by ${h.person || 'Unknown'}</span>
                   </div>
                   
                   <div class="hist-metrics">
                     ${h.is_choked ? html`
                       <div class="metric-chip" style="background: rgba(231, 76, 60, 0.1); color: #e74c3c;">
                         <ha-icon icon="mdi:close-octagon" style="color: #e74c3c;"></ha-icon>
                         Choked
                       </div>
                     ` : ''}
                     ${h.is_dial_in ? html`
                       <div class="metric-chip" style="background: rgba(155, 89, 182, 0.1); color: #9b59b6;">
                         <ha-icon icon="mdi:wrench" style="color: #9b59b6;"></ha-icon>
                         Dial-In
                       </div>
                     ` : ''}
                     <div class="metric-chip">
                       <ha-icon icon="mdi:scale"></ha-icon>
                       ${parseFloat(h.dose || 0).toFixed(1)}g ➔ ${parseFloat(h.yield || 0).toFixed(1)}g
                     </div>
                     <div class="metric-chip">
                       <ha-icon icon="mdi:timer-outline"></ha-icon>
                       ${h.time}s
                     </div>
                     <div class="metric-chip">
                       <ha-icon icon="mdi:cog-outline"></ha-icon>
                       ${h.grinder_setting}
                     </div>
                     <div class="metric-chip" title="Acidity">
                       <ha-icon icon="mdi:fruit-citrus"></ha-icon>
                       ${h.acidity||3}
                     </div>
                     <div class="metric-chip" title="Bitterness">
                       <ha-icon icon="mdi:tree-outline"></ha-icon>
                       ${h.bitterness||3}
                     </div>
                   </div>
                   
                   <div class="hist-actions">
                     <span class="metric-chip" style="margin-right:auto; margin-left: 8px;"><ha-icon icon="mdi:filter"></ha-icon>${baskets.find(b => this._getInternalId(b.entity_id, 'basket_') === h.basket_type)?.state || h.basket_type || 'DOUBLE'}</span>
                     <ha-icon-button title="Edit" @click=${() => this._editBrew(h)}>
                       <ha-icon icon="mdi:pencil"></ha-icon>
                     </ha-icon-button>
                     <ha-icon-button title="Delete (Return Beans)" @click=${() => this._deleteBrew(h.id, true)}>
                       <ha-icon icon="mdi:delete-restore"></ha-icon>
                     </ha-icon-button>
                     <ha-icon-button title="Delete (Permanent)" @click=${() => this._deleteBrew(h.id, false)}>
                       <ha-icon icon="mdi:delete"></ha-icon>
                     </ha-icon-button>
                   </div>
                 </div>
               `})}
               ${history.length > 5 ? html`
                 <div class="history-footer">
                   <ha-button @click=${() => this._show_all_history = !this._show_all_history}>
                     ${this._show_all_history ? this._t('show_less') : this._t('show_all')}
                   </ha-button>
                 </div>
               ` : ''}
            </div>
          ` : ''}
        </div>
      </ha-card>
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

  private _editBrew(h: any) {
      this._edit_mode = true;
      this._edit_brew_id = h.id;
      this._dose = parseFloat(h.dose) || 18.0;
      this._yield = parseFloat(h.yield) || 36.0;
      this._time = parseInt(h.time) || 28;
      this._grinder_setting = parseFloat(h.grinder_setting) || 10.0;
      this._rating = parseInt(h.rating) || 3;
      this._acidity = parseInt(h.acidity) || 3;
      this._bitterness = parseInt(h.bitterness) || 3;
      this._drink_type = h.drink_type && h.drink_type !== 'n/a' ? h.drink_type : 'Espresso (Double)';
      this._basket_type = h.basket_type || 'DOUBLE';
      this._is_choked = h.is_choked === true || h.is_choked === 'true';
      this._is_dial_in = h.is_dial_in === true || h.is_dial_in === 'true';
      
      const batches = this._getEntities(['_remaining', '_verbleibend']);
      const matchBatch = batches.find(b => this._getInternalId(b.entity_id, 'batch_') === h.batch_id);
      if (matchBatch) this._selected_batch = matchBatch.entity_id;
      
      const grinders = this._getEntities(['_maintenance', '_durchsatz', '_throughput', '_throughput_kg']);
      const matchGrinder = grinders.find(g => this._getInternalId(g.entity_id, 'grinder_') === h.grinder_id);
      if (matchGrinder) this._selected_grinder = matchGrinder.entity_id;
      
      const machines = this._getEntities(['_maintenance', '_gesamtbezuge', '_total_shots']);
      const matchMachine = machines.find(m => this._getInternalId(m.entity_id, 'machine_') === h.machine_id);
      if (matchMachine) this._selected_machine = matchMachine.entity_id;
      
      this._selected_person = h.person || '';

      const form = this.shadowRoot?.querySelector('.brew-form');
      if (form) {
          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  }

  private _cancelEdit() {
      this._edit_mode = false;
      this._edit_brew_id = '';
      this._is_choked = false;
      this._is_dial_in = false;
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

  private _renderBrewForm(batches: any[], grinders: any[], machines: any[], baskets: any[]) {
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
            <div class="native-select-wrapper">
                <label>${this._t('basket_type')}</label>
                <select @change=${(e: any) => { 
                    this._basket_type = e.target.value; 
                    const selectedBasket = baskets.find(b => this._getInternalId(b.entity_id, 'basket_') === this._basket_type);
                    if (selectedBasket) {
                        this._dose = selectedBasket.attributes.weight_load || 18.0;
                    }
                }} .value=${this._basket_type}>
                    ${baskets.map(b => html`<option value="${this._getInternalId(b.entity_id, 'basket_')}">${b.state}</option>`)}
                    ${['DOUBLE', 'SINGLE'].includes(this._basket_type) && !baskets.find(b => this._getInternalId(b.entity_id, 'basket_') === this._basket_type) ? html`<option value="${this._basket_type}">${this._basket_type}</option>` : ''}
                </select>
            </div>
            <div class="native-select-wrapper">
                <label>${this._t('coffee_type')}</label>
                <select @change=${(e: any) => this._drink_type = e.target.value} .value=${this._drink_type}>
                    ${this._coffeeTypes.map(t => html`<option value="${t}">${t}</option>`)}
                </select>
            </div>
        </div>
        <div class="form-grid">
            <ha-textfield label="${this._t('dose')}" type="number" step="0.1" .value=${this._dose.toString()} @input=${(e: any) => this._dose = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t('setting')}" type="number" step="0.5" .value=${this._grinder_setting.toString()} @input=${(e: any) => this._grinder_setting = parseFloat(e.target.value)}></ha-textfield>
            <div style="display: flex; align-items: center; justify-content: flex-start; padding-left: 4px;">
                <ha-formfield .label=${this._t('dial_in')}>
                    <ha-switch .checked=${this._is_dial_in} @change=${(e: any) => this._is_dial_in = e.target.checked}></ha-switch>
                </ha-formfield>
            </div>
        </div>
        
        <div class="form-grid">
            <ha-textfield label="${this._t('yield')}" type="number" step="0.1" .value=${this._yield.toString()} @input=${(e: any) => this._yield = parseFloat(e.target.value)} ?disabled=${this._is_choked}></ha-textfield>
            <ha-textfield label="${this._t('time')}" type="number" step="1" .value=${this._time.toString()} @input=${(e: any) => this._time = parseInt(e.target.value)}></ha-textfield>
            <div style="display: flex; align-items: center; justify-content: flex-start; padding-left: 4px;">
                <ha-formfield .label=${this._t('choked')}>
                    <ha-switch .checked=${this._is_choked} @change=${(e: any) => { this._is_choked = e.target.checked; if(this._is_choked) { this._yield = 0; } }}></ha-switch>
                </ha-formfield>
            </div>
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
                    <span>${this._t('rating_ovrl')}</span>
                    <span>${'★'.repeat(this._rating)}</span>
                </div>
                <div class="slider-row">
                    <input type="range" min="1" max="5" .value=${this._rating.toString()} @input=${(e: any) => this._rating = parseInt(e.target.value)}>
                </div>
            </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top:20px;">
           <ha-button raised @click=${this._logBrew} style="flex: 2;">${this._edit_mode ? 'Save Changes' : this._t('log')}</ha-button>
           ${!this._edit_mode ? html`<ha-button outlined @click=${this._untrackedShot} style="flex: 1;" title="${this._t('untracked_shot')}"><ha-icon icon="mdi:minus"></ha-icon> ${this._t('untracked')}</ha-button>` : ''}
           ${this._edit_mode ? html`<ha-button @click=${this._cancelEdit} style="flex: 1;">Cancel</ha-button>` : ''}
        </div>
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

    const callData: any = {
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
        drink_type: this._drink_type,
        basket_type: this._basket_type,
        is_choked: this._is_choked,
        is_dial_in: this._is_dial_in,
        bean_name: (Object.values(this.hass.states) as any[]).find((s:any) => s.entity_id === batch_eid)?.attributes?.friendly_name?.split(' Verbleibend')[0]?.split(' Remaining')[0] || 'Unknown Bean'
    };

    if (this._edit_mode) {
        callData.brew_id = this._edit_brew_id;
        await this.hass.callService('breaking_beans', 'edit_brew', callData);
        alert('Changes saved!');
        this._cancelEdit();
    } else {
        await this.hass.callService('breaking_beans', 'add_brew', callData);
        alert(this._t('logged'));
    }
  }

  private async _untrackedShot() {
      const batches = this._getEntities(['_remaining', '_verbleibend']).filter(b => parseFloat(b.state) > 0);
      const batch_eid = this._selected_batch || batches[0]?.entity_id || '';
      
      if (!batch_eid) {
          alert('No active batch found!');
          return;
      }
      
      if (confirm(`Subtract ${this._dose}g from inventory without tracking the shot?`)) {
          await this.hass.callService('breaking_beans', 'purge_beans', { 
              batch_id: this._getInternalId(batch_eid, 'batch_'),
              amount: this._dose
          });
          alert('Beans subtracted!');
      }
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
    .history-item {
      display: flex;
      flex-direction: column;
      padding: 12px 8px;
      border-bottom: 1px solid var(--divider-color);
      gap: 8px;
    }
    .history-item:last-child { border-bottom: none; }
    .hist-header { display: flex; justify-content: space-between; align-items: center; }
    .hist-title { display: flex; align-items: baseline; gap: 8px; }
    .hist-type { font-weight: 600; font-size: 14px; color: var(--primary-text-color); }
    .hist-date { font-size: 12px; color: var(--secondary-text-color); }
    .hist-rating { color: #f1c40f; letter-spacing: 2px; }
    
    .hist-bean {
      font-size: 13px;
      color: var(--primary-text-color);
      line-height: 1.4;
    }
    .hist-person {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    
    .hist-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .metric-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(111, 78, 55, 0.1);
      color: var(--primary-text-color);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .metric-chip ha-icon {
      --mdc-icon-size: 14px;
      color: #6F4E37;
    }
    
    .hist-actions {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
      margin-top: 4px;
    }
    .hist-actions ha-icon-button {
      color: var(--secondary-text-color);
      --mdc-icon-button-size: 32px;
      --mdc-icon-size: 20px;
    }
    .rating { color: #f1c40f; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'breaking-beans-card': BreakingBeansCard
  }
}
