import { beforeEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import "./nightscout-card-editor.js";
import { NightscoutCardEditor } from "./nightscout-card-editor.js";
import type { NightscoutCardConfig } from "./types.js";
import { DEFAULT_CONFIG } from "./types.js";
import {
  createMockHass,
  type CreateMockHassOptions,
  MOCK_ENTITY_REGISTRY,
  MOCK_ENTITIES,
  mockNightscoutRegistry,
} from "./test-helpers/ha-stubs.js";

function editorConfig(overrides: Partial<NightscoutCardConfig> = {}): NightscoutCardConfig {
  return {
    type: "custom:nightscout-card",
    ...DEFAULT_CONFIG,
    ...overrides,
  };
}

type HassStates = Parameters<typeof createMockHass>[0];

function hassStates(overrides: HassStates = {}): HassStates {
  return {
    "sensor.nightscout_glucose": MOCK_ENTITIES.glucose(),
    "sensor.nightscout_delta": MOCK_ENTITIES.delta(),
    "sensor.nightscout_iob": MOCK_ENTITIES.iob(),
    "sensor.nightscout_cob": MOCK_ENTITIES.cob(),
    "sensor.nightscout_last_reading": MOCK_ENTITIES.lastReading(),
    ...overrides,
  };
}

function hassWithNightscout(overrides: HassStates = {}) {
  return {
    states: hassStates(overrides),
    ...mockNightscoutRegistry(),
  };
}

type MountEditorOptions = {
  config?: Partial<NightscoutCardConfig>;
  hass: HassStates | null;
  callWS?: CreateMockHassOptions["callWS"];
  devices?: CreateMockHassOptions["devices"];
  entities?: CreateMockHassOptions["entities"];
};

type ConfigChangedEvent = CustomEvent<{ config: NightscoutCardConfig }>;

function lastEmittedConfig(onConfigChanged: ReturnType<typeof vi.fn>): NightscoutCardConfig {
  const calls = onConfigChanged.mock.calls as [ConfigChangedEvent][];
  const event = calls[calls.length - 1]?.[0];
  if (!event) {
    throw new Error("expected config-changed event");
  }
  return event.detail.config;
}

async function mountEditor({ config = {}, hass, callWS, devices, entities }: MountEditorOptions) {
  const editor = document.createElement("nightscout-card-editor") as NightscoutCardEditor;
  editor.setConfig(editorConfig(config));
  if (hass !== null) {
    editor.hass = createMockHass(hass, {
      ...(callWS !== undefined ? { callWS } : {}),
      ...(devices !== undefined ? { devices } : {}),
      ...(entities !== undefined ? { entities } : {}),
    });
  }
  document.body.appendChild(editor);
  await editor.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  return editor;
}

describe("NightscoutCardEditor (browser)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the editor shell and site picker with options", async () => {
    const { states, devices, entities } = hassWithNightscout();
    await mountEditor({ hass: states, devices, entities });

    await expect.element(page.getByTestId("editor")).toBeInTheDocument();
    await expect.element(page.getByTestId("device-picker")).toBeInTheDocument();
    await expect.element(page.getByText("nightscout.example.com")).toBeInTheDocument();
    await expect.element(page.getByTestId("toggle-show_glucose")).toBeChecked();
  });

  it("shows empty hint when no nightscout devices exist", async () => {
    await mountEditor({ hass: hassStates() });

    await expect.element(page.getByTestId("device-picker-empty")).toBeInTheDocument();
  });

  it("emits config-changed when a visibility toggle is unchecked", async () => {
    const { states, devices, entities } = hassWithNightscout();
    const editor = await mountEditor({ hass: states, devices, entities });
    const onConfigChanged = vi.fn();
    editor.addEventListener("config-changed", onConfigChanged);

    await page.getByTestId("toggle-show_cob").click();

    expect(onConfigChanged).toHaveBeenCalled();
    expect(lastEmittedConfig(onConfigChanged).show_cob).toBe(false);
  });

  it("updates font size and emits config-changed", async () => {
    const { states, devices, entities } = hassWithNightscout();
    const editor = await mountEditor({
      hass: states,
      devices,
      entities,
      config: { font_size: 48 },
    });
    const onConfigChanged = vi.fn();
    editor.addEventListener("config-changed", onConfigChanged);

    const range = page.getByTestId("font-size");
    await range.fill("56");

    await expect.element(page.getByTestId("font-size-value")).toHaveTextContent("56px");
    expect(lastEmittedConfig(onConfigChanged).font_size).toBe(56);
  });

  it("maps nightscout entities when a site is selected", async () => {
    const { states, devices, entities } = hassWithNightscout();
    const onConfigChanged = vi.fn();
    const editor = await mountEditor({ hass: states, devices, entities });
    editor.addEventListener("config-changed", onConfigChanged);

    await page.getByTestId("device-picker").selectOptions("dev-nightscout-1");

    const config = lastEmittedConfig(onConfigChanged);
    expect(config.device_id).toBe("dev-nightscout-1");
    expect(config.glucose_entity).toBe("sensor.nightscout_glucose");
    expect(config.delta_entity).toBe("sensor.nightscout_delta");
    expect(config.iob_entity).toBe("sensor.nightscout_iob");
    expect(config.cob_entity).toBe("sensor.nightscout_cob");
    expect(config.last_reading_entity).toBe("sensor.nightscout_last_reading");
  });

  it("maps entities via callWS when hass.entities is not populated", async () => {
    const onConfigChanged = vi.fn();
    const editor = await mountEditor({
      hass: hassStates(),
      callWS: async <T>(msg: Record<string, unknown>): Promise<T> => {
        if (msg.type === "config/entity_registry/list") {
          return MOCK_ENTITY_REGISTRY as T;
        }
        throw new Error(`unexpected callWS: ${String(msg.type)}`);
      },
    });
    editor.addEventListener("config-changed", onConfigChanged);

    await expect.element(page.getByTestId("device-picker")).toBeInTheDocument();
    await page.getByTestId("device-picker").selectOptions("dev-nightscout-1");

    expect(lastEmittedConfig(onConfigChanged).glucose_entity).toBe("sensor.nightscout_glucose");
  });

  it("matches DOM snapshot", async () => {
    const { states, devices, entities } = hassWithNightscout();
    const editor = await mountEditor({
      hass: states,
      devices,
      entities,
      config: {
        device_id: "dev-nightscout-1",
        glucose_entity: "sensor.nightscout_glucose",
        delta_entity: "sensor.nightscout_delta",
        iob_entity: "sensor.nightscout_iob",
        cob_entity: "sensor.nightscout_cob",
        last_reading_entity: "sensor.nightscout_last_reading",
      },
    });

    await expect.element(page.getByTestId("editor")).toBeInTheDocument();
    await expect.element(page.elementLocator(editor)).toMatchAriaSnapshot();
  });

  it("emits config-changed when an entity override is edited", async () => {
    const { states, devices, entities } = hassWithNightscout();
    const editor = await mountEditor({ hass: states, devices, entities });
    const onConfigChanged = vi.fn();
    editor.addEventListener("config-changed", onConfigChanged);

    await userEvent.fill(page.getByTestId("entity-glucose"), "sensor.custom_glucose");
    await userEvent.tab();

    await expect.poll(() => onConfigChanged.mock.calls.length).toBeGreaterThan(0);
    expect(lastEmittedConfig(onConfigChanged).glucose_entity).toBe("sensor.custom_glucose");
  });
});
