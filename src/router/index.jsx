/**
 * Router Configuration
 * Defines all application routes
 */
import { createBrowserRouter } from 'react-router-dom'
import { ComingSoon } from '@pages'

export const router = createBrowserRouter([
  {
    path: '*',
    element: <ComingSoon />,
  },
])

export default router
