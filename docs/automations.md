# Automation examples

**Important:** These automations are for home convenience only. They do not replace medical alerts, pump alarms, or clinical judgment. Test safely and avoid relying solely on Home Assistant for urgent hypoglycemia or hyperglycemia detection.

Replace `sensor.your_host_glucose` with your actual glucose entity from **Developer tools** → **States**.

## Notify when glucose crosses a threshold

Numeric state triggers work when the glucose sensor reports a number (mg/dL or mmol/L depending on your site).

Example (mg/dL — adjust thresholds for mmol/L, e.g. low below 4.0):

```yaml
alias: Glucose high notification
description: Notify when glucose is above target (example threshold)
trigger:
  - platform: numeric_state
    entity_id: sensor.your_host_glucose
    above: 180
condition: []
action:
  - action: notify.mobile_app_your_phone
    data:
      title: Glucose high
      message: Current glucose is {{ states('sensor.your_host_glucose') }}
mode: single
```

Low example:

```yaml
alias: Glucose low notification
trigger:
  - platform: numeric_state
    entity_id: sensor.your_host_glucose
    below: 70
action:
  - action: notify.mobile_app_your_phone
    data:
      title: Glucose low
      message: Current glucose is {{ states('sensor.your_host_glucose') }}
mode: single
```

## Change light color by range (assistive only)

Uses three scenes or `light.turn_on` with different `rgb_color` values. Adjust entity IDs and thresholds.

```yaml
alias: Living room light glucose indication
trigger:
  - platform: state
    entity_id: sensor.your_host_glucose
action:
  - choose:
      - conditions:
          - condition: numeric_state
            entity_id: sensor.your_host_glucose
            below: 70
        sequence:
          - action: light.turn_on
            target:
              entity_id: light.living_room
            data:
              rgb_color: [0, 0, 255]
              brightness_pct: 30
      - conditions:
          - condition: numeric_state
            entity_id: sensor.your_host_glucose
            above: 180
        sequence:
          - action: light.turn_on
            target:
              entity_id: light.living_room
            data:
              rgb_color: [255, 165, 0]
              brightness_pct: 40
    default:
      - action: light.turn_on
        target:
          entity_id: light.living_room
        data:
          rgb_color: [0, 255, 0]
          brightness_pct: 25
mode: restart
```

Consider adding `condition` blocks for night hours or presence so lights do not disturb sleep unnecessarily.

## Using templates with mmol/L

If your sensor unit is mmol/L, use thresholds in mmol/L (for example low **4.0**, high **10.0**) in `numeric_state`.

You can confirm the unit on the sensor in **Developer tools** → **States** (`unit_of_measurement`).

## Reliability notes

- Network or Nightscout outages can delay updates; automations may fire late or not at all.
- Use conservative thresholds if triggering audible alarms outside the household’s usual glucose alarms.
