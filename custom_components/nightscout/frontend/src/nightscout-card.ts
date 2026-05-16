import { LitElement, html, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cardStyles } from "./styles.js";
import type { NightscoutCardConfig, HomeAssistant } from "./types.js";
import { DEFAULT_CONFIG } from "./types.js";
import { DIRECTION_ARROWS, formatTimeAgo, getGlucoseColor } from "./utils.js";

@customElement("nightscout-card")
export class NightscoutCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: NightscoutCardConfig;
  @state() private _blinking = false;
  private _prevGlucose: string | null = null;
  private _blinkTimeout?: ReturnType<typeof setTimeout>;
  private _timeAgoInterval?: ReturnType<typeof setInterval>;
  @state() private _now = Date.now();

  static getConfigElement() {
    return document.createElement("nightscout-card-editor");
  }

  static getStubConfig() {
    return { ...DEFAULT_CONFIG };
  }

  setConfig(config: Partial<NightscoutCardConfig>) {
    this._config = { ...DEFAULT_CONFIG, ...config } as NightscoutCardConfig;
  }

  getCardSize() {
    return 2;
  }

  connectedCallback() {
    super.connectedCallback();
    this._timeAgoInterval = setInterval(() => {
      this._now = Date.now();
    }, 15000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timeAgoInterval) clearInterval(this._timeAgoInterval);
    if (this._blinkTimeout) clearTimeout(this._blinkTimeout);
  }

  updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    if (!changedProps.has("hass") || !this._config?.glucose_entity) return;

    const glucoseState = this.hass?.states[this._config.glucose_entity];
    const currentVal = glucoseState?.state ?? null;

    if (this._prevGlucose !== null && currentVal !== this._prevGlucose) {
      this._triggerBlink(glucoseState);
    }
    this._prevGlucose = currentVal;
  }

  private _triggerBlink(
    glucoseState: { state: string; attributes: Record<string, unknown> } | undefined,
  ) {
    if (!glucoseState) return;
    const rawMgdl = glucoseState.attributes.raw_mgdl as number | undefined;
    if (rawMgdl == null) return;

    const color = this._getGlucoseColor(rawMgdl);
    const card = this.shadowRoot?.querySelector("ha-card") as HTMLElement | null;
    if (!card) return;

    if (this._blinkTimeout) clearTimeout(this._blinkTimeout);
    card.style.setProperty("--blink-color", color);
    card.classList.remove("blink");
    void card.offsetWidth;
    card.classList.add("blink");

    this._blinking = true;
    this._blinkTimeout = setTimeout(() => {
      card.classList.remove("blink");
      this._blinking = false;
    }, 2000);
  }

  private _getGlucoseColor(rawMgdl: number): string {
    return getGlucoseColor(rawMgdl, this._config);
  }

  private _getValueColor(): string | undefined {
    if (!this._config?.glucose_entity) return undefined;
    const gs = this.hass?.states[this._config.glucose_entity];
    if (!gs) return undefined;
    const rawMgdl = gs.attributes.raw_mgdl as number | undefined;
    if (rawMgdl == null) return undefined;
    return this._getGlucoseColor(rawMgdl);
  }

  render() {
    if (!this._config || !this.hass) {
      return html`<ha-card
        ><div class="ns-not-available">Nightscout card not configured</div></ha-card
      >`;
    }

    const c = this._config;
    const glucoseState = c.glucose_entity ? this.hass.states[c.glucose_entity] : undefined;
    const deltaState = c.delta_entity ? this.hass.states[c.delta_entity] : undefined;
    const iobState = c.iob_entity ? this.hass.states[c.iob_entity] : undefined;
    const cobState = c.cob_entity ? this.hass.states[c.cob_entity] : undefined;
    const lastReadingState = c.last_reading_entity
      ? this.hass.states[c.last_reading_entity]
      : undefined;

    const glucoseVal = glucoseState?.state;
    const direction = glucoseState?.attributes.direction as string | undefined;
    const arrow = direction ? (DIRECTION_ARROWS[direction] ?? direction) : "";
    const deltaVal = deltaState?.state;
    const deltaUnit = deltaState?.attributes.unit_of_measurement as string | undefined;
    const iobVal = iobState?.state;
    const cobVal = cobState?.state;

    const valueColor = this._getValueColor();
    const fontSize = c.font_size;
    const secondarySize = Math.round(fontSize * 0.45);
    const timeAgoSize = Math.round(fontSize * 0.35);

    const bgStyle = c.background_color ? `background-color: ${c.background_color}` : "";

    // Force _now dependency so time-ago re-renders
    void this._now;

    return html`
      <ha-card style="${bgStyle}">
        <div class="ns-row">
          ${c.show_glucose && glucoseVal != null
            ? html`<span
                class="ns-glucose"
                style="font-size:${fontSize}px; color:${valueColor ?? "inherit"}"
                >${glucoseVal}</span
              >`
            : nothing}
          ${c.show_glucose && arrow
            ? html`<span
                class="ns-arrow"
                style="font-size:${Math.round(fontSize * 0.6)}px; color:${valueColor ?? "inherit"}"
                >${arrow}</span
              >`
            : nothing}
          ${c.show_delta && deltaVal != null
            ? html`<span class="ns-secondary" style="font-size:${secondarySize}px"
                >Δ
                ${Number(deltaVal) >= 0 ? "+" : ""}${deltaVal}${deltaUnit
                  ? ` ${deltaUnit}`
                  : ""}</span
              >`
            : nothing}
          ${c.show_iob && iobVal != null
            ? html`<span class="ns-secondary" style="font-size:${secondarySize}px"
                ><span class="ns-label">IOB</span>${iobVal}</span
              >`
            : nothing}
          ${c.show_cob && cobVal != null
            ? html`<span class="ns-secondary" style="font-size:${secondarySize}px"
                ><span class="ns-label">COB</span>${cobVal}</span
              >`
            : nothing}
        </div>
        ${c.show_time_ago && lastReadingState
          ? html`<div class="ns-time-ago" style="font-size:${timeAgoSize}px">
              ${formatTimeAgo(lastReadingState.state)}
            </div>`
          : nothing}
      </ha-card>
    `;
  }
}

import "./nightscout-card-editor.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any;
w.customCards = w.customCards || [];
w.customCards.push({
  type: "nightscout-card",
  name: "Nightscout",
  description: "Glucose monitoring card for Nightscout",
});
