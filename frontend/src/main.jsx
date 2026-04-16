import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { APIProvider } from './context/APIContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <APIProvider>
      <App />
    </APIProvider>
  </StrictMode>,
)
