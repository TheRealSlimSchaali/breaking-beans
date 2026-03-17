import { LitElement as e, css as t, html as n } from "lit";
import { customElement as r, property as i, state as a } from "lit/decorators.js";
//#region \0@oxc-project+runtime@0.115.0/helpers/decorate.js
function o(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/breaking-beans-card.ts
var s = class extends e {
	constructor(...e) {
		super(...e), this._selected_batch = "", this._selected_grinder = "", this._selected_machine = "", this._dose = 18, this._yield = 36, this._time = 28, this._grinder_setting = 10, this._rating = 3;
	}
	setConfig(e) {
		if (!e) throw Error("Invalid configuration");
		this.config = e;
	}
	shouldUpdate(e) {
		return e.has("hass") ? !0 : super.shouldUpdate(e);
	}
	render() {
		if (!this.hass) return n`<p>Loading...</p>`;
		let e = this._getEntities("sensor", "_verbleibend"), t = this._getEntities("sensor", "_durchsatz"), r = this._getEntities("sensor", "_gesamtbezuge");
		return n`
      <ha-card header="Breaking Beans">
        <div class="card-content">
          ${this._renderInventory(e)}
          <hr />
          ${this._renderBrewForm(e, t, r)}
        </div>
      </ha-card>
    `;
	}
	_getEntities(e, t) {
		return Object.keys(this.hass.states).filter((n) => n.startsWith(e + ".breaking_beans") || n.includes("breaking_beans") && n.endsWith(t)).map((e) => this.hass.states[e]);
	}
	_renderInventory(e) {
		return e.length === 0 ? n`<p>No active beans found.</p>` : n`
      <div class="inventory">
        ${e.map((e) => {
			let t = e.attributes.friendly_name?.replace(" Verbleibend", "") || "Unknown", r = e.state;
			return n`
            <div class="batch-item">
              <div class="batch-info">
                <span class="batch-name">${t}</span>
                <span class="batch-weight">${r} ${e.attributes.unit_of_measurement || "g"}</span>
              </div>
              <ha-progressbar .value=${Math.min(100, parseFloat(r) / 250 * 100)}></ha-progressbar>
            </div>
          `;
		})}
      </div>
    `;
	}
	_renderBrewForm(e, t, r) {
		return n`
      <div class="brew-form">
        <h3>Quick Log Brew</h3>
        <div class="form-grid">
            <ha-select label="Batch" @selected=${(e) => this._selected_batch = e.target.value} .value=${this._selected_batch || e[0]?.entity_id}>
                ${e.map((e) => n`<mwc-list-item value=${e.entity_id}>${e.attributes.friendly_name?.replace(" Verbleibend", "")}</mwc-list-item>`)}
            </ha-select>
            <ha-select label="Grinder" @selected=${(e) => this._selected_grinder = e.target.value} .value=${this._selected_grinder || t[0]?.entity_id}>
                ${t.map((e) => n`<mwc-list-item value=${e.entity_id}>${e.attributes.friendly_name?.replace(" Durchsatz", "")}</mwc-list-item>`)}
            </ha-select>
            <ha-select label="Machine" @selected=${(e) => this._selected_machine = e.target.value} .value=${this._selected_machine || r[0]?.entity_id}>
                ${r.map((e) => n`<mwc-list-item value=${e.entity_id}>${e.attributes.friendly_name?.replace(" Gesamtbezüge", "")}</mwc-list-item>`)}
            </ha-select>
        </div>
        <div class="form-grid">
            <ha-textfield label="Dose (g)" type="number" .value=${this._dose.toString()} @input=${(e) => this._dose = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="Yield (g)" type="number" .value=${this._yield.toString()} @input=${(e) => this._yield = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="Time (s)" type="number" .value=${this._time.toString()} @input=${(e) => this._time = parseInt(e.target.value)}></ha-textfield>
            <ha-textfield label="Setting" type="number" step="0.1" .value=${this._grinder_setting.toString()} @input=${(e) => this._grinder_setting = parseFloat(e.target.value)}></ha-textfield>
        </div>
        <ha-button raised @click=${this._logBrew}>Log Shot</ha-button>
      </div>
    `;
	}
	async _logBrew() {
		let e = (e) => e.split(".").pop()?.replace("breaking_beans_", "").replace("_verbleibend", "").replace("_durchsatz", "").replace("_gesamtbezuge", "");
		await this.hass.callService("breaking_beans", "add_brew", {
			batch_id: e(this._selected_batch),
			grinder_id: e(this._selected_grinder),
			machine_id: e(this._selected_machine),
			dose: this._dose,
			yield: this._yield,
			time: this._time,
			grinder_setting: this._grinder_setting,
			rating: this._rating
		}), alert("Shot logged!");
	}
	static {
		this.styles = t`
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
};
o([i({ attribute: !1 })], s.prototype, "hass", void 0), o([i({ attribute: !1 })], s.prototype, "config", void 0), o([a()], s.prototype, "_selected_batch", void 0), o([a()], s.prototype, "_selected_grinder", void 0), o([a()], s.prototype, "_selected_machine", void 0), o([a()], s.prototype, "_dose", void 0), o([a()], s.prototype, "_yield", void 0), o([a()], s.prototype, "_time", void 0), o([a()], s.prototype, "_grinder_setting", void 0), o([a()], s.prototype, "_rating", void 0), s = o([r("breaking-beans-card")], s);
//#endregion
export { s as BreakingBeansCard };
