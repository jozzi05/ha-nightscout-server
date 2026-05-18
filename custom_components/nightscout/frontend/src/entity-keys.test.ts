import { describe, expect, it } from "vitest";
import { findNightscoutSensor, matchesNightscoutSensorKey } from "./entity-keys.js";

describe("matchesNightscoutSensorKey", () => {
  it("matches by unique_id suffix from sensor.py", () => {
    expect(
      matchesNightscoutSensorKey(
        {
          entity_id: "sensor.nightscout_example_com_iob",
          unique_id: "nightscout.example.com_iob",
        },
        "iob",
      ),
    ).toBe(true);
  });

  it("does not match a misleading entity_id when unique_id does not match", () => {
    expect(
      matchesNightscoutSensorKey(
        {
          entity_id: "sensor.nightscout_iob",
          unique_id: "some_other_sensor",
        },
        "iob",
      ),
    ).toBe(false);
  });

  it("matches by translation_key when present", () => {
    expect(
      matchesNightscoutSensorKey(
        {
          entity_id: "sensor.custom_slug",
          translation_key: "cob",
        },
        "cob",
      ),
    ).toBe(true);
  });
});

describe("findNightscoutSensor", () => {
  it("returns the IOB entity by unique_id, not a misleading entity_id", () => {
    const entities = [
      {
        entity_id: "sensor.nightscout_iob",
        unique_id: "legacy_wrong_sensor",
      },
      {
        entity_id: "sensor.nightscout_example_com_iob",
        unique_id: "nightscout.example.com_iob",
        translation_key: "iob",
      },
    ];

    expect(findNightscoutSensor(entities, "iob")?.entity_id).toBe(
      "sensor.nightscout_example_com_iob",
    );
  });
});
