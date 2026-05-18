export interface NightscoutCardConfig {
  type: string;
  device_id?: string;
  glucose_entity?: string;
  delta_entity?: string;
  iob_entity?: string;
  cob_entity?: string;
  last_reading_entity?: string;
  show_glucose: boolean;
  show_time_ago: boolean;
  show_delta: boolean;
  show_iob: boolean;
  show_cob: boolean;
  font_size: number;
  urgent_low: number;
  urgent_high: number;
  low: number;
  high: number;
  color_urgent: string;
  color_warning: string;
  color_ok: string;
  background_color?: string;
}

export const DEFAULT_CONFIG: Omit<NightscoutCardConfig, "type"> = {
  show_glucose: true,
  show_time_ago: true,
  show_delta: true,
  show_iob: true,
  show_cob: true,
  font_size: 48,
  urgent_low: 70,
  urgent_high: 200,
  low: 85,
  high: 170,
  color_urgent: "#e74c3c",
  color_warning: "#f39c12",
  color_ok: "#2ecc71",
};

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  devices?: Record<string, DeviceRegistryEntry>;
  entities?: Record<string, HassEntityRegistryDisplay>;
  callWS: <T>(msg: Record<string, unknown>) => Promise<T>;
}

export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
  entity_id: string;
  last_changed: string;
  last_updated: string;
}

export interface HassEntityRegistryDisplay {
  entity_id: string;
  device_id?: string | null;
  platform?: string;
  unique_id?: string;
}

export interface DeviceRegistryEntry {
  id: string;
  identifiers?: [string, string][];
  name?: string;
  name_by_user?: string | null;
}

export interface EntityRegistryEntry {
  entity_id: string;
  device_id: string;
  unique_id: string;
  platform: string;
}
