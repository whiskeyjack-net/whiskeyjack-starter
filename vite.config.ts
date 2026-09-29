import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
// Shared with any other Vite config this project grows -- `define` does not
// carry between them. See app-defines.mjs.
import { appDefines } from './app-defines.mjs'

// Set by the Tauri CLI for `tauri dev` and `tauri build`; unset for web dev
// and the web build.
const isTauri = !!process.env.TAURI_ENV_PLATFORM
// Set by `tauri ios/android dev` to this machine's LAN IP so a physical device
// can reach the dev server. Unset for desktop and web dev (binds to localhost).
const host = process.env.TAURI_DEV_HOST

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  define: appDefines,
  server: {
    host: host || false,
    port: 5173,
    // Tauri's `build.devUrl` names this port. With a fallback port the desktop
    // window would open on a URL nothing serves.
    strictPort: true,
    hmr: host ? { protocol: 'ws', host, port: 5174 } : undefined,
  },
  // The Tauri CLI shares the terminal with Vite's output.
  clearScreen: !isTauri,
})
