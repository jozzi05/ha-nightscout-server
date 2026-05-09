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


@pytest.mark.asyncio
async def test_validate_input_success() -> None:
    hass = MagicMock()

    mock_resp = AsyncMock()
    mock_resp.status = 200
    mock_resp.json = AsyncMock(return_value={"version": "1"})

    mock_cm = AsyncMock()
    mock_cm.__aenter__.return_value = mock_resp
    mock_cm.__aexit__.return_value = None

    mock_session = AsyncMock()
    mock_session.get.return_value = mock_cm

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

    mock_resp = AsyncMock()
    mock_resp.status = 403
    mock_resp.json = AsyncMock(return_value={})

    mock_cm = AsyncMock()
    mock_cm.__aenter__.return_value = mock_resp
    mock_cm.__aexit__.return_value = None

    mock_session = AsyncMock()
    mock_session.get.return_value = mock_cm

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

    mock_resp = AsyncMock()
    mock_resp.status = 500
    mock_resp.json = AsyncMock(return_value={})

    mock_cm = AsyncMock()
    mock_cm.__aenter__.return_value = mock_resp
    mock_cm.__aexit__.return_value = None

    mock_session = AsyncMock()
    mock_session.get.return_value = mock_cm

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
