# Lovelace examples

## Disclaimer

Dashboards are for convenience only. Misconfigured cards or delayed history **must not** replace proper glucose monitoring or medical advice. See **[Disclaimer](disclaimer.md)**.

---

These examples assume your Nightscout device title matches your site hostname and entity IDs follow the default pattern `sensor.<site>_glucose`. Replace entity IDs with **Developer tools** → **States** values from your system.

## Single glucose card with history (built-in History Graph)

Shows glucose over a selectable window using entity history:

```yaml
type: history-graph
title: Glucose (24 hours)
hours_to_show: 24
refresh_interval: 60
entities:
  - entity: sensor.your_host_glucose
```

Use `hours_to_show: 2`, `4`, `12`, or `24` for different windows. Repeat the card or use a horizontal stack for side-by-side windows.

## Four windows (2h / 4h / 12h / 24h)

Requires multiple cards (each card filters its own time range):

```yaml
type: horizontal-stack
cards:
  - type: history-graph
    title: 2h
    hours_to_show: 2
    entities:
      - entity: sensor.your_host_glucose
  - type: history-graph
    title: 4h
    hours_to_show: 4
    entities:
      - entity: sensor.your_host_glucose
  - type: history-graph
    title: 12h
    hours_to_show: 12
    entities:
      - entity: sensor.your_host_glucose
  - type: history-graph
    title: 24h
    hours_to_show: 24
    entities:
      - entity: sensor.your_host_glucose
```

## mini-graph-card (HACS)

If you use [mini-graph-card](https://github.com/kalkih/mini-graph-card), you get compact charts with `hours_to_show`:

```yaml
type: custom:mini-graph-card
name: Glucose
entities:
  - entity: sensor.your_host_glucose
hours_to_show: 4
line_color: "#3498db"
```

Install **mini-graph-card** from HACS → Frontend.

## Entity glance / badges

Show current glucose, delta, IOB, and last reading time:

```yaml
type: glance
entities:
  - entity: sensor.your_host_glucose
  - entity: sensor.your_host_delta
  - entity: sensor.your_host_iob
  - entity: sensor.your_host_last_reading
```

## Tips

- Keep polling interval moderate (e.g. 60s) so History Graph has enough points without hammering Nightscout.
- Prefer HTTPS for remote Nightscout URLs.
