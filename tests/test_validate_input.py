"""Tests for config flow validation (requires Home Assistant imports)."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

pytest.importorskip("homeassistant")

from custom_components.nightscout.config_flow import (
    CONF_ALLOW_HTTP,
    CONF_API_SECRET,
    CONF_URL,
    CannotConnect,
    InvalidAuth,
    validate_input,
)


def _mock_session(*, status: int, json_body: dict) -> MagicMock:
    """Build a mock aiohttp session for `async with session.get(...) as resp`."""
    mock_resp = AsyncMock()
    mock_resp.status = status
    mock_resp.json = AsyncMock(return_value=json_body)

    mock_cm = MagicMock()
    mock_cm.__aenter__ = AsyncMock(return_value=mock_resp)
    mock_cm.__aexit__ = AsyncMock(return_value=None)

    mock_session = MagicMock()
    mock_session.get.return_value = mock_cm
    return mock_session


@pytest.mark.asyncio
async def test_validate_input_success() -> None:
    hass = MagicMock()
    mock_session = _mock_session(status=200, json_body={"version": "1"})

    with patch(
        "custom_components.nightscout.config_flow.async_get_clientsession",
        return_value=mock_session,
    ):
        result = await validate_input(
            hass,
            {
                CONF_URL: "https://ns.example.com",
                CONF_ALLOW_HTTP: False,
                CONF_API_SECRET: "",
            },
        )

    assert result["title"] == "ns.example.com"
    assert result["url"] == "https://ns.example.com"


@pytest.mark.asyncio
async def test_validate_input_invalid_auth() -> None:
    hass = MagicMock()
    mock_session = _mock_session(status=403, json_body={})

    with patch(
        "custom_components.nightscout.config_flow.async_get_clientsession",
        return_value=mock_session,
    ):
        with pytest.raises(InvalidAuth):
            await validate_input(
                hass,
                {
                    CONF_URL: "https://ns.example.com",
                    CONF_ALLOW_HTTP: False,
                    CONF_API_SECRET: "wrong",
                },
            )


@pytest.mark.asyncio
async def test_validate_input_http_error() -> None:
    hass = MagicMock()
    mock_session = _mock_session(status=500, json_body={})

    with patch(
        "custom_components.nightscout.config_flow.async_get_clientsession",
        return_value=mock_session,
    ):
        with pytest.raises(CannotConnect):
            await validate_input(
                hass,
                {
                    CONF_URL: "https://ns.example.com",
                    CONF_ALLOW_HTTP: False,
                    CONF_API_SECRET: "",
                },
            )
