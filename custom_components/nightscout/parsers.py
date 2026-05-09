"""Pure parsing logic for Nightscout API payloads (no Home Assistant imports)."""

from __future__ import annotations

from dataclasses import dataclass
try:
    from datetime import UTC, datetime, timedelta
except ImportError:
    from datetime import datetime, timedelta, timezone

    UTC = timezone.utc
from typing import Any

MMOL_CONVERSION = 18.0182


def parse_iso_dt(value: Any) -> datetime | None:
    """Parse Nightscout-style date fields to UTC datetime."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        sec = float(value) / 1000.0 if value > 1e12 else float(value)
        return datetime.fromtimestamp(sec, tz=UTC)
    if isinstance(value, str):
        try:
            raw = value.replace("Z", "+00:00")
            dt = datetime.fromisoformat(raw)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=UTC)
            return dt.astimezone(UTC)
        except (ValueError, TypeError):
            return None
    return None


def _get_nested(data: dict[str, Any], *keys: str | int, default: Any = None) -> Any:
    cur: Any = data
    for key in keys:
        if not isinstance(cur, dict):
            return default
        cur = cur.get(key)
        if cur is None:
            return default
    return cur


def _entry_sort_ts(entry: dict[str, Any]) -> float:
    d = entry.get("date")
    if isinstance(d, (int, float)):
        return float(d)
    ds = entry.get("dateString")
    dt = parse_iso_dt(ds)
    return dt.timestamp() * 1000 if dt else 0.0


def entry_timestamp(entry: dict[str, Any]) -> datetime | None:
    dt = parse_iso_dt(entry.get("dateString"))
    if dt:
        return dt
    d = entry.get("date")
    return parse_iso_dt(d)


def first_sgv_entries(entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    sgv = [e for e in entries if str(e.get("type", "")).lower() == "sgv"]
    sgv.sort(key=_entry_sort_ts, reverse=True)
    return sgv


def iob_from_openaps(openaps: dict[str, Any]) -> float | None:
    for path in (
        ("iob", "iob"),
        ("iob", "iobWithTempBasal"),
        ("enacted", "iob"),
        ("suggested", "iob"),
    ):
        v = _get_nested(openaps, *path)
        if isinstance(v, (int, float)):
            return float(v)
    return None


def cob_from_openaps(openaps: dict[str, Any]) -> float | None:
    for path in (
        ("cob", "cob"),
        ("enacted", "COB"),
        ("enacted", "cob"),
        ("suggested", "COB"),
        ("suggested", "cob"),
    ):
        v = _get_nested(openaps, *path)
        if isinstance(v, (int, float)):
            return float(v)
    return None


def devicestatus_sort_ts(row: dict[str, Any]) -> float:
    for key in ("created_at", "date"):
        v = row.get(key)
        if isinstance(v, (int, float)):
            return float(v) / 1000.0 if v > 1e12 else float(v)
        if isinstance(v, str):
            dt = parse_iso_dt(v)
            if dt:
                return dt.timestamp()
    return 0.0


def latest_devicestatus_payload(rows: list[dict[str, Any]]) -> dict[str, Any] | None:
    if not rows:
        return None
    rows.sort(key=devicestatus_sort_ts, reverse=True)
    return rows[0]


def parse_pump_battery_percent(devicestatus: dict[str, Any]) -> float | None:
    pump = devicestatus.get("pump")
    if isinstance(pump, dict):
        bat = pump.get("battery")
        if isinstance(bat, dict):
            pct = bat.get("percent")
            if isinstance(pct, (int, float)):
                return float(pct)
        pct = pump.get("batteryPercent") or pump.get("battery_percent")
        if isinstance(pct, (int, float)):
            return float(pct)
    upload = devicestatus.get("uploaderBattery")
    if isinstance(upload, (int, float)):
        return float(upload)
    return None


def parse_reservoir(devicestatus: dict[str, Any]) -> float | None:
    pump = devicestatus.get("pump")
    if isinstance(pump, dict):
        res = pump.get("reservoir")
        if isinstance(res, (int, float)):
            return float(res)
        ext = pump.get("extended")
        if isinstance(ext, dict):
            res = ext.get("reservoir") or ext.get("Reservoir")
            if isinstance(res, (int, float)):
                return float(res)
    return None


def parse_cannula_timestamp(devicestatus: dict[str, Any]) -> datetime | None:
    pump = devicestatus.get("pump")
    if isinstance(pump, dict):
        ext = pump.get("extended")
        if isinstance(ext, dict):
            for key in ("cannulaAge", "CannulaAge", "siteAge", "SiteAge"):
                raw = ext.get(key)
                if isinstance(raw, (int, float)) and raw < 1e6:
                    clk = parse_iso_dt(pump.get("clock"))
                    if clk:
                        return clk - timedelta(minutes=float(raw))
            ts = ext.get("Timestamp") or ext.get("timestamp") or ext.get("lastCannulaChange")
            dt = parse_iso_dt(ts)
            if dt:
                return dt
        status = pump.get("status")
        if isinstance(status, dict):
            dt = parse_iso_dt(status.get("timestamp") or status.get("lastbolus"))
            if dt:
                return dt
    return None


def parse_sensor_timestamp(devicestatus: dict[str, Any]) -> datetime | None:
    pump = devicestatus.get("pump")
    if isinstance(pump, dict):
        ext = pump.get("extended")
        if isinstance(ext, dict):
            for key in ("sensorAge", "SensorAge"):
                raw = ext.get(key)
                if isinstance(raw, (int, float)) and raw < 1e6:
                    clk = parse_iso_dt(pump.get("clock"))
                    if clk:
                        return clk - timedelta(minutes=float(raw))
            ts = ext.get("sensorStart") or ext.get("SensorStart")
            dt = parse_iso_dt(ts)
            if dt:
                return dt
    return None


def parse_active_profile(profile_payload: Any, status: dict[str, Any]) -> str | None:
    if isinstance(profile_payload, list) and profile_payload:
        latest = max(profile_payload, key=lambda p: float(p.get("mills", 0) or 0))
        name = latest.get("defaultProfile") or latest.get("defaultprofile")
        if isinstance(name, str) and name.strip():
            return name.strip()
    if isinstance(profile_payload, dict):
        name = profile_payload.get("defaultProfile") or profile_payload.get("defaultprofile")
        if isinstance(name, str) and name.strip():
            return name.strip()
    settings = status.get("settings") if isinstance(status.get("settings"), dict) else {}
    name = settings.get("profile") or settings.get("defaultProfile")
    if isinstance(name, str) and name.strip():
        return name.strip()
    return None


def units_mmol(status: dict[str, Any]) -> bool:
    settings = status.get("settings") if isinstance(status.get("settings"), dict) else {}
    u = str(settings.get("units", "")).lower()
    return "mmol" in u


@dataclass
class NightscoutData:
    """Normalized Nightscout data for sensors."""

    glucose: float | None
    glucose_unit: str
    raw_mgdl: float | None
    delta: float | None
    direction: str | None
    iob: float | None
    cob: float | None
    last_reading_at: datetime | None
    active_profile: str | None
    reservoir: float | None
    pump_battery_percent: float | None
    cannula_changed_at: datetime | None
    sensor_started_at: datetime | None
    nightscout_version: str | None


def parse_nightscout_payload(
    status: dict[str, Any],
    entries_list: list[dict[str, Any]],
    ds_list: list[dict[str, Any]],
    profile_raw: Any,
) -> NightscoutData:
    """Build NightscoutData from raw API JSON."""
    mmol = units_mmol(status)
    sgv_entries = first_sgv_entries(entries_list)

    raw_mgdl: float | None = None
    glucose: float | None = None
    delta: float | None = None
    direction: str | None = None
    last_reading_at: datetime | None = None

    if sgv_entries:
        latest = sgv_entries[0]
        sgv = latest.get("sgv")
        if isinstance(sgv, (int, float)):
            raw_mgdl = float(sgv)
            glucose = raw_mgdl / MMOL_CONVERSION if mmol else raw_mgdl
            if mmol:
                glucose = round(glucose, 1)
            else:
                glucose = round(glucose, 0)
        direction = latest.get("direction") if isinstance(latest.get("direction"), str) else None
        d = latest.get("delta")
        if isinstance(d, (int, float)):
            delta = float(d)
            if mmol:
                delta = round(delta / MMOL_CONVERSION, 2)
        last_reading_at = entry_timestamp(latest)

        if delta is None and len(sgv_entries) >= 2:
            prev = sgv_entries[1]
            ps = prev.get("sgv")
            if isinstance(ps, (int, float)) and raw_mgdl is not None:
                delta_raw = raw_mgdl - float(ps)
                delta = delta_raw / MMOL_CONVERSION if mmol else delta_raw
                if mmol:
                    delta = round(delta, 2)
                else:
                    delta = round(delta, 1)

    ds_row = latest_devicestatus_payload(ds_list)
    iob_val: float | None = None
    cob_val: float | None = None
    reservoir: float | None = None
    pump_batt: float | None = None
    cannula_at: datetime | None = None
    sensor_at: datetime | None = None

    if isinstance(ds_row, dict):
        openaps = ds_row.get("openaps")
        if isinstance(openaps, dict):
            iob_val = iob_from_openaps(openaps)
            cob_val = cob_from_openaps(openaps)
        pump_batt = parse_pump_battery_percent(ds_row)
        reservoir = parse_reservoir(ds_row)
        cannula_at = parse_cannula_timestamp(ds_row)
        sensor_at = parse_sensor_timestamp(ds_row)

    profile_name = parse_active_profile(profile_raw, status)
    version = status.get("version") if isinstance(status.get("version"), str) else None

    return NightscoutData(
        glucose=glucose,
        glucose_unit="mmol/L" if mmol else "mg/dL",
        raw_mgdl=raw_mgdl,
        delta=delta,
        direction=direction,
        iob=iob_val,
        cob=cob_val,
        last_reading_at=last_reading_at,
        active_profile=profile_name,
        reservoir=reservoir,
        pump_battery_percent=pump_batt,
        cannula_changed_at=cannula_at,
        sensor_started_at=sensor_at,
        nightscout_version=version,
    )
