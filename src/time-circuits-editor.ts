import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { TimeCircuitsConfig, TimeCircuitsTheme } from "./types";
import { DEFAULT_THEME } from "./types";

const THEME_KEYS: { key: keyof TimeCircuitsTheme; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "bezel", label: "Bezel" },
  { key: "label_color", label: "Labels" },
  { key: "top_color", label: "Top (Destination)" },
  { key: "middle_color", label: "Middle (Present)" },
  { key: "bottom_color", label: "Bottom (Departed)" },
  { key: "accent", label: "Accent / button" },
];

@customElement("time-circuits-editor")
export class TimeCircuitsEditor extends LitElement {
  @property({ attribute: false }) hass?: any;
  @state() _cfg: TimeCircuitsConfig = {};
  @state() _showAdvanced = false;

  setConfig(cfg: TimeCircuitsConfig) {
    this._cfg = { ...cfg };
  }

  private _fire(changed: Partial<TimeCircuitsConfig>) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: { ...this._cfg, ...changed } },
      }),
    );
  }

  private _entity(kind: "text" | "select" | "button", key: keyof TimeCircuitsConfig) {
    const entities = this.hass ? Object.keys(this.hass.states) : [];
    const filtered = entities.filter((e) => e.startsWith(kind + ".")).sort();
    const current = (this._cfg as any)[key] as string | undefined;
    return html`
      <ha-select
        label=${this._labelFor(key)}
        .value=${current ?? ""}
        @selected=${(e: any) => {
          const idx = e.target.selectedIndex;
          if (idx >= 0 && idx < filtered.length) {
            this._fire({ [key]: filtered[idx] } as any);
          }
        }}
        @closed=${(e: any) => e.stopPropagation()}
        clearable
      >
        ${filtered.map((e) => html`<mwc-list-item .value=${e}>${e}</mwc-list-item>`)}
      </ha-select>
    `;
  }

  private _labelFor(key: keyof TimeCircuitsConfig): string {
    switch (key) {
      case "destination_entity": return "Destination Time (top, red)";
      case "departed_entity": return "Last Time Departed (bottom, yellow)";
      case "present_entity": return "Present Time (middle, green)";
      case "date_format_entity": return "Date Format select (MD/DM)";
      case "sync_entity": return "Sync RTC button";
      default: return String(key);
    }
  }

  render() {
    const theme = { ...DEFAULT_THEME, ...(this._cfg.theme || {}) };
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
            @input=${(e: any) => this._fire({ title: e.target.value || undefined })}
          ></ha-textfield>
          <ha-textfield
            label="Font family (optional)"
            .value=${this._cfg.font_family ?? ""}
            @input=${(e: any) => this._fire({ font_family: e.target.value || undefined })}
          ></ha-textfield>
        </div>

        <div class="section">
          <div class="row">
            <div class="section-title">Theme</div>
            <ha-switch
              .checked=${this._showAdvanced}
              @change=${(e: any) => (this._showAdvanced = e.target.checked)}
            ></ha-switch>
            <span class="adv-label">all colors</span>
          </div>
          ${this._showAdvanced
            ? THEME_KEYS.map(
                (t) => html`
                  <div class="color-row">
                    <span>${t.label}</span>
                    <input
                      type="color"
                      .value=${theme[t.key]}
                      @input=${(e: any) =>
                        this._fire({ theme: { ...theme, [t.key]: e.target.value } })}
                    />
                  </div>
                `,
              )
            : html`
              <div class="color-row">
                <span>Top (Destination)</span>
                <input
                  type="color"
                  .value=${theme.top_color}
                  @input=${(e: any) =>
                    this._fire({ theme: { ...theme, top_color: e.target.value } })}
                />
              </div>
              <div class="color-row">
                <span>Middle (Present)</span>
                <input
                  type="color"
                  .value=${theme.middle_color}
                  @input=${(e: any) =>
                    this._fire({ theme: { ...theme, middle_color: e.target.value } })}
                />
              </div>
              <div class="color-row">
                <span>Bottom (Departed)</span>
                <input
                  type="color"
                  .value=${theme.bottom_color}
                  @input=${(e: any) =>
                    this._fire({ theme: { ...theme, bottom_color: e.target.value } })}
                />
              </div>
            `}
        </div>
      </div>
    `;
  }

  static styles = css`
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
}

declare global {
  interface HTMLElementTagNameMap {
    "time-circuits-editor": TimeCircuitsEditor;
  }
}