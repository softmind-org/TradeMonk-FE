/**
 * AuthLayout Component
 * Layout for authentication pages (used by router)
 */
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(30, 58, 138, 0.15) 0%, rgba(11, 18, 32, 0) 70%)',
          filter: 'blur(60px)'
        }}
      />
      
      <div className="w-full max-w-lg z-10 relative">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout

