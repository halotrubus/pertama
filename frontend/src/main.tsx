import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from './lib/queryClient'
import { ensureSeed } from './lib/storage/storage'

// Bootstrap the localStorage "database" before the app renders.
ensureSeed()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        {/* Toasts must clear the mobile bottom navigation (h-16); sonner uses a separate mobileOffset below 600px. */}
        <Toaster richColors offset={{ bottom: '24px' }} mobileOffset={{ bottom: '84px' }} />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
