import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Chart, registerables, type ChartConfiguration } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(...registerables);
Chart.register(annotationPlugin);

@customElement('breaking-beans-analytics-card')
export class BreakingBeansAnalyticsCard extends LitElement {
    @property({ attribute: false }) public hass?: any;
    @property({ attribute: false }) public config?: any;

    @state() private _loading: boolean = false;
    @state() private _bubble_data: any[] = [];
    @state() private _heatmap: any[] = [];
    @state() private _choke_lines: any = {};
    
    private _chart?: Chart;

    private _translations: any = {
        en: { title: "Extraction Analytics", heatmap: "Consistency Heatmap", no_data: "No data available." },
        de: { title: "Extraktions-Analyse", heatmap: "Konsistenz-Matrix (Menschlicher Faktor)", no_data: "Keine Daten verfügbar." },
        es: { title: "Análisis de Extracción", heatmap: "Mapa de Calor de Consistencia", no_data: "No hay datos." },
        fr: { title: "Analyse de l'extraction", heatmap: "Carte thermique de cohérence", no_data: "Aucune donnée." },
        it: { title: "Analisi di Estrazione", heatmap: "Mappa di Calore della Coerenza", no_data: "Nessun dato." }
    };
    
    private _t(k: string) { 
        return (this._translations[this.hass?.language?.split('-')[0]] || this._translations.en)[k] || this._translations.en[k] || k; 
    }

    public setConfig(config: any) { 
        this.config = config; 
    }
    
    async connectedCallback() {
        super.connectedCallback();
    }
    
    protected updated(changedProps: PropertyValues): void {
        super.updated(changedProps);
        if (changedProps.has('hass') && this.hass && !this._bubble_data.length && !this._loading) {
            this._fetchData();
        }
    }

    private async _fetchData() {
        this._loading = true;
        try {
            const res = await this.hass.connection.sendMessagePromise({
                type: 'breaking_beans/get_analytics'
            });
            this._bubble_data = res.bubble_data || [];
            this._heatmap = res.heatmap || [];
            this._choke_lines = res.choke_lines || {};
        } catch (e) {
            console.error("Analytics fetch failed", e);
        } finally {
            this._loading = false;
            await this.updateComplete;
            this._renderChart();
        }
    }

    private _renderChart() {
        const canvas = this.shadowRoot?.getElementById('analyticsChart') as HTMLCanvasElement;
        if (!canvas) return;

        if (this._chart) {
            this._chart.destroy();
        }

        const annotations: any = {
            targetZone: {
                type: 'box',
                yMin: 4.0,
                yMax: 5.0,
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 0
            }
        };

        Object.keys(this._choke_lines).forEach(key => {
            annotations[`choke_${key}`] = {
                type: 'line',
                scaleID: 'x',
                value: this._choke_lines[key],
                borderColor: 'rgba(231, 76, 60, 0.8)',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                    content: 'Choked',
                    display: true,
                    position: 'start'
                }
            };
        });

        const dataFormatted = this._bubble_data.map(d => ({
            x: d.jittered_grind,
            y: d.rating,
            r: Math.max(3, parseFloat(d.time) / 2.5),
            ...d
        }));

        const config: ChartConfiguration = {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Extracted Shots',
                    data: dataFormatted as any,
                    backgroundColor: (ctx: any) => ctx.raw?.color || '#000',
                    borderColor: (ctx: any) => {
                        const time = ctx.raw?.time;
                        return (time >= 25 && time <= 30) ? 'rgba(255, 215, 0, 0.9)' : 'rgba(0,0,0,0.1)';
                    },
                    borderWidth: (ctx: any) => {
                        const time = ctx.raw?.time;
                        return (time >= 25 && time <= 30) ? 3 : 1;
                    },
                    pointStyle: (ctx: any) => ctx.raw?.basket_type === 'SINGLE' ? 'rect' : 'circle'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const raw: any = context.raw;
                                return [
                                    `${raw.bean_label} ${raw.basket_type === 'SINGLE' ? '(9g)' : '(18g)'}`,
                                    `Tasted: ${raw.rating}★`,
                                    `Dose: ${raw.dose}g ➔ Yield: ${raw.yield}g`,
                                    `Time: ${raw.time}s`,
                                    `Grind: ${raw.grind_size}`,
                                    `Date: ${raw.timestamp ? new Date(raw.timestamp).toLocaleDateString() : 'N/A'}`
                                ];
                            }
                        }
                    },
                    annotation: { annotations }
                },
                scales: {
                    y: {
                        min: 0.5,
                        max: 5.5,
                        title: { display: true, text: 'Rating (1-5)' }
                    },
                    x: {
                        title: { display: true, text: 'Grinder Setting' }
                    }
                }
            }
        };

        this._chart = new Chart(canvas, config);
    }
    
    private _renderHeatmap() {
        if (!this._heatmap || this._heatmap.length === 0) return html``;
        
        const people = Array.from(new Set(this._heatmap.map(h => h.person)));
        const combos = Array.from(new Set(this._heatmap.map(h => h.combo)));
        
        return html`
            <div class="section-title">${this._t('heatmap')}</div>
            <div class="heatmap-wrapper">
                <table class="heatmap">
                    <thead>
                        <tr>
                            <th></th>
                            ${combos.map(c => html`<th>${c}</th>`)}
                        </tr>
                    </thead>
                    <tbody>
                        ${people.map(p => html`
                            <tr>
                                <th>${p}</th>
                                ${combos.map(c => {
                                    const cell = this._heatmap.find(h => h.person === p && h.combo === c);
                                    let bg = 'rgba(0,0,0,0.05)';
                                    let text = '-';
                                    if (cell) {
                                        if (cell.count < 2) {
                                            bg = '#bdc3c7';
                                            text = 'N/A';
                                        } else {
                                            const sd = cell.std_dev;
                                            text = `σ ${sd}s`;
                                            if (sd < 2.0) bg = 'rgba(46, 204, 113, 0.4)'; // Green
                                            else if (sd <= 5.0) bg = 'rgba(241, 196, 15, 0.4)'; // Yellow
                                            else bg = 'rgba(231, 76, 60, 0.4)'; // Red
                                        }
                                    }
                                    return html`<td style="background: ${bg}">${text}</td>`;
                                })}
                            </tr>
                        `)}
                    </tbody>
                </table>
            </div>
            <div class="heatmap-legend">
                <span class="legend-chip" style="background: rgba(46, 204, 113, 0.4);">High Consistency (&lt;2s)</span>
                <span class="legend-chip" style="background: rgba(241, 196, 15, 0.4);">Moderate (2-5s)</span>
                <span class="legend-chip" style="background: rgba(231, 76, 60, 0.4);">Inconsistent (&gt;5s)</span>
            </div>
        `;
    }

    render() {
        if (this._loading) {
            return html`<ha-card><div class="card-content">Loading analytics...</div></ha-card>`;
        }
        
        return html`
          <ha-card>
            <div class="card-content">
              <div class="header">
                 <ha-icon icon="mdi:chart-bubble"></ha-icon>
                 <span class="title">${this._t('title')}</span>
              </div>
              
              <div class="chart-container">
                 ${this._bubble_data.length > 0 ? html`<canvas id="analyticsChart"></canvas>` : html`<p>${this._t('no_data')}</p>`}
              </div>
              
              ${this._renderHeatmap()}
              
            </div>
          </ha-card>
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
            color: #3498db;
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
            margin-top: 24px;
            margin-bottom: 8px;
        }
        .chart-container {
            width: 100%;
            height: 350px;
            position: relative;
        }
        .heatmap-wrapper {
            overflow-x: auto;
            background: var(--secondary-background-color);
            border-radius: 8px;
            padding: 8px;
        }
        .heatmap {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            min-width: 400px;
        }
        .heatmap th, .heatmap td {
            text-align: center;
            border: 1px solid var(--divider-color);
            padding: 8px;
        }
        .heatmap th {
            color: var(--secondary-text-color);
            font-weight: 500;
        }
        .heatmap td {
            color: var(--primary-text-color);
            font-weight: bold;
        }
        .heatmap-legend {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 8px;
            justify-content: center;
        }
        .legend-chip {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            color: var(--primary-text-color);
        }
    `;
}

declare global {
  interface HTMLElementTagNameMap {
    'breaking-beans-analytics-card': BreakingBeansAnalyticsCard
  }
}
