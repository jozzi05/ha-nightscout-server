import type { HassEntity, HomeAssistant } from "../types.js";

export function registerHaCardStub(): void {
  if (customElements.get("ha-card")) return;

  class HaCardStub extends HTMLElement {
    connectedCallback() {
      if (!this.children.length) {
        const slot = document.createElement("p");
        slot.setAttribute("data-ha-card-stub", "");
        this.appendChild(slot);
      }
    }
  }

  customElements.define("ha-card", HaCardStub);
}

function defaultEntity(
  entityId: string,
  state: string,
  attributes: Record<string, unknown> = {},
): HassEntity {
  const now = "2026-05-16T22:00:00.000Z";
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: now,
    last_updated: now,
  };
}

export function createMockHass(
  states: Record<string, Partial<HassEntity> & { state: string }>,
): HomeAssistant {
  const fullStates: Record<string, HassEntity> = {};
  for (const [entityId, partial] of Object.entries(states)) {
    fullStates[entityId] = {
      ...defaultEntity(entityId, partial.state, partial.attributes ?? {}),
      ...partial,
      entity_id: entityId,
    };
  }

  return {
    states: fullStates,
    callWS: async () => {
      throw new Error("callWS not implemented in test mock");
    },
  };
}

export const MOCK_ENTITIES = {
  glucose: (overrides: Partial<HassEntity> = {}) =>
    ({
      state: "120",
      attributes: { direction: "Flat", raw_mgdl: 120, unit_of_measurement: "mg/dL" },
      ...overrides,
    }) as Partial<HassEntity> & { state: string },

  delta: (state = "5") =>
    ({
      state,
      attributes: { unit_of_measurement: "mg/dL" },
    }) as Partial<HassEntity> & { state: string },

  iob: (state = "1.2") => ({ state }) as Partial<HassEntity> & { state: string },

  cob: (state = "15") => ({ state }) as Partial<HassEntity> & { state: string },

  lastReading: (iso = "2026-05-16T21:55:00.000Z") =>
    ({ state: iso }) as Partial<HassEntity> & { state: string },
};
