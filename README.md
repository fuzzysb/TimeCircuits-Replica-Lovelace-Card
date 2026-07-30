# Time Circuits Card

A Back to the Future Time Circuits replica card for [Home Assistant](https://www.home-assistant.io/).

Designed to pair with an ESP32-based Time Circuits replica that publishes its state
to Home Assistant over MQTT (auto-discovery). Renders the iconic three-row display:

- **DESTINATION TIME** (top, red LEDs)
- **PRESENT TIME** (middle, red LEDs)
- **LAST TIME DEPARTED** (bottom, red LEDs)

Each row shows `MMDD`, `YYYY`, and `HHMM` LED segments with AM/PM indicators and a
SYNC RTC button.

## Requirements

- Home Assistant with MQTT integration configured.
- An ESP32 Time Circuits device that publishes MQTT auto-discovery messages
  (text entities for the top/bottom rows, a select for date format, and a button
  for RTC sync). The matching firmware lives in the companion project.

## Install via HACS

1. Add this repo as a custom repository in HACS (type: **Lovelace**).
2. Install **Time Circuits Card**.
3. Add the resource if not added automatically:
   ```yaml
   resources:
     - type: module
       url: /hacsfiles/time-circuits-card/dist/time-circuits-card.js
   ```

## Manual install

Copy `dist/time-circuits-card.js` to your `config/www/` folder and add it as a
Lovelace resource:

```yaml
resources:
  - type: module
    url: /local/time-circuits-card.js
```

## Configuration

Use the visual editor, or define in YAML:

```yaml
type: custom:time-circuits-card
title: Time Circuits
destination_entity: text.timecircuits_top_time
departed_entity: text.timecircuits_bot_time
present_entity: text.timecircuits_present_time   # optional; falls back to HA server time
date_format_entity: select.timecircuits_dateformat
sync_entity: button.timecircuits_sync_btn
font_family: "'DSEG7 Classic', 'Courier New', monospace"
theme:
  background: "#1a1a1a"
  digit_color: "#ff5500"
  accent: "#ffb011"
```

### Options

| Key                  | Type   | Description                                                   |
| -------------------- | ------ | ------------------------------------------------------------- |
| `destination_entity` | string | `text.*` entity holding a 12-digit `MMDDYYYYHHMM` string (top row). |
| `departed_entity`    | string | `text.*` entity holding a 12-digit `MMDDYYYYHHMM` string (bottom row). |
| `present_entity`     | string | Optional `text.*` for the middle row. If omitted, the card shows HA server time, updated every second. |
| `date_format_entity` | string | Optional `select.*` returning `MD` or `DM`. Controls MMDD vs DDMM display order. |
| `sync_entity`        | string | Optional `button.*` entity; pressing the card's SYNC RTC button calls `button.press`. |
| `title`              | string | Optional card title.                                          |
| `font_family`        | string | CSS `font-family` for the LED digits.                          |
| `theme`              | object | Optional color overrides (see below).                        |

### Theme keys

| Key              | Default     |
| ---------------- | ----------- |
| `background`     | `#1a1a1a`   |
| `bezel`          | `#3a3a3a`   |
| `label_color`    | `#c8c8c8`   |
| `digit_color`    | `#ff5500`   |
| `digit_dim`      | `#2a1408`   |
| `ampm_active`    | `#ff5500`   |
| `ampm_inactive`  | `#3a1a0a`   |
| `accent`         | `#ffb011`   |

## Interaction

- Click any segment group on the top or bottom row to set that row's time. You
  will be prompted for a 12-digit `MMDDYYYYHHMM` value, which is sent via
  `text.set_value`. (The stored order is always `MMDD`; the card applies the
  selected display order for rendering only.)
- The **SYNC RTC** button calls `button.press` on the configured sync entity.

## Development

```bash
npm install
npm run build       # outputs dist/time-circuits-card.js
npm run dev         # rebuild on save
npm run typecheck
```