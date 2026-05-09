"""Data update coordinator for Nightscout."""

from __future__ import annotations

import logging
from typing import Any

import aiohttp
from aiohttp import ClientTimeout
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import DOMAIN
from .parsers import NightscoutData, parse_nightscout_payload

_LOGGER = logging.getLogger(__name__)


class NightscoutCoordinator(DataUpdateCoordinator[NightscoutData]):
    """Fetch Nightscout REST API."""

    def __init__(
        self,
        hass,
        *,
        url: str,
        api_secret: str | None,
        update_interval,
    ) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=update_interval,
        )
        self._url = url.rstrip("/")
        self._api_secret = (api_secret or "").strip() or None

    @property
    def base_url(self) -> str:
        """Configured Nightscout base URL."""
        return self._url

    def _headers(self) -> dict[str, str]:
        if not self._api_secret:
            return {}
        return {"api-secret": self._api_secret}

    async def _async_fetch_json(self, session: aiohttp.ClientSession, path: str) -> Any:
        url = f"{self._url}{path}"
        timeout = ClientTimeout(total=30)
        try:
            async with session.get(url, headers=self._headers(), timeout=timeout) as resp:
                if resp.status == 401 or resp.status == 403:
                    raise UpdateFailed("authentication_failed")
                if resp.status >= 400:
                    raise UpdateFailed(f"http_{resp.status}")
                return await resp.json()
        except aiohttp.ClientError as err:
            raise UpdateFailed(f"cannot_connect: {err}") from err
        except TimeoutError as err:
            raise UpdateFailed(f"timeout: {err}") from err

    async def _async_update_data(self) -> NightscoutData:
        session = async_get_clientsession(self.hass)

        try:
            status = await self._async_fetch_json(session, "/api/v1/status.json")
        except UpdateFailed:
            raise
        except Exception as err:
            raise UpdateFailed(str(err)) from err

        try:
            entries_raw = await self._async_fetch_json(session, "/api/v1/entries.json?count=48")
        except UpdateFailed:
            raise
        except Exception as err:
            raise UpdateFailed(str(err)) from err

        try:
            ds_raw = await self._async_fetch_json(session, "/api/v1/devicestatus.json?count=48")
        except UpdateFailed:
            raise
        except Exception as err:
            raise UpdateFailed(str(err)) from err

        try:
            profile_raw = await self._async_fetch_json(session, "/api/v1/profile.json")
        except UpdateFailed:
            raise
        except Exception as err:
            raise UpdateFailed(str(err)) from err

        if not isinstance(status, dict):
            status = {}
        entries_list = entries_raw if isinstance(entries_raw, list) else []
        ds_list = ds_raw if isinstance(ds_raw, list) else []

        treatments_list: list = []
        try:
            tr_raw = await self._async_fetch_json(
                session, "/api/v1/treatments.json?count=100"
            )
            treatments_list = tr_raw if isinstance(tr_raw, list) else []
        except UpdateFailed as err:
            err_key = err.args[0] if err.args else ""
            if err_key == "authentication_failed":
                raise
            _LOGGER.debug("Nightscout treatments skipped: %s", err)
        except Exception as err:
            _LOGGER.debug("Nightscout treatments skipped: %s", err)

        return parse_nightscout_payload(
            status, entries_list, ds_list, profile_raw, treatments_list
        )
