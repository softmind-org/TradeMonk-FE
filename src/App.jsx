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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
