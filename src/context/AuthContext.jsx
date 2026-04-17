import { createContext, useContext, useState, useEffect } from 'react'
import { userService } from '../services/userService'

// Create context
const AuthContext = createContext(null)

/**
 * Auth Provider Component
 * Provides authentication state and methods to the app
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('accessToken')
        
        if (storedUser && token) {
          // Optimistically load from cache
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
          
          // Fetch fresh profile in the background to renew signed URLs etc.
          try {
            const res = await userService.getProfile()
            if (res.success && res.data) {
                // Keep the token alongside fresh user data
                localStorage.setItem('user', JSON.stringify(res.data))
                setUser(res.data)
            }
          } catch (profileError) {
             console.error('Failed to refresh profile in background:', profileError)
             // If token expired, error interceptor will handle the logout flow automatically
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('accessToken', token)
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to use auth context
 * @returns {Object} - Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
