/**
 * Every Vite `define`, in ONE place, because an app ends up with more than one
 * Vite config.
 *
 * `vite.config.ts` covers dev and build. The moment you add tests you have a
 * `vitest.config.ts` too, and **`define` does not carry between them**. A
 * constant declared in only one throws `ReferenceError` in the other at MODULE
 * scope, which takes down whole test files rather than the one assertion that
 * reads it -- and it fails the other way round just as badly: loud where a test
 * covers the component, silent where none does, so the constant reaches
 * production undefined.
 *
 * This file exists so that is a thing you cannot do rather than a thing you are
 * warned about. It was a paragraph in the README first; the developer who wrote
 * the paragraph then walked into the failure anyway, two lines below a comment
 * repeating it. Documentation loses to a second edit site.
 *
 * So: add constants HERE, and both configs get them.
 */
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

export const appDefines = {
  // Read from package.json rather than typed into a component, which is how an
  // About screen comes to claim 1.0.0 forever.
  __APP_VERSION__: JSON.stringify(pkg.version),
}
