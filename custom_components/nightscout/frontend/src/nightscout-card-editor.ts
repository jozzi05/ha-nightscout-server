import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { editorStyles } from "./styles.js";
import type { EntityRegistryEntry, HomeAssistant, NightscoutCardConfig } from "./types.js";
import { DEFAULT_CONFIG } from "./types.js";

const ENTITY_KEYS = ["glucose", "delta", "iob", "cob", "last_reading"] as const;
const NIGHTSCOUT_DOMAIN = "nightscout";

const ENTITY_LABELS: Record<(typeof ENTITY_KEYS)[number], string> = {
  glucose: "Glucose",
  delta: "Delta",
  iob: "IOB",
  cob: "COB",
  last_reading: "Last reading",
};

const VISIBLE_FIELDS = [
  ["show_glucose", "Glucose"],
  ["show_time_ago", "Time ago"],
  ["show_delta", "Delta"],
  ["show_iob", "IOB"],
  ["show_cob", "COB"],
] as const;

type NightscoutSite = { deviceId: string; label: string };

@customElement("nightscout-card-editor")
export class NightscoutCardEditor extends LitElement {
  static styles = editorStyles;

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: NightscoutCardConfig = {
    type: "custom:nightscout-card",
    ...DEFAULT_CONFIG,
  };
  @state() private _registryCache: EntityRegistryEntry[] | null = null;
  @state() private _registryReady = false;

  setConfig(config: NightscoutCardConfig) {
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      type: "custom:nightscout-card",
    };
  }

  protected async firstUpdated() {
    try {
      await this._loadEntityRegistry();
    } catch (err) {
      console.warn("Nightscout card: could not load entity registry", err);
    } finally {
      this._registryReady = true;
    }
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

  private _entitiesFromHass(): EntityRegistryEntry[] {
    if (!this.hass?.entities) return [];
    return Object.values(this.hass.entities)
      .filter((ent) => ent.platform === NIGHTSCOUT_DOMAIN && ent.device_id)
      .map((ent) => ({
        entity_id: ent.entity_id,
        device_id: ent.device_id!,
        platform: ent.platform!,
        unique_id: ent.unique_id ?? "",
      }));
  }

  private async _loadEntityRegistry(): Promise<EntityRegistryEntry[]> {
    if (this._registryCache) return this._registryCache;

    const fromHass = this._entitiesFromHass();
    if (fromHass.length > 0) {
      this._registryCache = fromHass;
      return fromHass;
    }

    const list = await this.hass.callWS<EntityRegistryEntry[]>({
      type: "config/entity_registry/list",
    });
    this._registryCache = list;
    return list;
  }

  private _discoverNightscoutSites(registry: EntityRegistryEntry[]): NightscoutSite[] {
    const glucoseByDevice = new Map<string, EntityRegistryEntry>();
    for (const ent of registry) {
      if (ent.platform !== NIGHTSCOUT_DOMAIN || !ent.device_id) continue;
      if (!ent.entity_id.endsWith("_glucose") && !ent.unique_id.endsWith("_glucose")) continue;
      glucoseByDevice.set(ent.device_id, ent);
    }

    const sites: NightscoutSite[] = [];
    for (const [deviceId, glucoseEnt] of glucoseByDevice) {
      const device = this.hass.devices?.[deviceId];
      const label =
        device?.name_by_user ||
        device?.name ||
        glucoseEnt.entity_id.replace(/^sensor\./, "").replace(/_glucose$/, "");
      sites.push({ deviceId, label });
    }
    return sites.sort((a, b) => a.label.localeCompare(b.label));
  }

  private _applyDeviceEntities(
    deviceId: string,
    registry: EntityRegistryEntry[],
  ): Partial<NightscoutCardConfig> {
    const deviceEntities = registry.filter(
      (ent) => ent.device_id === deviceId && ent.platform === NIGHTSCOUT_DOMAIN,
    );
    const patch: Partial<NightscoutCardConfig> = {};
    for (const key of ENTITY_KEYS) {
      const match = deviceEntities.find(
        (e) => e.entity_id.endsWith(`_${key}`) || e.unique_id.endsWith(`_${key}`),
      );
      if (match) {
        (patch as Record<string, string>)[`${key}_entity`] = match.entity_id;
      }
    }
    return patch;
  }

  private async _deviceChanged(e: Event) {
    const deviceId = (e.target as HTMLSelectElement).value;
    this._config = { ...this._config, device_id: deviceId || undefined };

    if (!deviceId) {
      this._fireChanged();
      return;
    }

    try {
      const registry = await this._loadEntityRegistry();
      this._config = { ...this._config, ...this._applyDeviceEntities(deviceId, registry) };
    } catch (err) {
      console.warn("Nightscout card: could not map entities for device", err);
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

  private _renderSitePicker(sites: NightscoutSite[], deviceId: string | undefined) {
    if (!this._registryReady) {
      return html`<p class="hint" data-testid="device-picker-loading">Loading sites…</p>`;
    }
    if (sites.length === 0) {
      return html`<p class="hint" data-testid="device-picker-empty">
        No Nightscout devices found. Add the integration under Settings → Devices, then reopen this
        editor.
      </p>`;
    }
    return html`
      <select
        class="field-select"
        data-testid="device-picker"
        .value=${deviceId || ""}
        @change=${this._deviceChanged}
      >
        <option value="">Select a site</option>
        ${sites.map(
          (site) => html`
            <option value=${site.deviceId} ?selected=${deviceId === site.deviceId}>
              ${site.label}
            </option>
          `,
        )}
      </select>
    `;
  }

  render() {
    if (!this.hass) {
      return html`<div class="editor" data-testid="editor">Loading…</div>`;
    }

    const c = this._config;
    const registry = this._registryCache ?? this._entitiesFromHass();
    const sites = this._discoverNightscoutSites(registry);

    return html`
      <div class="editor" data-testid="editor">
        <section class="panel">
          <h3 class="panel-title">Nightscout site</h3>
          ${this._renderSitePicker(sites, c.device_id)}
        </section>

        <section class="panel">
          <h3 class="panel-title">Visible fields</h3>
          <div class="checkbox-grid">
            ${VISIBLE_FIELDS.map(
              ([key, label]) => html`
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    data-testid="toggle-${key}"
                    .checked=${(c as unknown as Record<string, unknown>)[key] !== false}
                    @change=${(e: Event) => this._toggleChanged(key, e)}
                  />
                  ${label}
                </label>
              `,
            )}
          </div>
        </section>

        <section class="panel">
          <h3 class="panel-title">Font size</h3>
          <div class="slider-row">
            <input
              type="range"
              data-testid="font-size"
              min="20"
              max="72"
              .value=${String(c.font_size)}
              @input=${(e: Event) => this._numberChanged("font_size", e)}
            />
            <span class="slider-value" data-testid="font-size-value">${c.font_size}px</span>
          </div>
        </section>

        <section class="panel">
          <h3 class="panel-title">Glucose ranges (mg/dL)</h3>
          <div class="range-grid">
            <label class="range-field">
              Urgent low
              <input
                type="number"
                class="field-number"
                data-testid="urgent-low"
                .value=${String(c.urgent_low)}
                @change=${(e: Event) => this._numberChanged("urgent_low", e)}
              />
            </label>
            <label class="range-field">
              Low
              <input
                type="number"
                class="field-number"
                data-testid="low"
                .value=${String(c.low)}
                @change=${(e: Event) => this._numberChanged("low", e)}
              />
            </label>
            <label class="range-field">
              High
              <input
                type="number"
                class="field-number"
                data-testid="high"
                .value=${String(c.high)}
                @change=${(e: Event) => this._numberChanged("high", e)}
              />
            </label>
            <label class="range-field">
              Urgent high
              <input
                type="number"
                class="field-number"
                data-testid="urgent-high"
                .value=${String(c.urgent_high)}
                @change=${(e: Event) => this._numberChanged("urgent_high", e)}
              />
            </label>
          </div>
        </section>

        <section class="panel">
          <h3 class="panel-title">Colors</h3>
          <div class="color-row">
            <label class="color-field">
              Urgent
              <input
                type="color"
                data-testid="color-urgent"
                .value=${c.color_urgent}
                @input=${(e: Event) => this._colorChanged("color_urgent", e)}
              />
            </label>
            <label class="color-field">
              Warning
              <input
                type="color"
                data-testid="color-warning"
                .value=${c.color_warning}
                @input=${(e: Event) => this._colorChanged("color_warning", e)}
              />
            </label>
            <label class="color-field">
              OK
              <input
                type="color"
                data-testid="color-ok"
                .value=${c.color_ok}
                @input=${(e: Event) => this._colorChanged("color_ok", e)}
              />
            </label>
          </div>
        </section>

        <section class="panel">
          <h3 class="panel-title">Entity overrides</h3>
          <p class="hint">Filled automatically when you select a site. Edit only if needed.</p>
          <div class="entity-list">
            ${ENTITY_KEYS.map(
              (key) => html`
                <div class="entity-field">
                  <span class="entity-label">${ENTITY_LABELS[key]}</span>
                  <input
                    type="text"
                    class="field-input"
                    data-testid="entity-${key}"
                    .value=${(c as unknown as Record<string, string>)[`${key}_entity`] || ""}
                    @change=${(e: Event) => this._textChanged(`${key}_entity`, e)}
                    placeholder="sensor.example_${key}"
                  />
                </div>
              `,
            )}
          </div>
        </section>

        <section class="panel">
          <h3 class="panel-title">Background</h3>
          <div class="entity-field">
            <span class="entity-label">Card background</span>
            <input
              type="text"
              class="field-input"
              data-testid="background-color"
              .value=${c.background_color || ""}
              @change=${(e: Event) => this._textChanged("background_color", e)}
              placeholder="Leave empty for theme default"
            />
          </div>
        </section>
      </div>
    `;
  }
}
