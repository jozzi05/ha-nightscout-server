"""Constants for the Nightscout integration."""

from typing import Final

DOMAIN: Final = "nightscout"

CONF_URL: Final = "url"
CONF_API_SECRET: Final = "api_secret"
CONF_ALLOW_HTTP: Final = "allow_http"
CONF_SCAN_INTERVAL: Final = "scan_interval"

DEFAULT_SCAN_INTERVAL: Final = 60
MIN_SCAN_INTERVAL: Final = 30
MAX_SCAN_INTERVAL: Final = 300

ATTR_RAW_MGDL: Final = "raw_mgdl"
ATTR_DIRECTION: Final = "direction"
