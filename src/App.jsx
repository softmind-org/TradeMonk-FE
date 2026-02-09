/**
 * Main App Component
 * Entry point for the React application
 */
import { RouterProvider } from 'react-router-dom'
import { AuthProvider, CartProvider } from '@context'
import router from './router'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
