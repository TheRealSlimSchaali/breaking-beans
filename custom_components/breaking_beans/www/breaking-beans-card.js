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
		super(...e), this._selected_batch = "", this._selected_grinder = "", this._selected_machine = "", this._dose = 18, this._yield = 36, this._time = 28, this._grinder_setting = 10, this._rating = 3, this._translations = {
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
	}
	_t(e) {
		let t = this.hass?.language || "en";
		return (this._translations[t.split("-")[0]] || this._translations.en)[e] || e;
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
      <ha-card>
        <div class="card-content">
          <div class="header">
             <ha-icon icon="mdi:coffee-beans"></ha-icon>
             <span class="title">Breaking Beans</span>
          </div>
          <div class="section-title">${this._t("inventory")}</div>
          ${this._renderInventory(e)}
          <div class="section-title">${this._t("quick_log")}</div>
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
        <div class="form-grid">
            <ha-select label="${this._t("batch")}" @selected=${(e) => this._selected_batch = e.target.value} .value=${this._selected_batch || e[0]?.entity_id}>
                ${e.map((e) => n`<mwc-list-item value=${e.entity_id}>${e.attributes.friendly_name?.split(" Verbleibend")[0] || e.attributes.friendly_name?.split(" Remaining")[0]}</mwc-list-item>`)}
            </ha-select>
            <ha-select label="${this._t("grinder")}" @selected=${(e) => this._selected_grinder = e.target.value} .value=${this._selected_grinder || t[0]?.entity_id}>
                ${t.map((e) => n`<mwc-list-item value=${e.entity_id}>${e.attributes.friendly_name?.split(" Durchsatz")[0] || e.attributes.friendly_name?.split(" Throughput")[0]}</mwc-list-item>`)}
            </ha-select>
            <ha-select label="${this._t("machine")}" @selected=${(e) => this._selected_machine = e.target.value} .value=${this._selected_machine || r[0]?.entity_id}>
                ${r.map((e) => n`<mwc-list-item value=${e.entity_id}>${e.attributes.friendly_name?.split(" Gesamtbezüge")[0] || e.attributes.friendly_name?.split(" Total Shots")[0]}</mwc-list-item>`)}
            </ha-select>
        </div>
        <div class="form-grid">
            <ha-textfield label="${this._t("dose")}" type="number" .value=${this._dose.toString()} @input=${(e) => this._dose = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t("yield")}" type="number" .value=${this._yield.toString()} @input=${(e) => this._yield = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t("time")}" type="number" .value=${this._time.toString()} @input=${(e) => this._time = parseInt(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t("setting")}" type="number" step="0.1" .value=${this._grinder_setting.toString()} @input=${(e) => this._grinder_setting = parseFloat(e.target.value)}></ha-textfield>
        </div>
        <ha-button raised @click=${this._logBrew}>${this._t("log")}</ha-button>
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
  `;
	}
};
o([i({ attribute: !1 })], s.prototype, "hass", void 0), o([i({ attribute: !1 })], s.prototype, "config", void 0), o([a()], s.prototype, "_selected_batch", void 0), o([a()], s.prototype, "_selected_grinder", void 0), o([a()], s.prototype, "_selected_machine", void 0), o([a()], s.prototype, "_dose", void 0), o([a()], s.prototype, "_yield", void 0), o([a()], s.prototype, "_time", void 0), o([a()], s.prototype, "_grinder_setting", void 0), o([a()], s.prototype, "_rating", void 0), s = o([r("breaking-beans-card")], s);
//#endregion
export { s as BreakingBeansCard };
