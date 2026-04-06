/**
 * Router Configuration
 * Defines all application routes
 */
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout, AuthLayout, SellerLayout, AdminLayout } from '@layouts'
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
  StoreSettings,
  AdminOverview,
  AdminCategories,
  AdminOrders,
  AdminUsers,
  AdminUserDetail,
  AdminListings,
  AdminListingDetail,
  AdminSellers,
  AdminSellerDetail,
  AdminPayments,
  AdminSettings,
  TermsSettings,
  TermsPage,
  TermsOfService,
  PrivacyPage,
  Profile,
  BuyerProfile,
  SellerProfile
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
      {
        path: '/terms',
        element: <TermsOfService />,
      },
      {
        path: '/privacy',
        element: <PrivacyPage />,
      },
      // Protected buyer-only routes (inside MainLayout)
      {
        path: '/cart',
        element: (
          <ProtectedRoute allowedRoles={['buyer', 'seller']}>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute allowedRoles={['buyer', 'seller']}>
            <OrderHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute allowedRoles={['buyer', 'seller']}>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: '/order-complete',
        element: (
          <ProtectedRoute allowedRoles={['buyer', 'seller']}>
            <OrderComplete />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute allowedRoles={['buyer', 'seller']}>
            <BuyerProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // ─── Public Terms & Conditions Page ───
  {
    path: '/terms/:type',
    element: <TermsPage />,
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
        path: 'profile',
        element: <SellerProfile />,
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

  // ─── Protected Admin Routes ───
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminOverview />,
      },
      // Placeholder routes for sidebar links
      { path: 'dashboard', element: <AdminOverview /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'users/:id', element: <AdminUserDetail /> },
      { path: 'sellers', element: <AdminSellers /> },
      { path: 'sellers/:id', element: <AdminSellerDetail /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'listings', element: <AdminListings /> },
      { path: 'listings/:id', element: <AdminListingDetail /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'payments', element: <AdminPayments /> },
      { path: 'settings', element: <AdminSettings /> },
      { path: 'terms-settings', element: <TermsSettings /> },
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
