import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('breaking-beans-predictor-card')
export class BreakingBeansPredictorCard extends LitElement {
  @property({ attribute: false }) public hass?: any;
  @property({ attribute: false }) public config?: any;

  @state() private _selected_batch: string = '';
  @state() private _selected_person: string = '';
  @state() private _prediction: any = null;
  @state() private _loading: boolean = false;

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

  private _getEntities(suffixes: string[]) {
    if (!this.hass) return [];
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
    const clean = slug.replace('_remaining', '').replace('_verbleibend', '');
    return clean.startsWith(prefix) ? clean : prefix + clean;
  }

  private async _getPrediction() {
    this._loading = true;
    this._prediction = null;
    
    // We get defaults if nothing elected
    const batches = this._getEntities(['_remaining', '_verbleibend']).filter(b => parseFloat(b.state) > 0);
    const batch_eid = this._selected_batch || batches[0]?.entity_id || '';
    const person = this._selected_person || 'Guest';

    const batch_id = this._getInternalId(batch_eid, 'batch_');
    
    if (!batch_id) {
        this._loading = false;
        return;
    }

    try {
        const response = await this.hass.connection.sendMessagePromise({
            type: 'breaking_beans/get_prediction',
            batch_id: batch_id,
            person: person
        });
        this._prediction = response;
    } catch (e) {
        console.error("Prediction failed: ", e);
    }
    this._loading = false;
  }

  render() {
    if (!this.hass) {
      return html`<p>Loading...</p>`;
    }

    const batches = this._getEntities(['_remaining', '_verbleibend']).filter(b => parseFloat(b.state) > 0);
    const people = Object.keys(this.hass.states)
                         .filter(eid => eid.startsWith('person.'))
                         .map(eid => this.hass.states[eid]);

    return html`
      <ha-card>
        <div class="card-content">
          <div class="header">
             <ha-icon icon="mdi:lightbulb-on"></ha-icon>
             <span class="title">Shot Predictor</span>
          </div>

          <div class="form-grid">
            <div class="native-select-wrapper">
                <label>Person</label>
                <select @change=${(e: any) => { this._selected_person = e.target.value; this._prediction = null; }} .value=${this._selected_person || 'Guest'}>
                    <option value="Guest">Guest</option>
                    ${people.map(p => html`<option value="${p.attributes.friendly_name || p.entity_id}">${p.attributes.friendly_name || p.entity_id}</option>`)}
                </select>
            </div>
            <div class="native-select-wrapper">
                <label>Batch</label>
                <select @change=${(e: any) => { this._selected_batch = e.target.value; this._prediction = null; }} .value=${this._selected_batch || batches[0]?.entity_id || ''}>
                    ${batches.map(b => html`<option value="${b.entity_id}">${this._getCleanName(b, [' Verbleibend', ' Remaining'])}</option>`)}
                </select>
            </div>
          </div>

          <ha-button raised @click=${this._getPrediction} ?disabled=${this._loading} style="margin-top:20px; width:100%;">
            ${this._loading ? 'Predicting...' : 'Get Recommendation'}
          </ha-button>

          ${this._prediction ? this._renderPrediction() : ''}
        </div>
      </ha-card>
    `;
  }

  private _renderPrediction() {
      if (this._prediction.status === 'insufficient_data') {
          return html`
            <div class="result-box empty">
                Not enough past shots for this bean and person to make a prediction.
            </div>
          `;
      }

      return html`
        <div class="result-box">
            <div class="stats-row">
                <div class="stat"><span class="label">Setting</span><span class="value main">${parseFloat(this._prediction.suggested_setting || 0).toFixed(1)}</span></div>
                <div class="stat"><span class="label">Dose</span><span class="value">${parseFloat(this._prediction.suggested_dose || 0).toFixed(1)}g</span></div>
                <div class="stat"><span class="label">Yield</span><span class="value">${parseFloat(this._prediction.suggested_yield || 0).toFixed(1)}g</span></div>
            </div>
            <div class="meta-row">
                <small>Based on last ${this._prediction.shots_analyzed} shots (Avg Rating: ${this._prediction.avg_rating}★)</small>
                ${Math.abs(this._prediction.age_adjustment) > 0.01 ? html`<small style="color:var(--warning-color)">Age Adjust: ${this._prediction.age_adjustment}</small>` : ''}
            </div>
        </div>
      `;
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
      color: #f39c12;
      --mdc-icon-size: 32px;
    }
    .title {
      font-size: 24px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
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
    ha-button { --mdc-theme-primary: #6F4E37; }

    .result-box {
        margin-top: 20px;
        background: var(--secondary-background-color);
        padding: 16px;
        border-radius: 8px;
        border-left: 4px solid #f39c12;
    }
    .result-box.empty { border-left-color: var(--error-color, #e74c3c); }
    .stats-row {
        display: flex;
        justify-content: space-around;
        margin-bottom: 12px;
    }
    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }
    .stat .label { font-size: 11px; text-transform: uppercase; color: var(--secondary-text-color); }
    .stat .value { font-size: 18px; font-weight: bold; color: var(--primary-text-color); }
    .stat .value.main { font-size: 24px; color: #6F4E37; }
    .meta-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        border-top: 1px solid var(--divider-color);
        padding-top: 8px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'breaking-beans-predictor-card': BreakingBeansPredictorCard
  }
}
