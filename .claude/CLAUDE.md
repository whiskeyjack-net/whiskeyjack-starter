# Whiskeyjack Starter

A thumb-first React app built on the Whiskeyjack design system, wired for one
web codebase delivered to desktop and mobile via Tauri.

## Stack

- React 18 + TypeScript, Vite
- `@whiskeyjack-net/design-system` – tokens, Tailwind preset, and components
- `@whiskeyjack-net/i18n` – the shared react-i18next bootstrap
- `@whiskeyjack-net/tauri` – the desktop/mobile app-shell layer (inert on web)
- Tailwind CSS (via the design-system preset), Phosphor icons

## Commands

```bash
npm run dev      # dev server
npm run build    # tsc + vite build
```

## Structure

```
src/
  main.tsx          # entry: BrowserRouter + i18n
  App.tsx           # routes
  index.css         # DS token + utility CSS, Tauri chrome CSS, Tailwind
  i18n/             # createI18n(locales) + locale JSON
  components/
    Layout.tsx      # the app shell (AppShell + header + nav + theme + Tauri chrome)
  pages/            # Home, Settings
```

## Conventions

The rules in `.claude/rules/` load automatically. In short:

- **Design-system first** – reach for a DS component/hook before writing your
  own; import from `@whiskeyjack-net/design-system`.
- **Tokens via CSS variables** – `var(--color-...)`, never hardcoded colors.
- **Phosphor icons only** – the DS is icon-library-free; pass icon nodes in.
- **All user-facing text is an i18n key** – add to every locale in `src/i18n/locales/`.
- **The shell is DS components** – `AppShell` / `AppHeader` / `HeaderNav` /
  `AppMain` / `MobileBottomNav`; theme via `useTheme`.
- **En dashes, never em dashes**; no "it's not X, it's Y" copy (see the
  copywriting rule).
- **Accessibility (WCAG 2.1 AA)** is inherited from the DS primitives; see the
  accessibility rule when adding new UI.

## Theming

The default accent applies out of the box. To re-tint per app, add a theme CSS
override after the token import (see the design system's README "Theming &
accent" – `applyAccentColor(hex)` at runtime, or a static `:root` block), or
override the `--color-accent-*` variables.
