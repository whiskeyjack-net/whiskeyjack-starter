# Whiskeyjack Starter

The starter template for the Whiskeyjack design system — a thumb-first React app
wired the way the reference apps are built, from the first commit. One web
codebase, delivered to desktop and mobile via Tauri.

## What's wired

- **App shell** — the DS `AppShell` / `AppHeader` / `HeaderNav` / `AppMain` /
  `MobileBottomNav`: a frosted header, bottom nav, and a scroll region that
  clears it, all reachable with a thumb.
- **Theming** — light / dark / system via `useTheme` (persisted), with the
  accent auto-contrast foreground.
- **i18n** — `@whiskeyjack-net/i18n`'s `createI18n` (react-i18next) with
  `<html lang/dir>` RTL sync; English + Spanish to start.
- **Tauri-ready** — `@whiskeyjack-net/tauri` window controls mount in the
  header and are inert on the web.
- **AI-native** — a pre-wired `.claude/` layer (CLAUDE.md + path-scoped rules)
  so AI tooling generates code that stays on the design language.

## Run

```bash
npm install
npm run dev      # or: npm run build
```

The design system, i18n, and Tauri packages are pinned as local tarballs here
for a self-contained start; swap them for the published `@whiskeyjack-net/*`
packages once you're set up.

## Make it yours

1. Rename the app (`package.json`, `index.html`, the `app.name` locale key).
2. Replace `src/pages/Home.tsx` with your first screen; add routes in `App.tsx`
   and nav items in `src/components/Layout.tsx`.
3. Add locales under `src/i18n/locales/` and list them in `src/i18n/index.ts`.
4. Re-tint the accent — see the design system's README "Theming & accent".

## Conventions

The `.claude/` layer documents the stack's conventions (design-system-first,
tokens via CSS variables, Phosphor icons, i18n keys, the app shell, RTL,
accessibility, copywriting). AI tooling loads them automatically.
