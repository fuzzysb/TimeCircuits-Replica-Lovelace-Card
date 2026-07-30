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
    console.debug(`[time-circuits] ${label} entity=${entityId} state=${JSON.stringify(st?.state)} parsed=${parsed ? "OK" : "FAIL"}`);
    if (!parsed) {
      return { label, am: true };
    }
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
    if (!top.parsed || !bottom.parsed) {
      console.debug("[time-circuits] render: top.parsed=", !!top.parsed, "bottom.parsed=", !!bottom.parsed, "hass=", !!this.hass);
    }

    return html`
      <ha-card style=${this._cardStyle(theme)}>
        <div class="bezel">
          <div class="panel" style=${this._panelStyle()}>
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
    const p = row.parsed;
    const md = row.displayMD ?? p?.monthDay;
    const click = editable ? () => this._editRow(entityId, row.label) : undefined;
    return html`
      <div class="row">
        <div
          class="segments ${editable ? "editable" : ""} ${p ? "" : "empty"}"
          @click=${click}
        >
          <div class="col col-two">
            <div class="col-head"><span class="dymo">MONTH</span><span class="dymo">DAY</span></div>
            <div class="col-body">
              ${this._renderPair(md?.slice(0, 2), color)}
              <span class="seg-gap"></span>
              ${this._renderPair(md?.slice(2, 4), color)}
            </div>
          </div>
          <div class="col col-one">
            <div class="col-head"><span class="dymo">YEAR</span></div>
            <div class="col-body">${this._renderYear(p?.year, color)}</div>
          </div>
          <div class="col col-ampm">
            <div class="col-body">${this._renderAmPm(row.am, color)}</div>
          </div>
          <div class="col col-two">
            <div class="col-head"><span class="dymo">HOUR</span><span class="dymo">MIN</span></div>
            <div class="col-body">
              ${this._renderPair(p?.hourMin?.slice(0, 2), color)}
              <span class="colon" style="color:${color}">:</span>
              ${this._renderPair(p?.hourMin?.slice(2, 4), color)}
            </div>
          </div>
        </div>
        <div class="row-label-wrap"><span class="row-label-dymo">${row.label}</span></div>
      </div>
    `;
  }

  private _renderPair(value: string | undefined, color: string): TemplateResult {
    const v = value && value.length >= 2 ? value.slice(0, 2) : "--";
    return html`<span class="led-pair" style="color:${color}">
      <span class="digit">${v[0]}</span><span class="digit">${v[1]}</span>
    </span>`;
  }

  private _renderYear(value: string | undefined, color: string): TemplateResult {
    const v = value && value.length === 4 ? value : "----";
    return html`<span class="led-year" style="color:${color}">
      ${v.split("").map((c) => html`<span class="digit">${c}</span>`)}
    </span>`;
  }

  private _renderAmPm(am: boolean, color: string): TemplateResult {
    return html`
      <div class="ampm-stack" style="--lamp:${color}">
        <span class="dymo">AM</span>
        <div class="ampm-lamp ${am ? "on" : "off"}"></div>
        <span class="dymo">PM</span>
        <div class="ampm-lamp ${am ? "off" : "on"}"></div>
      </div>
    `;
  }

  private _cardStyle(theme: TimeCircuitsTheme): string {
    return [
      `background:${theme.background}`,
      `border:6px solid #1a1a1a`,
      `border-radius:14px`,
      `padding:0`,
      `overflow:hidden`,
    ].join(";");
  }

  private _panelStyle(): string {
    return [
      `padding:10px 12px 8px`,
      `--led-font:${this._cfg.font_family ?? "'DSEG7 Classic', 'Courier New', monospace"}`,
    ].join(";");
  }

  static styles = css`
    :host { display: block; }
    ha-card { display: block; }
    .bezel {
      border: 3px solid #1a1a1a;
      border-radius: 10px;
      margin: 4px;
      background:
        linear-gradient(180deg, #d0d0d0 0%, #a8a8a8 30%, #888 70%, #707070 100%);
      box-shadow:
        inset 0 1px 0 #e8e8e8,
        inset 0 -2px 6px rgba(0,0,0,0.5),
        0 2px 6px rgba(0,0,0,0.6);
    }
    .panel {
      display: flex;
      flex-direction: column;
      gap: 0;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      padding: 8px 6px 6px;
    }
    .card-title {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 11px;
      letter-spacing: 4px;
      text-transform: uppercase;
      text-align: center;
      opacity: 0.55;
      margin: 2px 0 6px;
      font-weight: 700;
      color: #222;
    }
    .row {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 6px 4px 5px;
      position: relative;
    }
    .row + .row { border-top: 1px solid #606060; }
    .segments {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 0;
      flex-wrap: nowrap;
    }
    .segments.editable { cursor: pointer; }
    .segments.empty { color: #444; }
    .col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 0 8px;
    }
    .col + .col {
      border-left: 2px solid #787878;
      box-shadow: inset 1px 0 0 #b8b8b8;
    }
    .col-head {
      display: flex;
      justify-content: center;
      gap: 4px;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    .dymo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #b71c1c;
      color: #fff;
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 2px 5px;
      border-radius: 2px;
      min-width: 2.5em;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.25),
        inset 0 -1px 0 rgba(0,0,0,0.4),
        0 1px 1px rgba(0,0,0,0.5);
    }
    .col-one .dymo { min-width: 4em; }
    .col-body {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 4px 6px 3px;
      background: #000;
      border-radius: 3px;
      box-shadow:
        inset 0 0 5px rgba(0,0,0,0.9),
        inset 0 1px 2px rgba(0,0,0,0.7),
        0 1px 0 #d0d0d0,
        0 2px 2px rgba(0,0,0,0.3);
    }
    .led-pair, .led-year {
      display: inline-flex;
      align-items: center;
      font-family: var(--led-font);
      font-variant-numeric: tabular-nums;
      font-weight: 400;
      letter-spacing: 1px;
    }
    .seg-gap { width: 6px; display: inline-block; }
    .digit {
      font-size: 30px;
      line-height: 1;
      min-width: 0.62em;
      text-align: center;
      text-shadow:
        0 0 5px currentColor,
        0 0 12px currentColor,
        0 0 2px currentColor;
    }
    .colon {
      font-family: var(--led-font);
      font-size: 30px;
      line-height: 1;
      padding: 0 2px;
      text-shadow: 0 0 6px currentColor, 0 0 14px currentColor;
      animation: blink 1s steps(2, start) infinite;
    }
    @keyframes blink { 50% { opacity: 0.2; } }
    .ampm-stack {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
    }
    .ampm-lamp {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #2a2a2a;
      border: 2px solid #888;
      box-sizing: border-box;
      transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
    }
    .ampm-lamp.on {
      background: var(--lamp);
      border-color: #ccc;
      box-shadow:
        0 0 6px var(--lamp),
        0 0 12px var(--lamp),
        inset 0 0 3px rgba(255,255,255,0.6);
    }
    .ampm-lamp.off { background: #1a1a1a; box-shadow: none; }
    .row-label-wrap {
      display: flex;
      justify-content: center;
      margin-top: 2px;
    }
    .row-label-dymo {
      display: inline-block;
      background: #111;
      color: #fff;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      padding: 3px 14px;
      border-radius: 3px;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.12),
        inset 0 -1px 0 rgba(0,0,0,0.6),
        0 1px 2px rgba(0,0,0,0.5);
    }
    .sync-bar {
      display: flex;
      justify-content: center;
      margin-top: 6px;
      padding-bottom: 2px;
    }
    @media (max-width: 480px) {
      .digit { font-size: 22px; }
      .colon { font-size: 22px; }
      .col { padding: 0 5px; }
      .row { padding: 5px 2px 4px; }
      .dymo { font-size: 6px; padding: 2px 4px; }
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