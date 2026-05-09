"""Config flow for Nightscout."""

from __future__ import annotations

from typing import Any
from urllib.parse import urlparse

import aiohttp
from aiohttp import ClientTimeout
import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import (
    CONF_ALLOW_HTTP,
    CONF_API_SECRET,
    CONF_SCAN_INTERVAL,
    CONF_URL,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MAX_SCAN_INTERVAL,
    MIN_SCAN_INTERVAL,
)
from .url import normalize_nightscout_url

STEP_USER_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_URL): str,
        vol.Optional(CONF_ALLOW_HTTP, default=False): bool,
    }
)

STEP_SECRET_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_API_SECRET, default=""): str,
    }
)


async def validate_input(hass: HomeAssistant, data: dict[str, Any]) -> dict[str, str]:
    """Validate user input and return title for the entry."""
    url = normalize_nightscout_url(data[CONF_URL], allow_http=data.get(CONF_ALLOW_HTTP, False))
    secret = (data.get(CONF_API_SECRET) or "").strip() or None

    session = async_get_clientsession(hass)
    headers: dict[str, str] = {}
    if secret:
        headers["api-secret"] = secret

    timeout = ClientTimeout(total=30)
    req_url = f"{url}/api/v1/status.json"

    try:
        async with session.get(req_url, headers=headers, timeout=timeout) as resp:
            if resp.status in (401, 403):
                raise InvalidAuth
            if resp.status >= 400:
                raise CannotConnect
            await resp.json()
    except InvalidAuth:
        raise
    except (aiohttp.ClientError, TimeoutError, ValueError) as err:
        raise CannotConnect from err

    parsed = urlparse(url)
    title = parsed.netloc or url
    return {"title": title, "url": url}


class CannotConnect(Exception):
    """Unable to connect to Nightscout."""


class InvalidAuth(Exception):
    """Invalid API secret."""


class NightscoutConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Nightscout config flow."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialize flow."""
        self._user_input: dict[str, Any] = {}

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Ask for Nightscout URL."""
        errors: dict[str, str] = {}

        if user_input is not None:
            try:
                normalize_nightscout_url(
                    user_input[CONF_URL], allow_http=user_input.get(CONF_ALLOW_HTTP, False)
                )
            except ValueError:
                errors["base"] = "http_not_allowed"
            else:
                self._user_input = user_input
                return await self.async_step_api_secret()

        return self.async_show_form(
            step_id="user",
            data_schema=STEP_USER_SCHEMA,
            errors=errors,
        )

    async def async_step_api_secret(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Optional API secret."""
        errors: dict[str, str] = {}

        if user_input is not None:
            merged = {**self._user_input, **user_input}
            try:
                info = await validate_input(self.hass, merged)
            except CannotConnect:
                errors["base"] = "cannot_connect"
            except InvalidAuth:
                errors["base"] = "invalid_auth"
            except ValueError:
                errors["base"] = "http_not_allowed"
            else:
                parsed = urlparse(info["url"])
                unique_base = (parsed.netloc + parsed.path.rstrip("/")).lower()
                if not unique_base:
                    unique_base = info["url"].lower()
                await self.async_set_unique_id(unique_base)
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title=info["title"],
                    data={
                        CONF_URL: info["url"],
                        CONF_API_SECRET: (user_input.get(CONF_API_SECRET) or "").strip(),
                        CONF_ALLOW_HTTP: self._user_input.get(CONF_ALLOW_HTTP, False),
                    },
                    options={CONF_SCAN_INTERVAL: DEFAULT_SCAN_INTERVAL},
                )

        return self.async_show_form(
            step_id="api_secret",
            data_schema=STEP_SECRET_SCHEMA,
            errors=errors,
        )

    @staticmethod
    @config_entries.callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> NightscoutOptionsFlow:
        """Options flow."""
        return NightscoutOptionsFlow()


class NightscoutOptionsFlow(config_entries.OptionsFlow):
    """Nightscout options."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage options."""
        if user_input is not None:
            return self.async_create_entry(title="", data={}, options=user_input)

        current = self.config_entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_SCAN_INTERVAL,
                        default=current,
                    ): vol.All(vol.Coerce(int), vol.Range(min=MIN_SCAN_INTERVAL, max=MAX_SCAN_INTERVAL)),
                }
            ),
        )
