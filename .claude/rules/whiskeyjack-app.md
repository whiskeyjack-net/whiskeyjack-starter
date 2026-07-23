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

## RTL

Directional layout uses Tailwind **logical** utilities (`ps`/`pe`, `ms`/`me`,
`start`/`end`), never physical `pl`/`pr`/`left`/`right`. The DS handles the
JS-driven mirroring (swipe direction, fade edges) via its `isRTL` helper.
