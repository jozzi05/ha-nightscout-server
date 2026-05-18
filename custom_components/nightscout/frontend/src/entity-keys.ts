/** Sensor description keys from `sensor.py` (`SensorEntityDescription.key`). */
export const NIGHTSCOUT_SENSOR_KEYS = ["glucose", "delta", "iob", "cob", "last_reading"] as const;

export type NightscoutSensorKey = (typeof NIGHTSCOUT_SENSOR_KEYS)[number];

export type NightscoutRegistryEntity = {
  entity_id: string;
  unique_id?: string;
  translation_key?: string | null;
};

/**
 * Match a Nightscout sensor by registry metadata.
 * Entity IDs use the sensor key slug (e.g. `_iob`), not the long translated label.
 * Unique IDs follow `{config_entry_unique_id}_{description.key}` from the integration.
 */
export function matchesNightscoutSensorKey(
  ent: NightscoutRegistryEntity,
  key: NightscoutSensorKey,
): boolean {
  if (ent.unique_id?.endsWith(`_${key}`)) {
    return true;
  }
  return ent.translation_key === key;
}

export function findNightscoutSensor(
  entities: NightscoutRegistryEntity[],
  key: NightscoutSensorKey,
): NightscoutRegistryEntity | undefined {
  return (
    entities.find((ent) => ent.unique_id?.endsWith(`_${key}`)) ??
    entities.find((ent) => ent.translation_key === key)
  );
}
