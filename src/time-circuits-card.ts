import { LitElement, html, css, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  TimeCircuitsConfig,
  TimeCircuitsTheme,
  ParsedTime,
  parseTimeState,
  toDisplayOrder,
  isAm,
  pad2,
  resolveTheme,
  RowKind,
  DATE_FORMAT_MD,
} from "./types";
import "./time-circuits-editor";

const VERSION = "1.1.0";

const CARD_NAME = "time-circuits-card";

const DSEG7_FONT_FACE_ID = "time-circuits-card-dseg7-font";

function ensureDseg7Font() {
  if (document.getElementById(DSEG7_FONT_FACE_ID)) return;
  const style = document.createElement("style");
  style.id = DSEG7_FONT_FACE_ID;
  style.textContent = `
@font-face {
  font-family: 'DSEG7 Classic';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://cdn.jsdelivr.net/npm/@fontsource/dseg7@4.5.4/files/dseg7-classic-400-normal.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/npm/@fontsource/dseg7@4.5.4/files/dseg7-classic-400-normal.woff') format('woff');
}
`;
  document.head.appendChild(style);
}

interface RowModel {
  label: string;
  parsed?: ParsedTime;
  displayMD?: string;
  am: boolean;
}

@customElement(CARD_NAME)
export class TimeCircuitsCard extends LitElement {
  @property({ attribute: false }) hass?: any;
  @state() private _cfg: TimeCircuitsConfig = {};
  @state() private _clockTick = 0;

  private _clockTimer?: number;

  static getConfigElement() {
    return document.createElement("time-circuits-editor");
  }

  static getStubConfig(): Partial<TimeCircuitsConfig> {
    return {
      title: "Time Circuits",
      destination_entity: "text.time_circuits_replica_destination_time",
      departed_entity: "text.time_circuits_replica_last_time_departed",
      date_format_entity: "select.time_circuits_replica_date_format",
      sync_entity: "button.time_circuits_replica_sync_rtc_time",
    };
  }

  setConfig(cfg: TimeCircuitsConfig) {
    if (!cfg) throw new Error("Invalid configuration");
    this._cfg = cfg;
  }

  getCardSize() {
    return 5;
  }

  connectedCallback() {
    super.connectedCallback();
    ensureDseg7Font();
    this._clockTimer = window.setInterval(() => {
      this._clockTick++;
    }, 1000);
  }

  disconnectedCallback() {
    if (this._clockTimer) window.clearInterval(this._clockTimer);
    super.disconnectedCallback();
  }

  private _state(entityId?: string): any {
    if (!entityId || !this.hass) return undefined;
    return this.hass.states[entityId];
  }

  private _dateFormat(): string {
    const st = this._state(this._cfg.date_format_entity);
    if (st && st.state && (st.state === "MD" || st.state === "DM")) return st.state;
    return DATE_FORMAT_MD;
  }

  private _presentRow(): RowModel {
    const fmt = this._dateFormat();
    const st = this._state(this._cfg.present_entity);
    if (st && st.state) {
      const parsed = parseTimeState(st.state);
      if (parsed) {
        return {
          label: "PRESENT TIME",
          parsed,
          displayMD: toDisplayOrder(parsed.monthDay, fmt),
          am: isAm(parsed.hourMin),
        };
      }
    }
    const now = new Date();
    const md = pad2(now.getMonth() + 1) + pad2(now.getDate());
    const yr = String(now.getFullYear());
    const hm = pad2(now.getHours()) + pad2(now.getMinutes());
    const parsed: ParsedTime = { monthDay: md, year: yr, hourMin: hm };
    return {
      label: "PRESENT TIME",
      parsed,
      displayMD: toDisplayOrder(parsed.monthDay, fmt),
      am: now.getHours() < 12,
    };
  }

  private _rowFromEntity(label: string, entityId?: string): RowModel {
    const st = this._state(entityId);
    const parsed = parseTimeState(st?.state);
    if (!parsed) return { label, am: true };
    const fmt = this._dateFormat();
    return {
      label,
      parsed,
      displayMD: toDisplayOrder(parsed.monthDay, fmt),
      am: isAm(parsed.hourMin),
    };
  }

  private _rowColor(kind: RowKind, theme: TimeCircuitsTheme): string {
    if (kind === "top") return theme.top_color;
    if (kind === "middle") return theme.middle_color;
    return theme.bottom_color;
  }

  private _handleSync() {
    const entityId = this._cfg.sync_entity;
    if (!entityId || !this.hass) return;
    this.hass.callService("button", "press", { entity_id: entityId });
  }

  private _setTimeEntity(entityId: string, value: string) {
    if (!this.hass) return;
    this.hass.callService("text", "set_value", { entity_id: entityId, value });
  }

  private _editRow(entityId?: string, label?: string) {
    if (!entityId || !this.hass) return;
    const st = this._state(entityId);
    const parsed = parseTimeState(st?.state);
    const fmt = this._dateFormat();
    const initialValue = parsed
      ? `${toDisplayOrder(parsed.monthDay, fmt)}${parsed.year}${parsed.hourMin}`
      : "010120250000";
    const orderLabel = fmt === "DM" ? "DDMMYYYYHHMM" : "MMDDYYYYHHMM";
    const v = window.prompt(
      `Set ${label ?? entityId}\nFormat: ${orderLabel} (12 digits)`,
      initialValue,
    );
    if (v == null) return;
    if (!/^\d{12}$/.test(v.trim())) {
      window.alert(`Value must be exactly 12 digits: ${orderLabel}`);
      return;
    }
    const trimmed = v.trim();
    const storedMD = fmt === "DM" ? trimmed.slice(2, 4) + trimmed.slice(0, 2) : trimmed.slice(0, 4);
    const storedValue = storedMD + trimmed.slice(4);
    this._setTimeEntity(entityId, storedValue);
  }

  render(): TemplateResult {
    const cfg = this._cfg;
    const theme = resolveTheme(cfg.theme);

    const top = this._rowFromEntity("DESTINATION TIME", cfg.destination_entity);
    const present = this._presentRow();
    const bottom = this._rowFromEntity("LAST TIME DEPARTED", cfg.departed_entity);

    void this._clockTick;

    return html`
      <ha-card style=${this._cardStyle(theme)}>
        <div class="bezel">
          <div class="panel" style=${this._panelStyle()}>
            ${cfg.title
              ? html`<div class="card-title" style="color:${theme.label_color}">
                  ${cfg.title}
                </div>`
              : nothing}
            ${this._renderRow(top, theme, "top", cfg.destination_entity, true)}
            ${this._renderRow(present, theme, "middle", cfg.present_entity, false)}
            ${this._renderRow(bottom, theme, "bottom", cfg.departed_entity, true)}
            ${cfg.sync_entity
              ? html`
                  <div class="sync-bar">
                    <mwc-button
                      raised
                      label="SYNC RTC"
                      style="--mdc-theme-primary:${theme.accent};--mdc-theme-on-primary:#0a0a0a"
                      @click=${() => this._handleSync()}
                    ></mwc-button>
                  </div>
                `
              : nothing}
          </div>
        </div>
      </ha-card>
    `;
  }

  private _renderRow(
    row: RowModel,
    theme: TimeCircuitsTheme,
    kind: RowKind,
    entityId?: string,
    editable?: boolean,
  ): TemplateResult {
    const color = this._rowColor(kind, theme);
    return html`
      <div class="row">
        <div class="row-label" style="color:${theme.label_color}">${row.label}</div>
        <div class="segments">
          ${row.parsed
            ? html`
                <div
                  class="seg-group ${editable ? "editable" : ""}"
                  @click=${() => editable && this._editRow(entityId, row.label)}
                >
                  ${this._renderSegment(row.displayMD ?? row.parsed.monthDay, color, false)}
                </div>
                <div
                  class="seg-group ${editable ? "editable" : ""}"
                  @click=${() => editable && this._editRow(entityId, row.label)}
                >
                  ${this._renderSegment(row.parsed.year, color, false)}
                </div>
                <div
                  class="seg-group ${editable ? "editable" : ""}"
                  @click=${() => editable && this._editRow(entityId, row.label)}
                >
                  ${this._renderSegment(row.parsed.hourMin, color, true)}
                </div>
                ${this._renderAmPm(row.am, color)}
              `
            : html`<div class="seg-group empty" style="color:#444">--:--</div>`}
        </div>
      </div>
    `;
  }

  private _renderSegment(value: string, color: string, withColon: boolean): TemplateResult {
    const chars = (value + "    ").slice(0, 4).split("");
    return html`
      <div class="led-segment" style="color:${color}">
        ${chars.map((c) => html`<span class="digit">${c}</span>`)}
        ${withColon ? html`<span class="colon">:</span>` : nothing}
      </div>
    `;
  }

  private _renderAmPm(am: boolean, color: string): TemplateResult {
    return html`
      <div class="ampm" style="color:${color}">
        <span class="ampm-label ${am ? "on" : "off"}">AM</span>
        <span class="ampm-label ${am ? "off" : "on"}">PM</span>
      </div>
    `;
  }

  private _cardStyle(theme: TimeCircuitsTheme): string {
    return [
      `background:${theme.background}`,
      `border:4px solid ${theme.bezel}`,
      `border-radius:16px`,
      `padding:0`,
      `overflow:hidden`,
    ].join(";");
  }

  private _panelStyle(): string {
    return [
      `padding:16px 18px 12px`,
      `font-family:${this._cfg.font_family ?? "'DSEG7 Classic', 'Courier New', monospace"}`,
    ].join(";");
  }

  static styles = css`
    :host { display: block; }
    ha-card { display: block; }
    .bezel {
      border: 2px solid #000;
      border-radius: 12px;
      margin: 6px;
      background: #000;
      box-shadow: inset 0 0 12px rgba(0,0,0,0.9);
    }
    .panel { display: flex; flex-direction: column; gap: 8px; }
    .card-title {
      font-size: 13px;
      letter-spacing: 3px;
      text-transform: uppercase;
      text-align: center;
      opacity: 0.6;
      margin-bottom: 6px;
      font-weight: bold;
    }
    .row {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 12px;
      background: rgba(0,0,0,0.6);
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.04);
    }
    .row-label {
      font-size: 10px;
      letter-spacing: 2.5px;
      opacity: 0.55;
      text-transform: uppercase;
      font-weight: bold;
    }
    .segments {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: nowrap;
    }
    .seg-group { cursor: default; }
    .seg-group.editable { cursor: pointer; }
    .seg-group.empty {
      font-size: 26px;
      letter-spacing: 2px;
    }
    .led-segment {
      display: inline-flex;
      align-items: center;
      font-variant-numeric: tabular-nums;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .led-segment .digit {
      font-size: 34px;
      line-height: 1;
      min-width: 0.6em;
      text-align: center;
      text-shadow:
        0 0 6px currentColor,
        0 0 14px currentColor,
        0 0 2px currentColor;
    }
    .led-segment .colon {
      font-size: 34px;
      padding: 0 2px;
      text-shadow: 0 0 8px currentColor, 0 0 16px currentColor;
      animation: blink 1s steps(2, start) infinite;
    }
    @keyframes blink { 50% { opacity: 0.25; } }
    .ampm {
      display: flex;
      flex-direction: column;
      gap: 1px;
      margin-left: 10px;
      font-weight: bold;
    }
    .ampm-label {
      font-size: 11px;
      letter-spacing: 1px;
      text-shadow: 0 0 4px currentColor;
    }
    .ampm-label.on { opacity: 1; }
    .ampm-label.off { opacity: 0.2; }
    .sync-bar {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }
    @media (max-width: 480px) {
      .led-segment .digit { font-size: 26px; }
      .led-segment .colon { font-size: 26px; }
      .segments { gap: 4px; }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "time-circuits-card": TimeCircuitsCard;
  }
}

if ((window as any).customCards) {
  (window as any).customCards.push({
    type: CARD_NAME,
    name: "Time Circuits",
    description: "Back to the Future Time Circuits replica card for ESP32 + MQTT devices.",
  });
} else {
  (window as any).customCards = [
    {
      type: CARD_NAME,
      name: "Time Circuits",
      description: "Back to the Future Time Circuits replica card for ESP32 + MQTT devices.",
    },
  ];
}

console.info(
  `%c TIME-CIRCUITS-CARD %c v${VERSION} `,
  "color: white; background: #ff2200; font-weight: bold;",
  "color: #ff2200; background: black; font-weight: bold;",
);