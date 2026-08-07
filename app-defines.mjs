/**
 * Every Vite `define`, in ONE place, because an app ends up with more than one
 * Vite config. `vite.config.ts` covers dev and build; add tests and there is a
 * `vitest.config.ts` too, and `define` does not carry between them – a
 * constant declared in only one throws `ReferenceError` at MODULE scope in the
 * other, or silently reaches production undefined where no test reads it.
 *
 * Add constants HERE, and both configs get them.
 */
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

export const appDefines = {
  // Read from package.json rather than typed into a component, which is how an
  // About screen comes to claim 1.0.0 forever.
  __APP_VERSION__: JSON.stringify(pkg.version),
}
