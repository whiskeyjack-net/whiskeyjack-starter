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

## If your app is web-only

The template wires `@whiskeyjack-net/tauri` into the shell so a desktop or
mobile build works from the first commit. The package is inert outside Tauri, so
a web-only app still runs correctly – but it costs roughly 15 kB in the bundle
and a dependency to keep current. To drop it:

1. `npm uninstall @whiskeyjack-net/tauri @tauri-apps/api`
2. In `src/components/Layout.tsx` – the only file that imports it – drop the
   `@whiskeyjack-net/tauri` import (`WindowControlsLeft`, `WindowControlsRight`,
   `useSystemAccent`, `useWindowDrag`, `isLinuxDesktop`), delete the `chrome`
   prop on `AppHeader` and the `{...drag}` spread beside it, and remove
   `tauri-pad-controls` from its `rowClassName`. Replace the `useSystemAccent()`
   call and the `isLinuxDesktop()` argument to `useTheme({ paintRoot })` with
   the plain `useTheme({ storageKey })` form.
3. In `src/index.css`, remove the
   `@import '@whiskeyjack-net/tauri/css/window-controls';` line.

Nothing else references it. Run `npm run lint && npm run build` to confirm.

## If your app grows a package beside it

The scaffold is a single package. To add one (a shared core, a CLI), convert to
npm workspaces:

1. Add `"workspaces": ["packages/*"]` to the root `package.json`.
2. Change `test` and `typecheck` to `npm run <script> --workspaces --if-present`.
3. **Watch the tsconfig.** A workspace package that exports raw TypeScript
   (`main: ./src/index.ts`) is compiled under the *consumer's* tsconfig, not its
   own – so its untyped dependencies and host-specific files become your errors.
   Either give the package a build that emits `.d.ts`, or scope the app's
   `include`/`exclude` to just the files it imports.
4. **`npm test` has to name the app's own suite.** `--workspaces` runs the
   packages and skips the root, so an app whose test config lives at the root
   goes green without executing a single one of its tests. Run `vitest run`
   explicitly first.

## If you add a Vite `define`

Put it in **`app-defines.mjs`**, which every Vite config here imports. Declare
the type alongside `__APP_VERSION__` in `src/vite-env.d.ts` and you are done.

The reason it is a module rather than a line in `vite.config.ts`: the moment you
add tests you have a `vitest.config.ts` as well, and `define` does not carry
between the two. A constant declared in only one throws `ReferenceError` in the
other at module scope, taking down whole test files rather than the one
assertion that reads it – and it fails in the other direction just as badly,
loud where a test covers the component and silent where none does, so the
constant reaches production undefined.
