import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { NightscoutCardConfig, HomeAssistant, EntityRegistryEntry } from "./types.js";
import { DEFAULT_CONFIG } from "./types.js";

const ENTITY_KEYS = ["glucose", "delta", "iob", "cob", "last_reading"] as const;

@customElement("nightscout-card-editor")
export class NightscoutCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: NightscoutCardConfig = {
    type: "custom:nightscout-card",
    ...DEFAULT_CONFIG,
  };

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title {
      font-weight: 500;
      margin-top: 8px;
      opacity: 0.8;
    }
    label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
    }
    input[type="number"],
    input[type="color"],
    input[type="text"] {
      padding: 4px 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #000);
    }
    input[type="number"] {
      width: 70px;
    }
    input[type="color"] {
      width: 40px;
      height: 28px;
      padding: 2px;
      cursor: pointer;
    }
    select {
      padding: 4px 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #000);
    }
  `;

  setConfig(config: NightscoutCardConfig) {
    this._config = { ...DEFAULT_CONFIG, ...config };
  }

  private _fireChanged() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private async _deviceChanged(e: Event) {
    const target = e.target as HTMLSelectElement;
    const deviceId = target.value;
    this._config = { ...this._config, device_id: deviceId };

    if (!deviceId) {
      this._fireChanged();
      return;
    }

    try {
      const entities = await this.hass.callWS<EntityRegistryEntry[]>({
        type: "config/entity_registry/list",
      });
      const deviceEntities = entities.filter(
        (ent) => ent.device_id === deviceId && ent.platform === "nightscout",
      );
      const patch: Partial<NightscoutCardConfig> = {};
      for (const key of ENTITY_KEYS) {
        const match = deviceEntities.find((e) => e.entity_id.endsWith(`_${key}`));
        if (match) {
          (patch as Record<string, string>)[`${key}_entity`] = match.entity_id;
        }
      }
      this._config = { ...this._config, ...patch };
    } catch {
      // Device entity lookup failed; user can fill manually
    }

    this._fireChanged();
  }

  private _toggleChanged(field: string, e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this._config = { ...this._config, [field]: checked };
    this._fireChanged();
  }

  private _numberChanged(field: string, e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    if (!isNaN(val)) {
      this._config = { ...this._config, [field]: val };
      this._fireChanged();
    }
  }

  private _colorChanged(field: string, e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this._config = { ...this._config, [field]: val };
    this._fireChanged();
  }

  private _textChanged(field: string, e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this._config = { ...this._config, [field]: val };
    this._fireChanged();
  }

  private _buildDeviceOptions() {
    if (!this.hass) return [];
    const devices: { id: string; name: string }[] = [];
    for (const entityId of Object.keys(this.hass.states)) {
      if (entityId.startsWith("sensor.") && entityId.endsWith("_glucose")) {
        const state = this.hass.states[entityId];
        if (state) {
          const name = entityId.replace("sensor.", "").replace("_glucose", "");
          devices.push({ id: entityId, name });
        }
      }
    }
    return devices;
  }

  render() {
    const c = this._config;

    return html`
      <div class="editor">
        <div class="section-title">Device</div>
        <ha-device-picker
          .hass=${this.hass}
          .value=${c.device_id || ""}
          .includeDomains=${["nightscout"]}
          @value-changed=${(e: CustomEvent) => {
            const deviceId = e.detail.value;
            this._deviceChanged({
              target: { value: deviceId },
            } as unknown as Event);
          }}
        ></ha-device-picker>

        <div class="section-title">Visible fields</div>
        ${(
          [
            ["show_glucose", "Glucose"],
            ["show_time_ago", "Time ago"],
            ["show_delta", "Delta"],
            ["show_iob", "IOB"],
            ["show_cob", "COB"],
          ] as const
        ).map(
          ([key, label]) => html`
            <label>
              <input
                type="checkbox"
                .checked=${(c as unknown as Record<string, unknown>)[key] !== false}
                @change=${(e: Event) => this._toggleChanged(key, e)}
              />
              ${label}
            </label>
          `,
        )}

        <div class="section-title">Font size</div>
        <div class="row">
          <input
            type="range"
            min="20"
            max="72"
            .value=${String(c.font_size)}
            @input=${(e: Event) => this._numberChanged("font_size", e)}
          />
          <span>${c.font_size}px</span>
        </div>

        <div class="section-title">Glucose ranges (mg/dL)</div>
        <div class="row">
          <label
            >Urgent low
            <input
              type="number"
              .value=${String(c.urgent_low)}
              @change=${(e: Event) => this._numberChanged("urgent_low", e)}
          /></label>
          <label
            >Low
            <input
              type="number"
              .value=${String(c.low)}
              @change=${(e: Event) => this._numberChanged("low", e)}
          /></label>
        </div>
        <div class="row">
          <label
            >High
            <input
              type="number"
              .value=${String(c.high)}
              @change=${(e: Event) => this._numberChanged("high", e)}
          /></label>
          <label
            >Urgent high
            <input
              type="number"
              .value=${String(c.urgent_high)}
              @change=${(e: Event) => this._numberChanged("urgent_high", e)}
          /></label>
        </div>

        <div class="section-title">Colors</div>
        <div class="row">
          <label
            >Urgent
            <input
              type="color"
              .value=${c.color_urgent}
              @input=${(e: Event) => this._colorChanged("color_urgent", e)}
          /></label>
          <label
            >Warning
            <input
              type="color"
              .value=${c.color_warning}
              @input=${(e: Event) => this._colorChanged("color_warning", e)}
          /></label>
          <label
            >OK
            <input
              type="color"
              .value=${c.color_ok}
              @input=${(e: Event) => this._colorChanged("color_ok", e)}
          /></label>
        </div>

        <div class="section-title">Entity overrides</div>
        ${ENTITY_KEYS.map(
          (key) => html`
            <label>
              ${key.replace("_", " ")}
              <input
                type="text"
                .value=${(c as unknown as Record<string, string>)[`${key}_entity`] || ""}
                @change=${(e: Event) => this._textChanged(`${key}_entity`, e)}
                placeholder="sensor.xxx_${key}"
              />
            </label>
          `,
        )}

        <div class="section-title">Background</div>
        <label>
          Override background color
          <input
            type="text"
            .value=${c.background_color || ""}
            @change=${(e: Event) => this._textChanged("background_color", e)}
            placeholder="Leave empty for theme default"
          />
        </label>
      </div>
    `;
  }
}
