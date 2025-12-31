import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Error boundary for debugging
const root = document.getElementById('root')

if (root) {
  try {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } catch (error) {
    console.error('React render error:', error)
    root.innerHTML = `<div style="color: white; padding: 20px; background: #0a0a0a; min-height: 100vh;">
      <h1>Error loading app</h1>
      <pre>${error.message}</pre>
    </div>`
  }
} else {
  console.error('Root element not found')
}
