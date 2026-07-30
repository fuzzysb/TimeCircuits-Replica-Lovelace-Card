import { css, LitElement, html, nothing } from "lit";
import { property, state, customElement } from "lit/decorators.js";
const DEFAULT_THEME = {
  background: "#1a1a1a",
  bezel: "#3a3a3a",
  label_color: "#c8c8c8",
  digit_color: "#ff5500",
  digit_dim: "#2a1408",
  ampm_active: "#ff5500",
  ampm_inactive: "#3a1a0a",
  accent: "#ffb011"
};
function resolveTheme(cfg) {
  return { ...DEFAULT_THEME, ...cfg || {} };
}
const DATE_FORMAT_MD = "MD";
const DATE_FORMAT_DM = "DM";
function parseTimeState(raw) {
  if (!raw) return void 0;
  const s = raw.trim();
  if (!/^\d{12}$/.test(s)) return void 0;
  return {
    monthDay: s.slice(0, 4),
    year: s.slice(4, 8),
    hourMin: s.slice(8, 12)
  };
}
function toDisplayOrder(md, format) {
  if (md.length !== 4) return md;
  if (format === DATE_FORMAT_DM) return md.slice(2, 4) + md.slice(0, 2);
  return md;
}
function isAm(hourStr) {
  const h = parseInt(hourStr.slice(0, 2), 10);
  return Number.isFinite(h) ? h < 12 : true;
}
function pad2(n) {
  return n < 10 ? "0" + n : String(n);
}
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
const THEME_KEYS = [
  { key: "background", label: "Background" },
  { key: "bezel", label: "Bezel" },
  { key: "label_color", label: "Labels" },
  { key: "digit_color", label: "Digit (lit)" },
  { key: "digit_dim", label: "Digit (dim)" },
  { key: "ampm_active", label: "AM/PM active" },
  { key: "ampm_inactive", label: "AM/PM inactive" },
  { key: "accent", label: "Accent" }
];
let TimeCircuitsEditor = class extends LitElement {
  constructor() {
    super(...arguments);
    this._cfg = {};
    this._showAdvanced = false;
  }
  setConfig(cfg) {
    this._cfg = { ...cfg };
  }
  _fire(changed) {
    const ev = new CustomEvent("config-changed", {
      detail: { config: { ...this._cfg, ...changed } }
    });
    this.dispatchEvent(ev);
  }
  _entity(kind, key) {
    const entities = this.hass ? Object.keys(this.hass.states) : [];
    const filtered = entities.filter((e) => e.startsWith(kind + "."));
    const current = this._cfg[key];
    return html`
      <ha-select
        label=${this._labelFor(key)}
        .value=${current ?? ""}
        @selected=${(e) => this._fire({ [key]: e.target.value || void 0 })}
        @closed=${(e) => e.stopPropagation()}
        clearable
      >
        ${filtered.map(
      (e) => html`<mwc-list-item .value=${e}>${e}</mwc-list-item>`
    )}
      </ha-select>
    `;
  }
  _labelFor(key) {
    switch (key) {
      case "destination_entity":
        return "Destination Time (top)";
      case "departed_entity":
        return "Last Time Departed (bottom)";
      case "present_entity":
        return "Present Time (middle, optional)";
      case "date_format_entity":
        return "Date Format select";
      case "sync_entity":
        return "Sync RTC button";
      default:
        return String(key);
    }
  }
  render() {
    const theme = { ...DEFAULT_THEME, ...this._cfg.theme || {} };
    return html`
      <div class="form">
        <div class="section">
          <div class="section-title">Entities</div>
          ${this._entity("text", "destination_entity")}
          ${this._entity("text", "departed_entity")}
          ${this._entity("text", "present_entity")}
          ${this._entity("select", "date_format_entity")}
          ${this._entity("button", "sync_entity")}
        </div>

        <div class="section">
          <div class="section-title">Display</div>
          <ha-textfield
            label="Title"
            .value=${this._cfg.title ?? ""}
            @input=${(e) => this._fire({ title: e.target.value || void 0 })}
          ></ha-textfield>
          <ha-textfield
            label="Font family (optional)"
            .value=${this._cfg.font_family ?? ""}
            @input=${(e) => this._fire({ font_family: e.target.value || void 0 })}
          ></ha-textfield>
        </div>

        <div class="section">
          <div class="row">
            <div class="section-title">Theme</div>
            <ha-switch
              .checked=${this._showAdvanced}
              @change=${(e) => this._showAdvanced = e.target.checked}
            ></ha-switch>
            <span class="adv-label">all colors</span>
          </div>
          ${this._showAdvanced ? THEME_KEYS.map(
      (t) => html`
                  <div class="color-row">
                    <span>${t.label}</span>
                    <input
                      type="color"
                      .value=${theme[t.key]}
                      @input=${(e) => this._fire({ theme: { ...theme, [t.key]: e.target.value } })}
                    />
                  </div>
                `
    ) : html`
              <div class="color-row">
                <span>Digit color</span>
                <input
                  type="color"
                  .value=${theme.digit_color}
                  @input=${(e) => this._fire({ theme: { ...theme, digit_color: e.target.value } })}
                />
              </div>
              <div class="color-row">
                <span>Background</span>
                <input
                  type="color"
                  .value=${theme.background}
                  @input=${(e) => this._fire({ theme: { ...theme, background: e.target.value } })}
                />
              </div>
            `}
        </div>
      </div>
    `;
  }
};
TimeCircuitsEditor.styles = css`
    :host { display: block; }
    .form { display: flex; flex-direction: column; gap: 16px; }
    .section { display: flex; flex-direction: column; gap: 12px; }
    .section-title { font-weight: 600; font-size: 13px; opacity: 0.8; }
    .row { display: flex; align-items: center; gap: 8px; }
    .adv-label { font-size: 12px; opacity: 0.7; }
    .color-row {
      display: flex; align-items: center;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 13px;
    }
    input[type="color"] { width: 40px; height: 28px; border: none; background: none; cursor: pointer; }
    ha-select { width: 100%; }
    ha-textfield { width: 100%; }
  `;
__decorateClass$1([
  property({ attribute: false })
], TimeCircuitsEditor.prototype, "hass", 2);
__decorateClass$1([
  state()
], TimeCircuitsEditor.prototype, "_cfg", 2);
__decorateClass$1([
  state()
], TimeCircuitsEditor.prototype, "_showAdvanced", 2);
TimeCircuitsEditor = __decorateClass$1([
  customElement("time-circuits-editor")
], TimeCircuitsEditor);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
const VERSION = "1.0.0";
const CARD_NAME = "time-circuits-card";
let TimeCircuitsCard = class extends LitElement {
  constructor() {
    super(...arguments);
    this._cfg = {};
    this._clockTick = 0;
  }
  static getConfigElement() {
    return document.createElement("time-circuits-editor");
  }
  static getStubConfig() {
    return {
      title: "Time Circuits",
      destination_entity: "text.timecircuits_top_time",
      departed_entity: "text.timecircuits_bot_time",
      date_format_entity: "select.timecircuits_dateformat",
      sync_entity: "button.timecircuits_sync_btn"
    };
  }
  setConfig(cfg) {
    if (!cfg) throw new Error("Invalid configuration");
    this._cfg = cfg;
  }
  getCardSize() {
    return 4;
  }
  connectedCallback() {
    super.connectedCallback();
    this._clockTimer = window.setInterval(() => {
      this._clockTick++;
    }, 1e3);
  }
  disconnectedCallback() {
    if (this._clockTimer) window.clearInterval(this._clockTimer);
    super.disconnectedCallback();
  }
  _state(entityId) {
    if (!entityId || !this.hass) return void 0;
    return this.hass.states[entityId];
  }
  _dateFormat() {
    const st = this._state(this._cfg.date_format_entity);
    if (st && st.state && (st.state === "MD" || st.state === "DM")) return st.state;
    return DATE_FORMAT_MD;
  }
  /** Build the present-time row: prefer present_entity, else HA server time. */
  _presentRow() {
    const fmt = this._dateFormat();
    const st = this._state(this._cfg.present_entity);
    if (st && st.state) {
      const parsed2 = parseTimeState(st.state);
      if (parsed2) {
        return {
          label: "PRESENT TIME",
          parsed: parsed2,
          displayMD: toDisplayOrder(parsed2.monthDay, fmt),
          am: isAm(parsed2.hourMin)
        };
      }
    }
    const now = /* @__PURE__ */ new Date();
    let md;
    if (fmt === "DM") md = pad2(now.getDate()) + pad2(now.getMonth() + 1);
    else md = pad2(now.getMonth() + 1) + pad2(now.getDate());
    const yr = String(now.getFullYear());
    const hm = pad2(now.getHours()) + pad2(now.getMinutes());
    const parsed = { monthDay: md, year: yr, hourMin: hm };
    return {
      label: "PRESENT TIME",
      parsed,
      displayMD: toDisplayOrder(parsed.monthDay, fmt),
      am: now.getHours() < 12
    };
  }
  _rowFromEntity(label, entityId) {
    const st = this._state(entityId);
    const parsed = parseTimeState(st == null ? void 0 : st.state);
    if (!parsed) return { label, am: true };
    const fmt = this._dateFormat();
    return {
      label,
      parsed,
      displayMD: toDisplayOrder(parsed.monthDay, fmt),
      am: isAm(parsed.hourMin)
    };
  }
  _handleSync() {
    const entityId = this._cfg.sync_entity;
    if (!entityId || !this.hass) return;
    this.hass.callService("button", "press", { entity_id: entityId });
  }
  _setTimeEntity(entityId, value) {
    if (!this.hass) return;
    this.hass.callService("text", "set_value", { entity_id: entityId, value });
  }
  _editRow(entityId, label) {
    if (!entityId || !this.hass) return;
    const st = this._state(entityId);
    const parsed = parseTimeState(st == null ? void 0 : st.state);
    const initialValue = parsed ? `${parsed.monthDay}${parsed.year}${parsed.hourMin}` : "010120250000";
    const v = window.prompt(`Set ${label ?? entityId}
Format: MMDDYYYYHHMM (12 digits)`, initialValue);
    if (v == null) return;
    if (!/^\d{12}$/.test(v.trim())) {
      window.alert("Value must be exactly 12 digits: MMDDYYYYHHMM");
      return;
    }
    this._setTimeEntity(entityId, v.trim());
  }
  render() {
    const cfg = this._cfg;
    const theme = resolveTheme(cfg.theme);
    const top = this._rowFromEntity("DESTINATION TIME", cfg.destination_entity);
    const present = this._presentRow();
    const bottom = this._rowFromEntity("LAST TIME DEPARTED", cfg.departed_entity);
    void this._clockTick;
    return html`
      <ha-card
        style=${this._cardStyle(theme, cfg)}
        @action=${() => {
    }}
      >
        <div class="panel" style=${this._panelStyle(theme)}>
          ${cfg.title ? html`<div class="card-title" style="color:${theme.label_color}">${cfg.title}</div>` : nothing}
          ${this._renderRow(top, theme, cfg.destination_entity, true)}
          ${this._renderRow(present, theme, cfg.present_entity, false)}
          ${this._renderRow(bottom, theme, cfg.departed_entity, true)}
          ${cfg.sync_entity ? html`
                <div class="sync-bar">
                  <mwc-button
                    raised
                    label="SYNC RTC"
                    style="--mdc-theme-primary:${theme.accent};--mdc-theme-on-primary:#1a1a1a"
                    @click=${() => this._handleSync()}
                  ></mwc-button>
                </div>
              ` : nothing}
        </div>
      </ha-card>
    `;
  }
  _renderRow(row, theme, entityId, editable) {
    return html`
      <div class="row" style="color:${theme.label_color}">
        <div class="row-label">${row.label}</div>
        <div class="segments">
          ${row.parsed ? html`
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
              ` : html`<div class="seg-group empty">--:--</div>`}
        </div>
      </div>
    `;
  }
  _renderSegment(value, theme, withColon) {
    const chars = (value + "    ").slice(0, 4).split("");
    return html`
      <div class="led-segment">
        ${chars.map((c, i) => html`<span class="digit" style="color:${theme.digit_color}">${c}</span>`)}
        ${withColon ? html`<span class="colon" style="color:${theme.digit_color}">:</span>` : nothing}
      </div>
    `;
  }
  _renderAmPm(am, theme) {
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
  _cardStyle(theme, cfg) {
    return [
      `background:${theme.background}`,
      `border:6px solid ${theme.bezel}`,
      `border-radius:14px`,
      `padding:0`,
      `overflow:hidden`
    ].join(";");
  }
  _panelStyle(theme) {
    return [
      `padding:18px 16px 14px`,
      `font-family:${this._cfg.font_family ?? "'DSEG7 Classic', 'Courier New', monospace"}`
    ].join(";");
  }
};
TimeCircuitsCard.styles = css`
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
__decorateClass([
  property({ attribute: false })
], TimeCircuitsCard.prototype, "hass", 2);
__decorateClass([
  state()
], TimeCircuitsCard.prototype, "_cfg", 2);
__decorateClass([
  state()
], TimeCircuitsCard.prototype, "_clockTick", 2);
TimeCircuitsCard = __decorateClass([
  customElement(CARD_NAME)
], TimeCircuitsCard);
if (window.customCards) {
  window.customCards.push({
    type: CARD_NAME,
    name: "Time Circuits",
    description: "Back to the Future Time Circuits replica card for ESP32 + MQTT devices."
  });
} else {
  window.customCards = [
    {
      type: CARD_NAME,
      name: "Time Circuits",
      description: "Back to the Future Time Circuits replica card for ESP32 + MQTT devices."
    }
  ];
}
console.info(
  `%c TIME-CIRCUITS-CARD %c v${VERSION} `,
  "color: white; background: #ff5500; font-weight: bold;",
  "color: #ff5500; background: black; font-weight: bold;"
);
export {
  TimeCircuitsCard
};
