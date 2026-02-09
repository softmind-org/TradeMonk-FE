/**
 * Router Configuration
 * Defines all application routes
 */
import { createBrowserRouter } from 'react-router-dom'
import { 
  HomePage, 
  AboutPage, 
  NotFoundPage,
  Login,
  Register,
  ForgotPassword,
  ProductDetail,
  Marketplace,
  Cart,
  Checkout,
  OrderComplete,
  OrderHistory
} from '@pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/marketplace',
    element: <Marketplace />,
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
  {
    path: '/order-complete',
    element: <OrderComplete />,
  },
  {
    path: '/orders',
    element: <OrderHistory />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
