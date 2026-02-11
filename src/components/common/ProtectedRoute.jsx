import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@context'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
           <div className="animate-spin w-8 h-8 border-4 border-[#D4A017] border-t-transparent rounded-full"></div>
        </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If roles are specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on their actual role
    if (user?.role === 'seller') {
        return <Navigate to="/seller/dashboard" replace />
    } else {
        return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute
