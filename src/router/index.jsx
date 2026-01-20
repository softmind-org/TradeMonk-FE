/**
 * Router Configuration
 * Defines all application routes
 */
import { createBrowserRouter } from 'react-router-dom'
import { HomePage, AboutPage, NotFoundPage } from '@pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  // Add more routes here
  // {
  //   path: '/services',
  //   element: <ServicesPage />,
  // },
  // {
  //   path: '/contact',
  //   element: <ContactPage />,
  // },
  // {
  //   path: '/login',
  //   element: <LoginPage />,
  // },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
