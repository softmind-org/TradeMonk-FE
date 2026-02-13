/**
 * Main App Component
 * Entry point for the React application
 */
import { RouterProvider } from 'react-router-dom'
import { AuthProvider, CartProvider } from '@context'
import { ModalProvider } from './context/modal'
import Modal from './components/Modals/index'
import router from './router'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ModalProvider>
          <RouterProvider router={router} />
          <Modal />
        </ModalProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
