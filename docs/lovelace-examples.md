# Lovelace examples

## Disclaimer

Dashboards are for convenience only. Misconfigured cards or delayed history **must not** replace proper glucose monitoring or medical advice. See **[Disclaimer](disclaimer.md)**.

---

These examples assume your Nightscout device title matches your site hostname and entity IDs follow the default pattern `sensor.<site>_glucose`. Replace entity IDs with **Developer tools** → **States** values from your system.

## Nightscout card (built-in custom card)

The integration ships a custom card that displays glucose, trend arrow, delta, IOB, and COB in a single compact row. It includes a visual editor -- add the card via the UI and select your Nightscout device; all entities are auto-filled.

### Adding via UI

1. Open a dashboard and click **Edit** → **Add Card**.
2. Search for **Nightscout** in the card picker.
3. Select your Nightscout device -- entities are auto-filled.
4. Toggle which fields to show and adjust font size.

### Adding via YAML

```yaml
type: custom:nightscout-card
glucose_entity: sensor.your_host_glucose
delta_entity: sensor.your_host_delta
iob_entity: sensor.your_host_iob
cob_entity: sensor.your_host_cob
last_reading_entity: sensor.your_host_last_reading
show_glucose: true
show_time_ago: true
show_delta: true
show_iob: true
show_cob: true
font_size: 48
```

### Glucose range colors and blink

When the glucose value changes, the card border flashes for 2 seconds with a color based on configurable ranges (mg/dL):

| Range | Default | Color |
|-------|---------|-------|
| Urgent low / high | < 70 or > 200 | Red (`#e74c3c`) |
| Low / high | < 85 or > 170 | Yellow (`#f39c12`) |
| In range | 85 -- 170 | Green (`#2ecc71`) |

Override ranges and colors in the visual editor or YAML:

```yaml
urgent_low: 70
urgent_high: 200
low: 85
high: 170
color_urgent: "#e74c3c"
color_warning: "#f39c12"
color_ok: "#2ecc71"
```

The card automatically follows your HA dark/light theme. Optionally set `background_color` to override.

---

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
