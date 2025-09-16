// import { StrictMode } from 'react'
import {SnackbarProvider} from 'notistack';
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'
import { AuthProvider } from './context/AuthContext/AuthContext'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AuthProvider>
      <SnackbarProvider  maxSnack={3}
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}>
              <RouterProvider router={router} />
      </SnackbarProvider>
    </AuthProvider>
  // {/* </StrictMode>, */}
)
