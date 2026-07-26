Build and verify the app.

## Steps

1. Run `npm run build` from the project root – it runs `tsc` (type-check) then `vite build`.
2. Report any type errors or build errors, with the `file:line`.
3. If it succeeds, note the output bundle summary.

For a dev server instead, run `npm run dev`. Taking the app native (desktop /
mobile) adds a `src-tauri/` scaffold and builds through the Tauri CLI – wire
that in when you get there.
