/**
 * Main App Component
 * Entry point for the React application
 */
import { RouterProvider } from 'react-router-dom'
import { AuthProvider, ThemeProvider } from '@context'
import router from './router'
import './index.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
