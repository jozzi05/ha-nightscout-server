"""Tests for Nightscout payload parsing."""

from datetime import datetime, timezone

UTC = timezone.utc

from custom_components.nightscout.parsers import (
    MMOL_CONVERSION,
    latest_site_change_from_treatments,
    parse_cannula_timestamp,
    parse_iso_dt,
    parse_nightscout_payload,
)


def test_glucose_mgdl_and_delta_from_two_entries() -> None:
    status = {"settings": {"units": "mg/dl"}, "version": "14.2"}
    d1 = 1_700_000_000_000
    d2 = d1 - 300_000
    entries = [
        {"type": "sgv", "sgv": 120, "date": d1, "delta": 2},
        {"type": "sgv", "sgv": 118, "date": d2},
    ]
    data = parse_nightscout_payload(status, entries, [], [])
    assert data.glucose_unit == "mg/dL"
    assert data.glucose == 120.0
    assert data.delta == 2.0
    assert data.raw_mgdl == 120.0
    assert data.nightscout_version == "14.2"


def test_glucose_mmol_conversion() -> None:
    status = {"settings": {"units": "mmol"}}
    entries = [{"type": "sgv", "sgv": 180, "date": 1_700_000_000_000}]
    data = parse_nightscout_payload(status, entries, [], [])
    assert data.glucose_unit == "mmol/L"
    expected = round(180 / MMOL_CONVERSION, 1)
    assert data.glucose == expected


def test_iob_cob_from_openaps() -> None:
    status: dict = {}
    ds = [
        {
            "date": 999,
            "openaps": {"iob": {"iob": 1.25}, "cob": {"cob": 15.0}},
        }
    ]
    data = parse_nightscout_payload(status, [], ds, [])
    assert data.iob == 1.25
    assert data.cob == 15.0


def test_profile_default_from_list() -> None:
    status = {"settings": {}}
    profile = [
        {"mills": 2000, "defaultProfile": "Exercise"},
        {"mills": 1000, "defaultProfile": "Default"},
    ]
    data = parse_nightscout_payload(status, [], [], profile)
    assert data.active_profile == "Exercise"


def test_site_change_from_treatments_picks_latest() -> None:
    older = {"eventType": "Site Change", "mills": 1_700_000_000_000}
    newer = {"eventType": "Site Change", "mills": 1_700_003_600_000}
    dt = latest_site_change_from_treatments([older, newer])
    assert dt == parse_iso_dt(newer["mills"])


def test_cannula_timestamp_does_not_use_bolus_or_status_timestamps() -> None:
    """Regression: pump.status lastbolus updated often — must not drive cannula sensor."""
    ds = {
        "pump": {
            "extended": {},
            "status": {"lastbolus": "2024-06-01T12:00:00+00:00"},
        }
    }
    assert parse_cannula_timestamp(ds) is None


def test_parse_payload_prefers_site_change_treatment_over_devicestatus() -> None:
    status = {"settings": {"units": "mg/dl"}}
    site_ms = 1_700_000_000_000
    treatments = [{"eventType": "Site Change", "mills": site_ms}]
    ds = [
        {
            "date": 999,
            "pump": {
                "extended": {},
                "status": {"lastbolus": "2025-01-01T00:00:00+00:00"},
            },
        }
    ]
    data = parse_nightscout_payload(status, [], ds, [], treatments)
    assert data.cannula_changed_at == latest_site_change_from_treatments(treatments)


def test_last_reading_timestamp() -> None:
    status = {"settings": {"units": "mg/dl"}}
    ts = datetime(2024, 1, 15, 12, 0, 0, tzinfo=UTC)
    ms = int(ts.timestamp() * 1000)
    entries = [{"type": "sgv", "sgv": 100, "date": ms}]
    data = parse_nightscout_payload(status, entries, [], [])
    assert data.last_reading_at == ts
