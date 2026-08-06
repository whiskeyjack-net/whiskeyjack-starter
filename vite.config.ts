import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
// Shared with any other Vite config this project grows -- `define` does not
// carry between them. See app-defines.mjs.
import { appDefines } from './app-defines.mjs'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  define: appDefines,
})
