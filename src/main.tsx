import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppShell } from './app/AppShell'
import { Providers } from './app/providers'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <AppShell />
    </Providers>
  </React.StrictMode>,
)
