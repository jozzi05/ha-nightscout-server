# Nightscout connection guide

## Important — not medical software

This integration is **not** a health app or medical device. Glucose and pump values are shown for home automation only; they may be inaccurate or unavailable. **The author assumes no responsibility** for decisions made using this software. Read **[Disclaimer](disclaimer.md)** in full before relying on dashboards or automations.

---

## What you need

- A running Nightscout site you can open in a browser (hosted or self-hosted).
- If your Nightscout **requires** an API secret for REST access, have that secret ready (same as configured in Nightscout / uploaders).

## Add the integration

1. In Home Assistant: **Settings** → **Devices & services** → **Add integration**.
2. Choose **Nightscout**.
3. **Nightscout URL**
   - Paste the full base URL, for example `https://your-site.herokuapp.com` or `https://nightscout.home.example`.
   - You may omit the scheme; `https://` is assumed.
4. **Allow insecure HTTP**
   - Leave **off** for normal HTTPS sites.
   - Turn **on** only for HTTP-only installs on a trusted local network (not recommended over the internet).

Continue to the next step:

5. **API secret**
   - If your Nightscout does **not** use API authentication for reads, leave this empty and submit.
   - If reads require a secret, paste the **API secret** (sometimes called `API_SECRET` in Nightscout environment variables).

After submission, Home Assistant validates the connection using `/api/v1/status.json`.

## Options

Open the Nightscout integration entry → **Configure**:

- **Polling interval** — how often to refresh sensors (30–300 seconds). Lower values react faster but increase load on Nightscout and your Home Assistant instance; **60 seconds** is a reasonable default.

## Units

Glucose units follow your Nightscout site settings (**mg/dL** vs **mmol/L**). The integration reads Nightscout’s reported units and displays glucose and delta accordingly.

## Troubleshooting

| Issue | What to try |
|--------|-------------|
| Cannot connect | Confirm the URL in a browser on the same network as Home Assistant. Check DNS, firewall, and that Nightscout is up. |
| Invalid API secret | Verify the secret matches Nightscout’s configured secret for API access; restart Nightscout after changing env vars. |
| HTTP not allowed | Use `https://` or enable **Allow insecure HTTP** for local HTTP-only URLs. |
| Missing IOB/COB/pump fields | These depend on your uploader (e.g. AndroidAPS, Loop). If Nightscout does not receive them, sensors stay **unknown**. |
| Cannula / sensor times missing | Not all uploaders expose these in `devicestatus`; availability varies by loop software and version. |

## Diagnostics

Use **Download diagnostics** on the integration entry to share redacted configuration with maintainers (API secret is redacted).
