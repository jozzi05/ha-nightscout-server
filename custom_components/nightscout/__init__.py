"""The Nightscout integration."""

from __future__ import annotations

from datetime import timedelta
import logging
from pathlib import Path
from typing import TYPE_CHECKING, Any

from .const import (
    CONF_API_SECRET,
    CONF_SCAN_INTERVAL,
    CONF_URL,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
)

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

PLATFORMS = ["sensor"]

CARD_JS = "nightscout-card.js"
CARD_URL_BASE = f"/{DOMAIN}"
CARD_URL = f"{CARD_URL_BASE}/{CARD_JS}"
_FRONTEND_REGISTERED = False

import json as _json

_MANIFEST_VERSION = _json.loads(
    (Path(__file__).parent / "manifest.json").read_text()
).get("version", "0.0.0")


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up Nightscout."""
    return True


async def _async_register_frontend(hass: HomeAssistant) -> None:
    """Register the Lovelace card JS as a static path and Lovelace resource."""
    global _FRONTEND_REGISTERED  # noqa: PLW0603
    if _FRONTEND_REGISTERED:
        return

    js_path = Path(__file__).parent / CARD_JS
    if not js_path.is_file():
        _LOGGER.debug("Nightscout card JS not found at %s, skipping", js_path)
        return

    from homeassistant.components.http import StaticPathConfig

    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(js_path), False)]
    )

    url_with_version = f"{CARD_URL}?v={_MANIFEST_VERSION}"

    lovelace = hass.data.get("lovelace")
    if lovelace and hasattr(lovelace, "resources"):
        resources = lovelace.resources
        if hasattr(resources, "async_load") and not resources.loaded:
            await resources.async_load()
        existing = [
            r for r in resources.async_items()
            if r.get("url", "").startswith(CARD_URL)
        ]
        if existing:
            resource = existing[0]
            if resource.get("url") != url_with_version:
                await resources.async_update_item(
                    resource["id"], {"url": url_with_version}
                )
        else:
            await resources.async_create_item(
                {"res_type": "module", "url": url_with_version}
            )

    _FRONTEND_REGISTERED = True
    _LOGGER.debug("Registered Nightscout card at %s", CARD_URL)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Nightscout from a config entry."""
    from .coordinator import NightscoutCoordinator

    await _async_register_frontend(hass)

    scan_interval = entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)
    coordinator = NightscoutCoordinator(
        hass,
        url=entry.data[CONF_URL],
        api_secret=entry.data.get(CONF_API_SECRET),
        update_interval=timedelta(seconds=int(scan_interval)),
    )

    await coordinator.async_config_entry_first_refresh()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = coordinator

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok and hass.data.get(DOMAIN):
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle removal of config entry."""
    if hass.data.get(DOMAIN):
        hass.data[DOMAIN].pop(entry.entry_id, None)


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload integration when options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    from .coordinator import NightscoutCoordinator

    coordinator: NightscoutCoordinator | None = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    data = entry.data.copy()
    if CONF_API_SECRET in data and data.get(CONF_API_SECRET):
        data[CONF_API_SECRET] = "** redacted **"

    diag: dict[str, Any] = {
        "entry": {
            "title": entry.title,
            "unique_id": entry.unique_id,
            "data": data,
            "options": dict(entry.options),
        },
    }

    if coordinator and coordinator.data:
        d = coordinator.data
        diag["nightscout"] = {
            "version": d.nightscout_version,
            "glucose_unit": d.glucose_unit,
            "last_reading_at": d.last_reading_at.isoformat() if d.last_reading_at else None,
        }
    else:
        diag["nightscout"] = None

    if coordinator and coordinator.last_exception:
        diag["last_error"] = repr(coordinator.last_exception)
    else:
        diag["last_error"] = None

    return diag
