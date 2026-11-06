import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AppView } from '@/views/AppView/AppView'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppView />
  </StrictMode>,
)
