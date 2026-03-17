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

    const batches = this._getEntities('sensor', '_verbleibend'); // Matches German 'Verbleibend'
    const grinders = this._getEntities('sensor', '_durchsatz');
    const machines = this._getEntities('sensor', '_gesamtbezuge');

    return html`
      <ha-card header="Breaking Beans">
        <div class="card-content">
          ${this._renderInventory(batches)}
          <hr />
          ${this._renderBrewForm(batches, grinders, machines)}
        </div>
      </ha-card>
    `;
  }

  private _getEntities(platform: string, suffix: string) {
    return Object.keys(this.hass.states)
      .filter(eid => eid.startsWith(platform + '.breaking_beans') || (eid.includes('breaking_beans') && eid.endsWith(suffix)))
      .map(eid => this.hass.states[eid]);
  }

  private _renderInventory(batches: any[]) {
    if (batches.length === 0) return html`<p>No active beans found.</p>`;

    return html`
      <div class="inventory">
        ${batches.map(batch => {
          const name = batch.attributes.friendly_name?.replace(' Verbleibend', '') || 'Unknown';
          const weight = batch.state;
          const unit = batch.attributes.unit_of_measurement || 'g';
          return html`
            <div class="batch-item">
              <div class="batch-info">
                <span class="batch-name">${name}</span>
                <span class="batch-weight">${weight} ${unit}</span>
              </div>
              <ha-progressbar .value=${Math.min(100, (parseFloat(weight) / 250) * 100)}></ha-progressbar>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderBrewForm(batches: any[], grinders: any[], machines: any[]) {
    return html`
      <div class="brew-form">
        <h3>Quick Log Brew</h3>
        <div class="form-grid">
            <ha-select label="Batch" @selected=${(e: any) => this._selected_batch = e.target.value} .value=${this._selected_batch || batches[0]?.entity_id}>
                ${batches.map(b => html`<mwc-list-item value=${b.entity_id}>${b.attributes.friendly_name?.replace(' Verbleibend', '')}</mwc-list-item>`)}
            </ha-select>
            <ha-select label="Grinder" @selected=${(e: any) => this._selected_grinder = e.target.value} .value=${this._selected_grinder || grinders[0]?.entity_id}>
                ${grinders.map(g => html`<mwc-list-item value=${g.entity_id}>${g.attributes.friendly_name?.replace(' Durchsatz', '')}</mwc-list-item>`)}
            </ha-select>
            <ha-select label="Machine" @selected=${(e: any) => this._selected_machine = e.target.value} .value=${this._selected_machine || machines[0]?.entity_id}>
                ${machines.map(m => html`<mwc-list-item value=${m.entity_id}>${m.attributes.friendly_name?.replace(' Gesamtbezüge', '')}</mwc-list-item>`)}
            </ha-select>
        </div>
        <div class="form-grid">
            <ha-textfield label="Dose (g)" type="number" .value=${this._dose.toString()} @input=${(e: any) => this._dose = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="Yield (g)" type="number" .value=${this._yield.toString()} @input=${(e: any) => this._yield = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="Time (s)" type="number" .value=${this._time.toString()} @input=${(e: any) => this._time = parseInt(e.target.value)}></ha-textfield>
            <ha-textfield label="Setting" type="number" step="0.1" .value=${this._grinder_setting.toString()} @input=${(e: any) => this._grinder_setting = parseFloat(e.target.value)}></ha-textfield>
        </div>
        <ha-button raised @click=${this._logBrew}>Log Shot</ha-button>
      </div>
    `;
  }

  private async _logBrew() {
    // Call HA service
    // We need to resolve ID back to our internal ID from the entity state if possible, or use the object_id
    const getInternalId = (eid: string) => eid.split('.').pop()?.replace('breaking_beans_', '').replace('_verbleibend', '').replace('_durchsatz', '').replace('_gesamtbezuge', '');
    
    await this.hass.callService('breaking_beans', 'add_brew', {
        batch_id: getInternalId(this._selected_batch),
        grinder_id: getInternalId(this._selected_grinder),
        machine_id: getInternalId(this._selected_machine),
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
    }
    .inventory {
      margin-bottom: 16px;
    }
    .batch-item {
      margin-bottom: 8px;
    }
    .batch-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .batch-name { font-weight: bold; }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
    }
    ha-textfield { width: 100%; }
    ha-button { width: 100%; margin-top: 16px; }
    h3 { margin-top: 0; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'breaking-beans-card': BreakingBeansCard
  }
}
