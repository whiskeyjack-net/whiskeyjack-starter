#!/usr/bin/env node
/**
 * One version across every file that carries it: package.json, plus
 * src-tauri/tauri.conf.json and src-tauri/Cargo.toml once the app has a Tauri
 * shell. The in-app updater compares the runtime version (tauri.conf.json)
 * with the release tags, so a package.json bumped alone offers an update that
 * is already installed.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

const FILES = [
  { path: 'package.json', get: (s) => JSON.parse(s).version },
  // `version` is optional here; Tauri reads Cargo.toml when it is absent.
  { path: 'src-tauri/tauri.conf.json', get: (s) => JSON.parse(s).version },
  // The FIRST `version =` is the package's; dependencies carry their own.
  { path: 'src-tauri/Cargo.toml', get: (s) => s.match(/^\s*version\s*=\s*"([^"]+)"/m)?.[1] },
]

const found = FILES.filter((f) => existsSync(join(root, f.path)))
  .map((f) => [f.path, f.get(readFileSync(join(root, f.path), 'utf8'))])
  .filter(([, v]) => v)
const versions = [...new Set(found.map(([, v]) => v))]

if (versions.length !== 1) {
  console.error(`SPLIT across ${versions.length} versions:`)
  for (const [path, v] of found) console.error(`  ${v.padEnd(10)} ${path}`)
  console.error('Move every file to the same version before tagging a release.')
  process.exit(1)
}
console.log(`ok  every file says ${versions[0]}  (${found.map(([p]) => p).join(', ')})`)
