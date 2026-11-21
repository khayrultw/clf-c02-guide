import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './lib/AuthContext'
import { PracticeNavigationProvider } from './lib/PracticeNavigationContext'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PracticeNavigationProvider>
          <App />
        </PracticeNavigationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
