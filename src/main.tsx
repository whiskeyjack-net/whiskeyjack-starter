import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Self-hosted Inter Variable, the family the design-system `--font-family-sans`
// names. Without it the tokens fall back to system-ui.
import '@fontsource-variable/inter'
import App from './App'
import './index.css'
import './i18n'

// Marks the document for the Tauri-only CSS in index.css. Set here because it
// has to cover mobile webviews too; the pack's `.tauri-desktop` is desktop-only.
if ('__TAURI_INTERNALS__' in window) document.documentElement.classList.add('tauri')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
