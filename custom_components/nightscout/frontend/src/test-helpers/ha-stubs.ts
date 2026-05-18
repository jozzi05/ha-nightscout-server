import type {
  DeviceRegistryEntry,
  EntityRegistryEntry,
  HassEntity,
  HassEntityRegistryDisplay,
  HomeAssistant,
} from "../types.js";

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

export function registerHaDevicePickerStub(): void {
  if (customElements.get("ha-device-picker")) return;

  class HaDevicePickerStub extends HTMLElement {
    private _select?: HTMLSelectElement;

    connectedCallback() {
      this._render();
    }

    set value(deviceId: string) {
      this.setAttribute("value", deviceId);
      if (this._select) this._select.value = deviceId;
    }

    get value(): string {
      return this._select?.value ?? this.getAttribute("value") ?? "";
    }

    private _render() {
      const select = document.createElement("select");
      select.setAttribute("data-testid", "device-picker");
      for (const [id, label] of [
        ["", "None"],
        ["dev-nightscout-1", "Nightscout"],
      ] as const) {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = label;
        select.appendChild(option);
      }
      select.value = this.value;
      select.addEventListener("change", () => {
        this.dispatchEvent(
          new CustomEvent("value-changed", {
            detail: { value: select.value },
            bubbles: true,
            composed: true,
          }),
        );
      });
      this.replaceChildren(select);
      this._select = select;
    }
  }

  customElements.define("ha-device-picker", HaDevicePickerStub);
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

export type CreateMockHassOptions = {
  callWS?: HomeAssistant["callWS"];
  devices?: Record<string, DeviceRegistryEntry>;
  entities?: Record<string, HassEntityRegistryDisplay>;
};

export function createMockHass(
  states: Record<string, Partial<HassEntity> & { state: string }>,
  options: CreateMockHassOptions = {},
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
    ...(options.devices !== undefined ? { devices: options.devices } : {}),
    ...(options.entities !== undefined ? { entities: options.entities } : {}),
    callWS:
      options.callWS ??
      (async () => {
        throw new Error("callWS not implemented in test mock");
      }),
  };
}

/** Default Nightscout device + entity registry rows for editor tests. */
export function mockNightscoutRegistry(
  deviceId = "dev-nightscout-1",
  siteLabel = "nightscout.example.com",
): Pick<CreateMockHassOptions, "devices" | "entities"> {
  const entities: Record<string, HassEntityRegistryDisplay> = {};
  for (const entry of MOCK_ENTITY_REGISTRY) {
    entities[entry.entity_id] = {
      entity_id: entry.entity_id,
      device_id: deviceId,
      platform: "nightscout",
      unique_id: entry.unique_id,
    };
  }
  return {
    devices: {
      [deviceId]: {
        id: deviceId,
        identifiers: [["nightscout", "config-entry-1"]],
        name: siteLabel,
      },
    },
    entities,
  };
}

export const MOCK_ENTITY_REGISTRY: EntityRegistryEntry[] = [
  {
    entity_id: "sensor.nightscout_glucose",
    device_id: "dev-nightscout-1",
    unique_id: "nightscout_glucose",
    platform: "nightscout",
  },
  {
    entity_id: "sensor.nightscout_delta",
    device_id: "dev-nightscout-1",
    unique_id: "nightscout_delta",
    platform: "nightscout",
  },
  {
    entity_id: "sensor.nightscout_iob",
    device_id: "dev-nightscout-1",
    unique_id: "nightscout_iob",
    platform: "nightscout",
  },
  {
    entity_id: "sensor.nightscout_cob",
    device_id: "dev-nightscout-1",
    unique_id: "nightscout_cob",
    platform: "nightscout",
  },
  {
    entity_id: "sensor.nightscout_last_reading",
    device_id: "dev-nightscout-1",
    unique_id: "nightscout_last_reading",
    platform: "nightscout",
  },
];

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
