# AGENTS.md — ha-nightscout-server
## What this is

A **Home Assistant custom integration** (HACS-distributed) that polls a [Nightscout](https://nightscout.github.io/) site and exposes glucose, trends, pump-related values, and profile data as **sensors** for dashboards and automations.

- **Not medical software.** Treat all values as best-effort automation inputs. See `docs/disclaimer.md`.
- **Hobby / MIT project** — no maintenance guarantee. Users install at their own risk.
- **Upstream repo:** `jozzi05/ha-nightscout-server` (see `manifest.json` for links).

## Layout

```
custom_components/nightscout/   # Integration code (domain: nightscout)
  __init__.py                   # Setup, unload, diagnostics, options reload
  config_flow.py                # UI config flow (URL, API secret, scan interval)
  coordinator.py                  # DataUpdateCoordinator — HTTP to Nightscout REST API
  parsers.py                      # Pure parsing (no HA imports) — unit tests target this
  sensor.py                       # Sensor entities
  url.py                          # URL normalization / validation
  const.py                        # Domain and config keys
  manifest.json                 # Integration metadata + version
  translations/en.json
docs/                           # User-facing setup, Lovelace, automations, disclaimer
tests/                          # pytest (parsers, url; config flow if HA installed)
hacs.json                       # HACS metadata (min HA 2024.1.0)
```

`custom_components/nightscout/frontend/` — Lit Lovelace card (`nightscout-card.js`); see `docs/lovelace-examples.md`.

## Architecture

1. **Config entry** stores `url`, optional `api_secret`, optional `allow_http`; **options** hold `scan_interval` (30–300 s, default 60).
2. **`NightscoutCoordinator`** polls on interval:
   - `GET /api/v1/status.json`
   - `GET /api/v1/entries.json?count=48`
   - `GET /api/v1/devicestatus.json?count=48`
   - `GET /api/v1/profile.json`
   - `GET /api/v1/treatments.json?count=100` (optional; auth failures propagate, other errors are logged and skipped)
3. **`parse_nightscout_payload()`** in `parsers.py` builds a `NightscoutData` dataclass.
4. **`sensor` platform** creates entities only when data is present (glucose, delta, IOB, COB, last reading, profile, reservoir, pump battery, cannula/sensor timestamps).

Auth: `api-secret` header when configured. Errors surface as `UpdateFailed` with keys like `authentication_failed`, `http_*`, `cannot_connect`, `timeout`.

## Development

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements_test.txt
pytest
```

```bash
cd custom_components/nightscout/frontend
npm ci
npm run lint && npm run format:check && npm test
```

- **Python 3.11+** and **Home Assistant ≥ 2024.1.0** for full test suite (`tests/test_validate_input.py` skips without HA).
- **Frontend:** Vitest unit tests (`src/**/*.test.ts`) and browser component tests (`src/**/*.browser.test.ts`) via Vitest browser mode + Playwright.
- `parsers.py` and `url.py` are intentionally **HA-free** — prefer unit tests there for parsing/URL logic.
- Bump **`manifest.json` `version`** when releasing; tags drive GitHub release workflows (`.github/workflows/prepare-release.yml`, `publish-release.yml`).

## CI and branch protection

GitHub Actions workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every **push** and **pull_request**:

| Job | What it runs |
|-----|----------------|
| `python` | `pytest` (requires `homeassistant` from `requirements_test.txt`) |
| `frontend` | `npm run lint`, `npm run format:check`, `npm test` (unit + Playwright browser tests) |

To block merges when CI fails, configure **branch protection** on `main` (and `staging` if used): Settings → Branches → require status checks **`python`** and **`frontend`**.

## Conventions for agents

- Match existing style: type hints, `from __future__ import annotations`, minimal scope changes.
- Do **not** commit unless the user asks.
- Do **not** add markdown docs the user did not request (README/setup/disclaimer already exist).
- Redact secrets in diagnostics (`CONF_API_SECRET` already redacted in `async_get_config_entry_diagnostics`).
- When adding sensors or API calls, update **translations**, **coordinator**, **parsers**, and **tests** together.
- Glucose units follow Nightscout profile (`mmol/L` vs `mg/dL`); raw mg/dL exposed on glucose entity as `raw_mgdl` attribute.

## Related docs (humans)

| File | Purpose |
|------|---------|
| `README.md` | Install via HACS, quick start |
| `docs/setup.md` | Connection troubleshooting |
| `docs/lovelace-examples.md` | Dashboard cards |
| `docs/automations.md` | Automation examples |
| `docs/disclaimer.md` | Legal / liability |
