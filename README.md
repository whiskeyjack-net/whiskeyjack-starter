# Whiskeyjack Starter

The starter template for the Whiskeyjack design system – a thumb-first React app
wired the way the reference apps are built, from the first commit. One web
codebase, delivered to desktop and mobile via Tauri.

> **Starting a new app?** The recommended path is the CLI – it renames the
> project for you and always pulls the latest template:
>
> ```bash
> npm create whiskeyjack@latest my-app
> ```
>
> This repo is that same starter as a browsable reference: read the wiring here,
> click **Use this template** to spin up your own repo, or fork it.

## What's wired

- **App shell** – the DS `AppShell` / `AppHeader` / `HeaderNav` / `AppMain` /
  `MobileBottomNav`: a frosted header, bottom nav, and a scroll region that
  clears it, all reachable with a thumb.
- **Theming** – light / dark / system via `useTheme` (persisted), with the
  accent auto-contrast foreground.
- **i18n** – `@whiskeyjack-net/i18n`'s `createI18n` (react-i18next) with
  `<html lang/dir>` RTL sync; English + Spanish to start.
- **Tauri-ready** – `@whiskeyjack-net/tauri` window controls mount in the
  header and are inert on the web.
- **One place for build constants** – `app-defines.mjs` holds every Vite
  `define`, because `define` does not carry between `vite.config.ts` and the
  `vitest.config.ts` you get the moment you add tests. `__APP_VERSION__` ships
  in it and Settings displays it.
- **AI-native** – `AGENTS.md` is the canonical, tool-neutral set of conventions,
  so any coding agent that reads it works from the same instructions. A
  `.claude/` layer adds Claude Code specifics on top (path-scoped rules,
  `web-dev` / `reviewer` / `accessibility` agents, `/add-i18n-key` / `/build` /
  `/review` skills).

## Run

```bash
npm install
npm run dev      # or: npm run build
```

`npm install` pulls the `@whiskeyjack-net/*` design-system, i18n, and Tauri
packages from npm.

## Make it yours

1. Rename the app (`package.json`, `index.html`, the `app.name` locale key).
2. Replace `src/pages/Home.tsx` with your first screen; add routes in `App.tsx`
   and nav items in `src/components/Layout.tsx`.
3. Add locales under `src/i18n/locales/` and list them in `src/i18n/index.ts`.
4. Re-tint the accent – see the design system's README "Theming & accent".

## Conventions

**`AGENTS.md` in the root is the canonical set** – design-system-first, tokens
via CSS variables, Phosphor icons, i18n keys, the app shell, RTL, accessibility,
copywriting. It is deliberately tool-neutral, so every coding agent that reads
`AGENTS.md` gets the same rules, and so does anyone reading it by hand.

The `.claude/` layer sits on top with what is specific to Claude Code: the same
conventions as path-scoped rules that load by directory, plus `web-dev` /
`reviewer` / `accessibility` agents and `/add-i18n-key`, `/build`, and `/review`
skills.
