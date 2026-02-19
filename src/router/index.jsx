/**
 * Router Configuration
 * Defines all application routes
 */
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout, AuthLayout, SellerLayout } from '@layouts'
import { 
  HomePage, 
  NotFoundPage,
  Login,
  Register,
  ForgotPassword,
  ProductDetail,
  Marketplace,
  Cart,
  Checkout,
  OrderComplete,
  OrderHistory,
  AddListing,
  MyListings,
  ListingDetail,
  SalesOrders,
  Payouts,
  StoreSettings
} from '@pages'
import ProtectedRoute from '@components/common/ProtectedRoute'
import SellerOverview from '@pages/Seller/Dashboard/Overview'

export const router = createBrowserRouter([
  // ─── Public Routes (inside MainLayout with Header/Footer) ───
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/marketplace',
        element: <Marketplace />,
      },
      {
        path: '/product/:id',
        element: <ProductDetail />,
      },
      // Protected buyer-only routes (inside MainLayout)
      {
        path: '/cart',
        element: (
          <ProtectedRoute allowedRoles={['buyer']}>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute allowedRoles={['buyer']}>
            <OrderHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute allowedRoles={['buyer']}>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: '/order-complete',
        element: (
          <ProtectedRoute allowedRoles={['buyer']}>
            <OrderComplete />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // ─── Protected Seller Routes ───
  {
    path: '/seller',
    element: (
      <ProtectedRoute allowedRoles={['seller']}>
        <SellerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/seller/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <SellerOverview />,
      },
      {
        path: 'listings',
        element: <MyListings />,
      },
      {
        path: 'listings/add',
        element: <AddListing />,
      },
      {
        path: 'listings/edit',
        element: <AddListing />,
      },
      {
        path: 'listings/:id',
        element: <ListingDetail />,
      },
      {
        path: 'orders',
        element: <SalesOrders />,
      },
      {
        path: 'payouts',
        element: <Payouts />,
      },
      {
        path: 'settings',
        element: <StoreSettings />,
      },
    ],
  },

  // ─── Auth Routes (Login, Register, Forgot Password) ───
  {
    element: <AuthLayout />,
    children: [
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
    ],
  },

  // ─── 404 Catch-All ───
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
