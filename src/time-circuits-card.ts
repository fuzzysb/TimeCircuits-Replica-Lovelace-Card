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
  DATE_FORMAT_MD,
} from "./types";
import "./time-circuits-editor";

const VERSION = "1.0.0";

// Name of the custom card as referenced in the visual editor / Lovelace config.
const CARD_NAME = "time-circuits-card";

interface RowModel {
  label: string;
  parsed?: ParsedTime;
  /** Display order string for the MMDD group (after applying date format). */
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
      destination_entity: "text.timecircuits_top_time",
      departed_entity: "text.timecircuits_bot_time",
      date_format_entity: "select.timecircuits_dateformat",
      sync_entity: "button.timecircuits_sync_btn",
    };
  }

  setConfig(cfg: TimeCircuitsConfig) {
    if (!cfg) throw new Error("Invalid configuration");
    this._cfg = cfg;
  }

  getCardSize() {
    return 4;
  }

  connectedCallback() {
    super.connectedCallback();
    // 1s tick drives the present-time fallback (HA server time).
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

  /** Build the present-time row: prefer present_entity, else HA server time. */
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
    // Fallback: HA server time (this.hass.locale or just JS Date in local TZ).
    const now = new Date();
    let md: string;
    if (fmt === "DM") md = pad2(now.getDate()) + pad2(now.getMonth() + 1);
    else md = pad2(now.getMonth() + 1) + pad2(now.getDate());
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

  private _rowFromEntity(
    label: string,
    entityId?: string,
  ): RowModel {
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
    const initialValue = parsed
      ? `${parsed.monthDay}${parsed.year}${parsed.hourMin}`
      : "010120250000";
    const v = window.prompt(`Set ${label ?? entityId}\nFormat: MMDDYYYYHHMM (12 digits)`, initialValue);
    if (v == null) return;
    if (!/^\d{12}$/.test(v.trim())) {
      window.alert("Value must be exactly 12 digits: MMDDYYYYHHMM");
      return;
    }
    this._setTimeEntity(entityId, v.trim());
  }

  render(): TemplateResult {
    const cfg = this._cfg;
    const theme = resolveTheme(cfg.theme);

    const top = this._rowFromEntity("DESTINATION TIME", cfg.destination_entity);
    const present = this._presentRow();
    const bottom = this._rowFromEntity("LAST TIME DEPARTED", cfg.departed_entity);

    // Touch _clockTick so Lit re-renders every second when using fallback.
    void this._clockTick;

    return html`
      <ha-card
        style=${this._cardStyle(theme, cfg)}
        @action=${() => {}}
      >
        <div class="panel" style=${this._panelStyle(theme)}>
          ${cfg.title
            ? html`<div class="card-title" style="color:${theme.label_color}">${cfg.title}</div>`
            : nothing}
          ${this._renderRow(top, theme, cfg.destination_entity, true)}
          ${this._renderRow(present, theme, cfg.present_entity, false)}
          ${this._renderRow(bottom, theme, cfg.departed_entity, true)}
          ${cfg.sync_entity
            ? html`
                <div class="sync-bar">
                  <mwc-button
                    raised
                    label="SYNC RTC"
                    style="--mdc-theme-primary:${theme.accent};--mdc-theme-on-primary:#1a1a1a"
                    @click=${() => this._handleSync()}
                  ></mwc-button>
                </div>
              `
            : nothing}
        </div>
      </ha-card>
    `;
  }

  private _renderRow(
    row: RowModel,
    theme: TimeCircuitsTheme,
    entityId?: string,
    editable?: boolean,
  ): TemplateResult {
    return html`
      <div class="row" style="color:${theme.label_color}">
        <div class="row-label">${row.label}</div>
        <div class="segments">
          ${row.parsed
            ? html`
                <div class="seg-group" @click=${() => editable && this._editRow(entityId, row.label)}>
                  ${this._renderSegment(row.displayMD ?? row.parsed.monthDay, theme, false)}
                </div>
                <div class="seg-group" @click=${() => editable && this._editRow(entityId, row.label)}>
                  ${this._renderSegment(row.parsed.year, theme, false)}
                </div>
                <div class="seg-group" @click=${() => editable && this._editRow(entityId, row.label)}>
                  ${this._renderSegment(row.parsed.hourMin, theme, true)}
                </div>
                ${this._renderAmPm(row.am, theme)}
              `
            : html`<div class="seg-group empty">--:--</div>`}
        </div>
      </div>
    `;
  }

  private _renderSegment(value: string, theme: TimeCircuitsTheme, withColon: boolean): TemplateResult {
    const chars = (value + "    ").slice(0, 4).split("");
    return html`
      <div class="led-segment">
        ${chars.map((c, i) => html`<span class="digit" style="color:${theme.digit_color}">${c}</span>`)}
        ${withColon ? html`<span class="colon" style="color:${theme.digit_color}">:</span>` : nothing}
      </div>
    `;
  }

  private _renderAmPm(am: boolean, theme: TimeCircuitsTheme): TemplateResult {
    return html`
      <div class="ampm">
        <span
          class="ampm-label ${am ? "on" : "off"}"
          style="color:${am ? theme.ampm_active : theme.ampm_inactive}"
        >AM</span>
        <span
          class="ampm-label ${am ? "off" : "on"}"
          style="color:${am ? theme.ampm_inactive : theme.ampm_active}"
        >PM</span>
      </div>
    `;
  }

  private _cardStyle(theme: TimeCircuitsTheme, cfg: TimeCircuitsConfig): string {
    return [
      `background:${theme.background}`,
      `border:6px solid ${theme.bezel}`,
      `border-radius:14px`,
      `padding:0`,
      `overflow:hidden`,
    ].join(";");
  }

  private _panelStyle(theme: TimeCircuitsTheme): string {
    return [
      `padding:18px 16px 14px`,
      `font-family:${this._cfg.font_family ?? "'DSEG7 Classic', 'Courier New', monospace"}`,
    ].join(";");
  }

  static styles = css`
    :host { display: block; }
    ha-card { display: block; }
    .panel { display: flex; flex-direction: column; gap: 10px; }
    .card-title {
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-align: center;
      opacity: 0.7;
      margin-bottom: 4px;
    }
    .row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 6px 10px;
      background: rgba(0,0,0,0.25);
      border-radius: 8px;
    }
    .row-label {
      font-size: 11px;
      letter-spacing: 2px;
      opacity: 0.6;
      text-transform: uppercase;
    }
    .segments {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .seg-group { cursor: pointer; }
    .seg-group.empty {
      color: #555;
      font-size: 22px;
      letter-spacing: 2px;
    }
    .led-segment {
      display: inline-flex;
      align-items: center;
      font-variant-numeric: tabular-nums;
      font-weight: bold;
      letter-spacing: 1px;
      text-shadow: 0 0 6px currentColor;
    }
    .led-segment .digit {
      font-size: 30px;
      line-height: 1;
      min-width: 0.62em;
      text-align: center;
      text-shadow: 0 0 8px currentColor, 0 0 2px currentColor;
    }
    .led-segment .colon {
      font-size: 30px;
      padding: 0 4px;
      text-shadow: 0 0 8px currentColor;
    }
    .ampm {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-left: 8px;
    }
    .ampm-label {
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 1px;
      opacity: 0.5;
    }
    .ampm-label.on { opacity: 1; }
    .ampm-label.off { opacity: 0.25; }
    .sync-bar {
      display: flex;
      justify-content: center;
      margin-top: 6px;
    }
    @media (max-width: 480px) {
      .led-segment .digit { font-size: 24px; }
      .led-segment .colon { font-size: 24px; }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "time-circuits-card": TimeCircuitsCard;
  }
}

// ---- Register with the Lovelace customCards system ----
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
  "color: white; background: #ff5500; font-weight: bold;",
  "color: #ff5500; background: black; font-weight: bold;",
);