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
  @state() private _current_view: string = 'menu';
  @state() private _brew_step: number = 1;
  @state() private _stopwatch_elapsed: number = 0;
  @state() private _stopwatch_running: boolean = false;
  private _stopwatch_timer: any = null;
  private _stopwatch_start_time: number = 0;

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
        untracked_shot: "Subtract beans without tracking",
        menu_record: "Record Shot",
        menu_stock: "Bean Stock",
        menu_history: "Shot History",
        menu_predict: "Get Prediction",
        menu_record_desc: "Guided step-by-step extraction assistant",
        menu_stock_desc: "Monitor and manage inventory levels",
        menu_history_desc: "Review past extractions & analytics",
        menu_predict_desc: "AI suggested settings for your next shot",
        step_equipment: "Equipment",
        step_beans: "Beans & Dose",
        step_time: "Brew Time",
        step_yield: "Yield Out",
        step_rating: "Rating",
        next: "Next",
        back: "Back",
        cancel: "Cancel",
        save: "Save Changes",
        untracked_sub: "Subtract dose without logging",
        stopwatch_start: "Start",
        stopwatch_pause: "Pause",
        stopwatch_reset: "Reset",
        manual_subtract: "Manual Stock Adjustment",
        subtract_btn: "Subtract",
        amount_g: "Amount (g)",
        back_to_menu: "Back to Menu",
        history_analytics: "History & Analytics"
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
        untracked_shot: "Nur Bohnen abziehen ohne Bezug zu speichern",
        menu_record: "Bezug eintragen",
        menu_stock: "Bohnen-Bestand",
        menu_history: "Verlauf & Analyse",
        menu_predict: "Mahlgrad-Empfehlung",
        menu_record_desc: "Geführter Assistent zur Extraktion",
        menu_stock_desc: "Lagerbestand überwachen und pflegen",
        menu_history_desc: "Bisherige Bezüge und Analysen einsehen",
        menu_predict_desc: "KI-gestützte Mahlgrad-Empfehlung",
        step_equipment: "Geräte",
        step_beans: "Bohnen & Dosis",
        step_time: "Bezugszeit",
        step_yield: "Menge Out",
        step_rating: "Bewertung",
        next: "Weiter",
        back: "Zurück",
        cancel: "Abbrechen",
        save: "Änderungen speichern",
        untracked_sub: "Menge abziehen (ohne Bezug)",
        stopwatch_start: "Start",
        stopwatch_pause: "Pause",
        stopwatch_reset: "Zurücksetzen",
        manual_subtract: "Manuelle Mengenkorrektur",
        subtract_btn: "Abziehen",
        amount_g: "Menge (g)",
        back_to_menu: "Hauptmenü",
        history_analytics: "Verlauf & Analyse"
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
        show_less: "Réduire",
        menu_record: "Enregistrer un café",
        menu_stock: "Inventaire",
        menu_history: "Historique",
        menu_predict: "Recommandations",
        menu_record_desc: "Assistant d'extraction guidé",
        menu_stock_desc: "Surveiller et gérer les stocks",
        menu_history_desc: "Revoir l'historique et les analyses",
        menu_predict_desc: "Paramètres suggérés par l'IA",
        step_equipment: "Équipement",
        step_beans: "Café & Dose",
        step_time: "Extraction",
        step_yield: "Rendement",
        step_rating: "Notes",
        next: "Suivant",
        back: "Retour",
        cancel: "Annuler",
        save: "Enregistrer les modifications",
        untracked_sub: "Soustraire sans enregistrer",
        stopwatch_start: "Démarrer",
        stopwatch_pause: "Pause",
        stopwatch_reset: "Réinitialiser",
        manual_subtract: "Correction manuelle des stocks",
        subtract_btn: "Soustraire",
        amount_g: "Quantité (g)",
        back_to_menu: "Menu principal",
        history_analytics: "Historique & Analyses"
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
        show_less: "Mostra Meno",
        menu_record: "Registra caffè",
        menu_stock: "Inventario",
        menu_history: "Cronologia",
        menu_predict: "Predizione",
        menu_record_desc: "Assistente all'estrazione passo dopo passo",
        menu_stock_desc: "Controlla e gestisci l'inventario",
        menu_history_desc: "Esamina la cronologia e le analisi",
        menu_predict_desc: "Impostazioni consigliate dall'IA",
        step_equipment: "Attrezzatura",
        step_beans: "Caffè e Dose",
        step_time: "Tempo estrazione",
        step_yield: "Resa",
        step_rating: "Valutazione",
        next: "Avanti",
        back: "Indietro",
        cancel: "Annulla",
        save: "Salva modifiche",
        untracked_sub: "Sottrai dose senza registrare",
        stopwatch_start: "Avvia",
        stopwatch_pause: "Pausa",
        stopwatch_reset: "Azzera",
        manual_subtract: "Regolazione manuale inventario",
        subtract_btn: "Sottrai",
        amount_g: "Quantità (g)",
        back_to_menu: "Menu principale",
        history_analytics: "Cronologia & Analisi"
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
        show_less: "Mostrar Menos",
        menu_record: "Registrar Café",
        menu_stock: "Inventario",
        menu_history: "Historial",
        menu_predict: "Predicción",
        menu_record_desc: "Asistente de extracción paso a paso",
        menu_stock_desc: "Supervisar y gestionar el inventario",
        menu_history_desc: "Revisar extracciones pasadas y análisis",
        menu_predict_desc: "Configuración recomendada por IA",
        step_equipment: "Equipo",
        step_beans: "Café & Dosis",
        step_time: "Tiempo",
        step_yield: "Rendimiento",
        step_rating: "Calificación",
        next: "Siguiente",
        back: "Atrás",
        cancel: "Cancelar",
        save: "Guardar cambios",
        untracked_sub: "Restar dosis sin registrar",
        stopwatch_start: "Iniciar",
        stopwatch_pause: "Pausa",
        stopwatch_reset: "Restablecer",
        manual_subtract: "Ajuste de stock manual",
        subtract_btn: "Restar",
        amount_g: "Cantidad (g)",
        back_to_menu: "Volver al menú",
        history_analytics: "Historial & Análisis"
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

    return html`
      <ha-card>
        <div class="card-content">
          ${this._renderHeader()}
          
          <div class="view-container">
            ${this._current_view === 'menu' ? this._renderMenu() : ''}
            
            ${this._current_view === 'record_shot' ? html`
              ${this._renderStepIndicator()}
              <div class="wizard-steps-container">
                ${this._brew_step === 1 ? this._renderStep1(grinders, machines, baskets) : ''}
                ${this._brew_step === 2 ? this._renderStep2(batches) : ''}
                ${this._brew_step === 3 ? this._renderStep3() : ''}
                ${this._brew_step === 4 ? this._renderStep4() : ''}
                ${this._brew_step === 5 ? this._renderStep5() : ''}
              </div>
              ${this._renderWizardNavigation()}
            ` : ''}
            
            ${this._current_view === 'bean_stock' ? this._renderBeanStock(batches) : ''}
            
            ${this._current_view === 'history' ? this._renderHistory(baskets) : ''}
            
            ${this._current_view === 'prediction' ? this._renderPredictor() : ''}
          </div>
        </div>
      </ha-card>
    `;
  }

  private _renderHeader() {
    const isMenu = this._current_view === 'menu';
    return html`
      <div class="header">
        ${!isMenu ? html`
          <ha-icon-button @click=${this._goToMenu} title="${this._t('back_to_menu')}">
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </ha-icon-button>
        ` : html`
          <ha-icon icon="mdi:coffee-beans"></ha-icon>
        `}
        <span class="title">
          ${isMenu ? 'Breaking Beans' : this._getViewTitle()}
        </span>
      </div>
    `;
  }

  private _renderMenu() {
    return html`
      <div class="menu-grid">
        <div class="menu-card" @click=${() => { this._current_view = 'record_shot'; this._brew_step = 1; }}>
          <div class="menu-card-icon record"><ha-icon icon="mdi:coffee-maker"></ha-icon></div>
          <div class="menu-card-content">
            <div class="menu-card-title">${this._t('menu_record')}</div>
            <div class="menu-card-desc">${this._t('menu_record_desc')}</div>
          </div>
        </div>
        <div class="menu-card" @click=${() => this._current_view = 'bean_stock'}>
          <div class="menu-card-icon stock"><ha-icon icon="mdi:coffee-beans"></ha-icon></div>
          <div class="menu-card-content">
            <div class="menu-card-title">${this._t('menu_stock')}</div>
            <div class="menu-card-desc">${this._t('menu_stock_desc')}</div>
          </div>
        </div>
        <div class="menu-card" @click=${() => this._current_view = 'history'}>
          <div class="menu-card-icon history"><ha-icon icon="mdi:history"></ha-icon></div>
          <div class="menu-card-content">
            <div class="menu-card-title">${this._t('menu_history')}</div>
            <div class="menu-card-desc">${this._t('menu_history_desc')}</div>
          </div>
        </div>
        <div class="menu-card" @click=${() => this._current_view = 'prediction'}>
          <div class="menu-card-icon prediction"><ha-icon icon="mdi:lightbulb-on"></ha-icon></div>
          <div class="menu-card-content">
            <div class="menu-card-title">${this._t('menu_predict')}</div>
            <div class="menu-card-desc">${this._t('menu_predict_desc')}</div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderStepIndicator() {
    const steps = [
      { num: 1, label: this._t('step_equipment') },
      { num: 2, label: this._t('step_beans') },
      { num: 3, label: this._t('step_time') },
      { num: 4, label: this._t('step_yield') },
      { num: 5, label: this._t('step_rating') }
    ];

    return html`
      <div class="step-indicator">
        ${steps.map((step, idx) => html`
          <div class="step-node ${this._brew_step === step.num ? 'active' : ''} ${this._brew_step > step.num ? 'completed' : ''}" @click=${() => this._brew_step = step.num}>
            <div class="step-circle">
              ${this._brew_step > step.num ? html`<ha-icon icon="mdi:check"></ha-icon>` : step.num}
            </div>
            <span class="step-label">${step.label}</span>
          </div>
          ${idx < steps.length - 1 ? html`<div class="step-line ${this._brew_step > step.num ? 'completed' : ''}"></div>` : ''}
        `)}
      </div>
    `;
  }

  private _renderStep1(grinders: any[], machines: any[], baskets: any[]) {
    const people = Object.keys(this.hass.states)
                         .filter(eid => eid.startsWith('person.'))
                         .map(eid => this.hass.states[eid]);

    return html`
      <div class="wizard-step">
        <div class="form-grid">
          <div class="native-select-wrapper">
              <label>${this._t('machine')}</label>
              <select @change=${(e: any) => this._selected_machine = e.target.value} .value=${this._selected_machine || machines[0]?.entity_id || ''}>
                  ${machines.map(m => html`<option value="${m.entity_id}">${this._getCleanName(m, [' Gesamtbezüge', ' Total Shots'])}</option>`)}
              </select>
          </div>
          <div class="native-select-wrapper">
              <label>${this._t('grinder')}</label>
              <select @change=${(e: any) => this._selected_grinder = e.target.value} .value=${this._selected_grinder || grinders[0]?.entity_id || ''}>
                  ${grinders.map(g => html`<option value="${g.entity_id}">${this._getCleanName(g, [' Durchsatz', ' Throughput'])}</option>`)}
              </select>
          </div>
        </div>
        
        <div class="form-grid" style="margin-top: 12px;">
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

        <div class="form-grid" style="margin-top: 12px;">
          <div class="native-select-wrapper">
              <label>${this._t('person')}</label>
              <select @change=${(e: any) => this._selected_person = e.target.value} .value=${this._selected_person || this._t('guest')}>
                  <option value="${this._t('guest')}">${this._t('guest')}</option>
                  ${people.map(p => html`<option value="${p.attributes.friendly_name || p.entity_id}">${p.attributes.friendly_name || p.entity_id}</option>`)}
              </select>
          </div>
        </div>
      </div>
    `;
  }

  private _renderStep2(batches: any[]) {
    return html`
      <div class="wizard-step">
        <div class="native-select-wrapper">
            <label>${this._t('batch')}</label>
            <select @change=${(e: any) => this._selected_batch = e.target.value} .value=${this._selected_batch || batches[0]?.entity_id || ''}>
                ${batches.map(b => html`<option value="${b.entity_id}">${this._getCleanName(b, [' Verbleibend', ' Remaining'])}</option>`)}
            </select>
        </div>

        <div class="form-grid" style="margin-top: 12px;">
          <div class="native-input-wrapper">
              <label>${this._t('dose')}</label>
              <input type="number" step="0.1" .value=${this._dose.toString()} @input=${(e: any) => this._dose = parseFloat(e.target.value)} />
          </div>
          <div class="native-input-wrapper">
              <label>${this._t('setting')}</label>
              <input type="number" step="0.5" .value=${this._grinder_setting.toString()} @input=${(e: any) => this._grinder_setting = parseFloat(e.target.value)} />
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: flex-start; padding-left: 4px; margin-top: 12px;">
            <ha-formfield .label=${this._t('dial_in')}>
                <ha-switch .checked=${this._is_dial_in} @change=${(e: any) => this._is_dial_in = e.target.checked}></ha-switch>
            </ha-formfield>
        </div>

        <div style="margin-top: 16px;">
           <ha-button outlined @click=${this._untrackedShot} title="${this._t('untracked_shot')}">
             <ha-icon icon="mdi:minus" style="margin-right: 4px;"></ha-icon>
             ${this._t('untracked_sub')}
           </ha-button>
        </div>
      </div>
    `;
  }

  private _renderStep3() {
    return html`
      <div class="wizard-step">
        <div class="stopwatch-container">
          <div class="stopwatch-display ${this._stopwatch_running ? 'running' : ''}">
            ${this._formatStopwatch(this._stopwatch_elapsed)}
          </div>
          <div class="stopwatch-controls">
            ${this._stopwatch_running ? html`
              <button class="stopwatch-btn pause" @click=${this._pauseStopwatch}>
                <ha-icon icon="mdi:pause"></ha-icon>
                <span>${this._t('stopwatch_pause')}</span>
              </button>
            ` : html`
              <button class="stopwatch-btn start" @click=${this._startStopwatch}>
                <ha-icon icon="mdi:play"></ha-icon>
                <span>${this._t('stopwatch_start')}</span>
              </button>
            `}
            <button class="stopwatch-btn reset" @click=${this._resetStopwatch}>
              <ha-icon icon="mdi:refresh"></ha-icon>
              <span>${this._t('stopwatch_reset')}</span>
            </button>
          </div>
        </div>

        <div class="native-input-wrapper" style="margin-top: 20px;">
            <label>${this._t('time')}</label>
            <input type="number" step="1" .value=${this._time.toString()} @input=${(e: any) => {
              this._time = parseInt(e.target.value) || 0;
              this._stopwatch_elapsed = this._time * 1000;
            }} />
        </div>
      </div>
    `;
  }

  private _renderStep4() {
    return html`
      <div class="wizard-step">
        <div class="native-input-wrapper">
            <label>${this._t('yield')}</label>
            <input type="number" step="0.1" .value=${this._yield.toString()} @input=${(e: any) => this._yield = parseFloat(e.target.value)} ?disabled=${this._is_choked} />
        </div>

        <div style="display: flex; align-items: center; justify-content: flex-start; padding-left: 4px; margin-top: 16px;">
            <ha-formfield .label=${this._t('choked')}>
                <ha-switch .checked=${this._is_choked} @change=${(e: any) => { this._is_choked = e.target.checked; if(this._is_choked) { this._yield = 0; } }}></ha-switch>
            </ha-formfield>
        </div>
      </div>
    `;
  }

  private _renderStep5() {
    return html`
      <div class="wizard-step">
        <div class="sliders">
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
            
            <div class="slider-container" style="margin-top: 12px;">
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
            
            <div class="slider-container" style="margin-top: 12px;">
                <div class="slider-header">
                    <span>${this._t('rating_ovrl')}</span>
                    <span>${'★'.repeat(this._rating)}</span>
                </div>
                <div class="slider-row">
                    <input type="range" min="1" max="5" .value=${this._rating.toString()} @input=${(e: any) => this._rating = parseInt(e.target.value)}>
                </div>
            </div>
        </div>
      </div>
    `;
  }

  private _renderWizardNavigation() {
    const isFirstStep = this._brew_step === 1;
    const isLastStep = this._brew_step === 5;

    return html`
      <div class="wizard-navigation">
        ${!isFirstStep ? html`
          <ha-button outlined @click=${() => this._brew_step--} style="flex: 1;">
            ${this._t('back')}
          </ha-button>
        ` : html`
          <ha-button outlined @click=${this._goToMenu} style="flex: 1;">
            ${this._t('cancel')}
          </ha-button>
        `}

        ${!isLastStep ? html`
          <ha-button raised @click=${() => this._brew_step++} style="flex: 1.5;">
            ${this._t('next')}
          </ha-button>
        ` : html`
          <ha-button raised @click=${this._logBrew} style="flex: 1.5;">
            ${this._edit_mode ? this._t('save') : this._t('log')}
          </ha-button>
        `}
      </div>
    `;
  }

  private _renderBeanStock(batches: any[]) {
    return html`
      <div class="bean-stock-view">
        ${this._renderInventory(batches)}

        <div class="manual-stock-adjust">
          <div class="section-title" style="margin-top: 24px;">${this._t('manual_subtract')}</div>
          <div class="form-grid">
            <div class="native-select-wrapper">
                <label>${this._t('batch')}</label>
                <select id="adjust-batch-select" .value=${this._selected_batch || batches[0]?.entity_id || ''}>
                    ${batches.map(b => html`<option value="${b.entity_id}">${this._getCleanName(b, [' Verbleibend', ' Remaining'])}</option>`)}
                </select>
            </div>
            <div class="native-input-wrapper">
                <label>${this._t('amount_g')}</label>
                <input id="adjust-amount-input" type="number" step="0.1" .value=${this._dose.toString()} />
            </div>
          </div>
          <div style="margin-top: 12px; text-align: right;">
            <ha-button outlined @click=${this._manualStockSubtract}>
              <ha-icon icon="mdi:minus" style="margin-right: 4px;"></ha-icon>
              ${this._t('subtract_btn')}
            </ha-button>
          </div>
        </div>
      </div>
    `;
  }

  private async _manualStockSubtract() {
    const batchSelect = this.shadowRoot?.getElementById('adjust-batch-select') as HTMLSelectElement;
    const amountInput = this.shadowRoot?.getElementById('adjust-amount-input') as HTMLInputElement;
    if (!batchSelect || !amountInput) return;

    const batch_eid = batchSelect.value;
    const amount = parseFloat(amountInput.value);

    if (!batch_eid) {
      alert('Select a bean batch!');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert('Enter a valid amount!');
      return;
    }

    if (confirm(`Subtract ${amount}g from inventory?`)) {
      await this.hass.callService('breaking_beans', 'purge_beans', {
        batch_id: this._getInternalId(batch_eid, 'batch_'),
        amount: amount
      });
      alert('Beans subtracted!');
    }
  }

  private _renderHistory(baskets: any[]) {
    const historySensor = Object.values(this.hass.states).find((s: any) => s.attributes.integration === 'breaking_beans' && s.attributes.history);
    const history = (historySensor as any)?.attributes?.history || [];

    return html`
      <div class="history-view">
        <breaking-beans-analytics-card .hass=${this.hass} .config=${this.config}></breaking-beans-analytics-card>

        ${history.length > 0 ? html`
          <div class="section-title" style="margin-top: 24px;">History Log</div>
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
        ` : html`<p>No brews logged yet.</p>`}
      </div>
    `;
  }

  private _renderPredictor() {
    return html`
      <div class="prediction-view">
        <breaking-beans-predictor-card .hass=${this.hass} .config=${this.config}></breaking-beans-predictor-card>
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

  disconnectedCallback() {
      if (this._stopwatch_timer) {
          clearInterval(this._stopwatch_timer);
      }
      super.disconnectedCallback();
  }

  private _startStopwatch() {
      if (this._stopwatch_running) return;
      this._stopwatch_running = true;
      this._stopwatch_start_time = Date.now() - this._stopwatch_elapsed;
      this._stopwatch_timer = setInterval(() => {
          this._stopwatch_elapsed = Date.now() - this._stopwatch_start_time;
          this._time = Math.round(this._stopwatch_elapsed / 1000);
      }, 100);
  }

  private _pauseStopwatch() {
      if (!this._stopwatch_running) return;
      this._stopwatch_running = false;
      if (this._stopwatch_timer) {
          clearInterval(this._stopwatch_timer);
          this._stopwatch_timer = null;
      }
  }

  private _resetStopwatch() {
      this._stopwatch_running = false;
      if (this._stopwatch_timer) {
          clearInterval(this._stopwatch_timer);
          this._stopwatch_timer = null;
      }
      this._stopwatch_elapsed = 0;
      this._time = 0;
  }

  private _formatStopwatch(elapsed: number): string {
      const totalSeconds = elapsed / 1000;
      const seconds = Math.floor(totalSeconds);
      const deciseconds = Math.floor((elapsed % 1000) / 100);
      return `${seconds}.${deciseconds}s`;
  }

  private _goToMenu() {
      this._current_view = 'menu';
      if (this._edit_mode) {
          this._cancelEdit();
      }
  }

  private _getViewTitle() {
      switch (this._current_view) {
          case 'record_shot':
              return this._edit_mode ? this._t('save') : this._t('menu_record');
          case 'bean_stock':
              return this._t('menu_stock');
          case 'history':
              return this._t('history_analytics');
          case 'prediction':
              return this._t('menu_predict');
          default:
              return 'Breaking Beans';
      }
  }

  private _editBrew(h: any) {
      this._edit_mode = true;
      this._edit_brew_id = h.id;
      this._dose = parseFloat(h.dose) || 18.0;
      this._yield = parseFloat(h.yield) || 36.0;
      this._time = parseInt(h.time) || 28;
      this._stopwatch_elapsed = this._time * 1000;
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

      this._current_view = 'record_shot';
      this._brew_step = 1;

      const form = this.shadowRoot?.querySelector('.step-indicator');
      if (form) {
          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  }

  private _cancelEdit() {
      this._edit_mode = false;
      this._edit_brew_id = '';
      this._is_choked = false;
      this._is_dial_in = false;
      this._current_view = 'history';
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

  private async _logBrew() {
    // Reset stopwatch on save/log
    this._resetStopwatch();

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
        this._goToMenu();
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
    .header ha-icon-button {
      margin-left: -12px;
      color: var(--primary-text-color);
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
    
    .native-input-wrapper {
        display: flex;
        flex-direction: column;
    }
    .native-input-wrapper label {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
        padding-left: 2px;
    }
    .native-input-wrapper input {
        width: 100%;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid var(--divider-color, #e0e0e0);
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font-size: 14px;
        box-sizing: border-box;
        outline: none;
    }
    .native-input-wrapper input:focus {
        border-color: var(--primary-color);
    }
    .native-input-wrapper input:disabled {
        opacity: 0.5;
        background: var(--secondary-background-color);
    }
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

    /* Menu View */
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 8px;
    }
    @media (max-width: 480px) {
      .menu-grid {
        grid-template-columns: 1fr;
      }
    }
    .menu-card {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, rgba(0,0,0,0.08));
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .menu-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.08);
      border-color: var(--primary-color);
    }
    .menu-card-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .menu-card-icon ha-icon {
      --mdc-icon-size: 24px;
    }
    .menu-card-icon.record { background: rgba(111, 78, 55, 0.1); color: #6F4E37; }
    .menu-card-icon.stock { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
    .menu-card-icon.history { background: rgba(52, 152, 219, 0.1); color: #3498db; }
    .menu-card-icon.prediction { background: rgba(241, 196, 15, 0.1); color: #f1c40f; }

    .menu-card-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .menu-card-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .menu-card-desc {
      font-size: 11px;
      color: var(--secondary-text-color);
      line-height: 1.3;
    }

    /* Step Indicator */
    .step-indicator {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 16px 0 24px 0;
      padding: 0 8px;
    }
    .step-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      position: relative;
      flex: 1;
      cursor: pointer;
    }
    .step-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      transition: all 0.3s ease;
      z-index: 2;
    }
    .step-node.active .step-circle {
      border-color: #6F4E37;
      background: #6F4E37;
      color: #fff;
      box-shadow: 0 0 0 4px rgba(111, 78, 55, 0.15);
    }
    .step-node.completed .step-circle {
      border-color: #6F4E37;
      background: rgba(111, 78, 55, 0.08);
      color: #6F4E37;
    }
    .step-circle ha-icon {
      --mdc-icon-size: 16px;
    }
    .step-label {
      font-size: 10px;
      font-weight: 500;
      color: var(--secondary-text-color);
      text-align: center;
      transition: color 0.3s ease;
      max-width: 65px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .step-node.active .step-label {
      color: var(--primary-text-color);
      font-weight: bold;
    }
    .step-line {
      flex: 1;
      height: 2px;
      background: var(--divider-color, #e0e0e0);
      margin-top: -24px; /* align with centers of circles */
      transition: background-color 0.3s ease;
      z-index: 1;
    }
    .step-line.completed {
      background: #6F4E37;
    }

    /* Stopwatch Widget */
    .stopwatch-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--secondary-background-color);
      border-radius: 12px;
      padding: 24px;
      border: 1px dashed var(--divider-color);
    }
    .stopwatch-display {
      font-family: monospace, sans-serif;
      font-size: 48px;
      font-weight: bold;
      color: var(--primary-text-color);
      margin-bottom: 16px;
      letter-spacing: 1px;
      transition: color 0.3s ease;
    }
    .stopwatch-display.running {
      color: #6F4E37;
      text-shadow: 0 0 10px rgba(111, 78, 55, 0.15);
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.85; }
      100% { opacity: 1; }
    }
    .stopwatch-controls {
      display: flex;
      gap: 12px;
    }
    .stopwatch-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 20px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      outline: none;
      transition: all 0.2s ease;
    }
    .stopwatch-btn.start {
      background: #6F4E37;
      color: #fff;
    }
    .stopwatch-btn.start:hover { background: #5c402d; }
    .stopwatch-btn.pause {
      background: var(--warning-color, #f1c40f);
      color: #000;
    }
    .stopwatch-btn.reset {
      background: rgba(0, 0, 0, 0.05);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
    }
    .stopwatch-btn.reset:hover { background: rgba(0,0,0,0.1); }
    .stopwatch-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    /* Wizard Navigation */
    .wizard-navigation {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      border-top: 1px solid var(--divider-color);
      padding-top: 16px;
    }
    
    .wizard-steps-container {
      min-height: 160px;
    }

    /* Manual Stock Adjust */
    .manual-stock-adjust {
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'breaking-beans-card': BreakingBeansCard
  }
}
