---
paths:
  - "src/**"
  - "index.html"
---

# Whiskeyjack App Rules

Conventions for a React app built on the Whiskeyjack design system. Generalized
from the design system's internal rules; these point at the published packages,
not any monorepo path.

## Components & tokens

- **Design-system first**: reach for a DS component or hook before writing an
  app-local one. Import from `@whiskeyjack-net/design-system`. App-local UI is
  justified only when genuinely app-specific.
- **Tokens via CSS variables**: `var(--color-warm-500)`, never hardcoded color
  values. The Tailwind preset (`@whiskeyjack-net/design-system/tailwind-preset`)
  exposes the token color scales, fonts, radius/shadow, and the `wide`/`xlwide`
  layout-gate variants.
- **Icons: Phosphor only** (`@phosphor-icons/react`). The DS bundles no icon
  library – pass icon nodes into components (e.g. `renderIcon`, `icon` props).
- **Icon-only controls** need both `aria-label` and `title`.

## The app shell

Use the DS shell components rather than hand-rolling the frame:

- `AppShell` – root column (`scroll="shell"` fixed height, or `"document"`).
- `AppHeader` – frosted desktop header (`floating`/`sticky`; `chrome` +
  `rowClassName` slots carry Tauri window controls).
- `HeaderNav` – the nav pills (`items` + `linkComponent`).
- `AppMain` – the scroll region (forwards its ref for `useRouteFocus`).
- `MobileBottomNav` – the mobile bottom bar.

Theme with `useTheme` (uncontrolled `storageKey`, or controlled `mode` from a
store). Never hand-roll `matchMedia`/`dark`-class toggling.

## i18n

- All user-facing strings are translation keys via `useTranslation()` – never
  hardcode display text, including `aria-label`/`alt`/`title`.
- Configure once through `createI18n(locales)` from `@whiskeyjack-net/i18n`
  (`src/i18n/index.ts`); it handles language detection, the `en` fallback, and
  `<html lang>`/`dir` (RTL) updates.
- When you add a key, add it to **every** locale file.

## Tauri (desktop/mobile)

- The `@whiskeyjack-net/tauri` shell (window controls, `useSystemAccent`,
  guards) is inert off Tauri, so it's safe in a plain web build.
- Desktop-only behavior must gate on `isDesktopTauri()`, not merely `isTauri()`
  (mobile Tauri also sets `__TAURI_INTERNALS__`).
- Drag the window through `useWindowDrag()` spread on the `AppHeader`. It waits
  for 4 CSS px of pointer travel before `startDragging()`, so a click into the
  window leaves it in place. A `data-tauri-drag-region` attribute drags on the
  press itself, and with `acceptFirstMouse` on that moves the window on every
  activating click.
- An Icon Composer `AppIcon.icon` bundle reaches the app once per OS, by hand:
  compiled to `Assets.car` and injected via `bundle.macOS.files` on macOS, added
  to the iOS target's sources in `gen/apple/project.yml` on iOS, with the legacy
  `AppIcon.appiconset` removed. `tauri icon` ships a flat icon otherwise, and a
  flat icon is valid, so nothing warns. The `@whiskeyjack-net/tauri` README has
  the steps.
- Tray icons ship per OS: one template PNG on macOS (alpha only, the system
  tints it), the same PNG on Linux (appindicator scales it), and on Windows a
  PNG per DPI size in white for a dark taskbar and black for a light one,
  re-picked on `ThemeChanged` and `ScaleFactorChanged`. The
  `@whiskeyjack-net/tauri` README's "Tray icons" has the sizes.

- Tauri-only CSS gates on `html.tauri`, set in `main.tsx` for desktop and
  mobile webviews alike; the pack's `.tauri-desktop` is desktop-only. Text
  selection is off inside Tauri and on for the web.
- `vite.config.ts` reads `TAURI_ENV_PLATFORM` (the Tauri gate) and
  `TAURI_DEV_HOST` (on-device dev). `strictPort` is deliberate: keep
  `build.devUrl` in `tauri.conf.json` on port 5173, so a taken port fails
  loudly instead of leaving `devUrl` pointing at nothing.
- `window.*`, `update.*` and `common.cancel` are read by `@whiskeyjack-net/tauri`
  for the window controls and the updater; keep them in every locale.
- With `--pwa`, the service worker and manifest are skipped under Tauri, so the
  packaged app never precaches its own bundle.
- **A `tauri.<platform>.conf.json` replaces the whole `app.windows` array, so
  each one spells the window out in full.** Tauri merges the platform file with
  json-patch, where an array overwrites its target rather than merging into it:
  a file carrying only `decorations` leaves that platform on Tauri's defaults
  for size, minimum size and every other window key, and a window still opens,
  so nothing reports it. `npm run check:tauri-windows` in the source monorepo
  guards the same pair of files.
- **`tauri-plugin-window-state` persists the decoration flag by default, which
  outranks the config.** `StateFlags::all()` includes `DECORATIONS`, so
  `decorated` is read back from `.window-state.json` on every launch after the
  first, and a state file written while the app drew its own chrome keeps the
  window undecorated no matter what `tauri.linux.conf.json` says afterwards.
  The template registers the plugin with that one flag cleared; keep it cleared
  unless decoration is genuinely something the user toggles.

### Cold-launch theme flash

A theme-correct app can still show the wrong color for a large part of its cold
launch. The launch is a **chain of surfaces**, each painting until the next is
ready, and each with a different owner:

| # | Surface | Owner | Color source |
|---|---------|-------|---------------|
| 1 | System splash / `LaunchScreen` | OS, before the process exists | theme resource |
| 2 | Native window background | app `onCreate` / Rust setup | persisted mirror |
| 3 | **Webview's OWN background** | webview, until the page first paints | webview default – **white** |
| 4 | Page background | CSS `body` rule | design tokens |

Link 3 is the one that bites, and it lasts until the render-blocking stylesheet
loads (measured at ~1.5 s on an Android cold start). This template ships the
web-side fix already wired, and it is worth understanding before you touch it:

- **`index.html`'s pre-paint script** sets `documentElement.style.backgroundColor`
  before any stylesheet. Adding the `dark` class alone does nothing – a class is
  inert without CSS, which is precisely the gap.
- **`useTheme`'s `launchMirrorKey`** writes the RESOLVED appearance for that
  script to read next launch. The plain `storageKey` holds the *preference*,
  which can be `'system'`; the script needs the answer, not the question.
- **`useTheme`'s `paintRoot`** is on by default and wants to stay that way. The
  root's background propagates to the **canvas**, which is what makes the paint
  reach the launch frame, and equally what makes it override a transparent
  `body`. Only an app that gives its window genuine alpha (Tauri with
  `decorations: false` + `transparent: true`, rounding its corners in CSS) needs
  `paintRoot: false`, which *clears* the property rather than skipping it, so it
  also undoes the pre-paint script that ran before the app could tell which
  platform it was on.
- **The hexes in `index.html` are a hand-kept mirror of the background tokens** –
  that script runs before any stylesheet, so it is the one place that cannot
  read them. Sweep it whenever a background token moves. An installed PWA's
  manifest `background_color` is a second such mirror, with no dark variant in
  the spec, so it is only ever right for one theme.
- **Measure before theorising here.** Record the screen and sample one averaged
  pixel per frame (`ffmpeg -vf "fps=60,crop=…,scale=1:1" -f rawvideo`) rather
  than reasoning about which surface is showing. That method costs minutes and
  repeatedly contradicts plausible hypotheses.

## RTL

Directional layout uses Tailwind **logical** utilities (`ps`/`pe`, `ms`/`me`,
`start`/`end`), never physical `pl`/`pr`/`left`/`right`. The DS handles the
JS-driven mirroring (swipe direction, fade edges) via its `isRTL` helper.
