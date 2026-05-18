import { beforeEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import "./nightscout-card.js";
import { NightscoutCard } from "./nightscout-card.js";
import type { NightscoutCardConfig } from "./types.js";
import { DEFAULT_CONFIG } from "./types.js";
import {
  createMockHass,
  MOCK_ENTITIES,
  MOCK_ENTITY_IDS,
  registerHaCardStub,
} from "./test-helpers/ha-stubs.js";

function baseConfig(overrides: Partial<NightscoutCardConfig> = {}): NightscoutCardConfig {
  return {
    type: "custom:nightscout-card",
    ...DEFAULT_CONFIG,
    glucose_entity: MOCK_ENTITY_IDS.glucose,
    delta_entity: MOCK_ENTITY_IDS.delta,
    iob_entity: MOCK_ENTITY_IDS.iob,
    cob_entity: MOCK_ENTITY_IDS.cob,
    last_reading_entity: MOCK_ENTITY_IDS.last_reading,
    ...overrides,
  };
}

type HassStates = Parameters<typeof createMockHass>[0];

function hassStates(overrides: HassStates = {}): HassStates {
  return {
    [MOCK_ENTITY_IDS.glucose]: MOCK_ENTITIES.glucose(),
    [MOCK_ENTITY_IDS.delta]: MOCK_ENTITIES.delta(),
    [MOCK_ENTITY_IDS.iob]: MOCK_ENTITIES.iob(),
    [MOCK_ENTITY_IDS.cob]: MOCK_ENTITIES.cob(),
    [MOCK_ENTITY_IDS.last_reading]: MOCK_ENTITIES.lastReading(),
    ...overrides,
  };
}

type MountCardOptions = {
  config?: Partial<NightscoutCardConfig>;
  hass: HassStates | null;
};

async function mountCard({ config = {}, hass }: MountCardOptions) {
  const card = document.createElement("nightscout-card") as NightscoutCard;
  card.setConfig(baseConfig(config));
  if (hass !== null) {
    card.hass = createMockHass(hass);
  }
  document.body.appendChild(card);
  await card.updateComplete;
  return card;
}

describe("NightscoutCard (browser)", () => {
  beforeEach(() => {
    registerHaCardStub();
    document.body.innerHTML = "";
  });

  it("shows not configured when hass is missing", async () => {
    await mountCard({ hass: null });

    await expect
      .element(page.getByTestId("not-configured"))
      .toHaveTextContent("Nightscout card not configured");
  });

  it("renders glucose value and direction arrow", async () => {
    await mountCard({ hass: hassStates() });

    await expect.element(page.getByTestId("glucose-value")).toHaveTextContent("120");
    await expect.element(page.getByTestId("direction-arrow")).toHaveTextContent("→");
  });

  it("hides delta when show_delta is false", async () => {
    await mountCard({ config: { show_delta: false }, hass: hassStates() });

    await expect.element(page.getByTestId("delta")).not.toBeInTheDocument();
  });

  it("hides IOB when show_iob is false", async () => {
    await mountCard({ config: { show_iob: false }, hass: hassStates() });

    await expect.element(page.getByTestId("iob")).not.toBeInTheDocument();
  });

  it("hides COB when show_cob is false", async () => {
    await mountCard({ config: { show_cob: false }, hass: hassStates() });

    await expect.element(page.getByTestId("cob")).not.toBeInTheDocument();
  });

  it("matches DOM snapshot", async () => {
    const card = await mountCard({
      hass: hassStates(),
      config: { show_time_ago: false },
    });

    await expect.element(page.elementLocator(card)).toMatchAriaSnapshot();
  });

  it("applies glucose color from raw_mgdl", async () => {
    await mountCard({
      hass: hassStates({
        [MOCK_ENTITY_IDS.glucose]: MOCK_ENTITIES.glucose({
          state: "55",
          attributes: { direction: "SingleDown", raw_mgdl: 55 },
        }),
      }),
    });

    // Browsers normalize hex colors to rgb in inline styles
    await expect
      .element(page.getByTestId("glucose-value"))
      .toHaveStyle({ color: "rgb(231, 76, 60)" });
  });
});
