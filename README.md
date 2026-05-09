# Nightscout for Home Assistant

Custom integration that connects [Home Assistant](https://www.home-assistant.io/) to your [Nightscout](https://nightscout.github.io/) site. It exposes glucose, trends, pump-related values when available, and profile information so you can build dashboards and automations (for example lighting or notifications based on glucose ranges).

## Installation (HACS)

1. Open **HACS** in Home Assistant → **Integrations** → **⋮** → **Custom repositories**.
2. Add this repository URL, category **Integration**.
3. Install **Nightscout** and restart Home Assistant.
4. Go to **Settings** → **Devices & services** → **Add integration** → search for **Nightscout**.

## Quick setup

1. **Nightscout URL** — same base URL you use in the browser (with `https://`). For a local server without TLS, enable **Allow insecure HTTP**.
2. **API secret** — only if your Nightscout requires it for API access; otherwise leave blank.
3. After adding the integration, open **Configure** on the Nightscout card to adjust **polling interval** (30–300 seconds; default 60).

Detailed steps and troubleshooting: [docs/setup.md](docs/setup.md).

## Dashboards and graphs

Glucose history in Home Assistant comes from the **Glucose** sensor updating over time. Use the History Graph card or **mini-graph-card** with `hours_to_show` set to 2, 4, 12, or 24 for different windows.

Examples: [docs/lovelace-examples.md](docs/lovelace-examples.md).

## Automations

Examples for lights and numeric thresholds: [docs/automations.md](docs/automations.md).

## Disclaimer

This integration is for convenience and home automation only. It is **not** a medical device and **not** a replacement for your CGM receiver, pump alerts, or clinician advice.

## Development / tests

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements_test.txt
pytest
```

URL and Nightscout payload parsing tests run with **pytest** alone (`pip install pytest pytest-asyncio`). Tests that exercise config-flow helpers need **Home Assistant** installed on **Python 3.11+**; without it, `tests/test_validate_input.py` is skipped automatically.
