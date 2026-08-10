import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

const rootEl = document.getElementById('root')!
if (rootEl.hasChildNodes()) {
  // Page is fully prerendered — hydrate during idle time so the main thread
  // stays free for first paint, fonts and images (real anchor links work
  // immediately; interactivity attaches moments later).
  const hydrate = () => hydrateRoot(rootEl, app)
  if ('requestIdleCallback' in window) {
    requestIdleCallback(hydrate, { timeout: 3000 })
  } else {
    setTimeout(hydrate, 200)
  }
} else {
  createRoot(rootEl).render(app)
}
