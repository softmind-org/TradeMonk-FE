/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import api from './api'

export const authService = {
    /**
     * Login user
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>} - User data with token
     */
    login: async (credentials) => {
        return api.post('/auth/login', credentials)
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} - Created user data
     */
    register: async (userData) => {
        return api.post('/auth/register', userData)
    },

    /**
     * Logout user
     * @returns {Promise<void>}
     */
    logout: async () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        return api.post('/auth/logout', {})
    },

    /**
     * Get current user profile
     * @returns {Promise<Object>} - User profile data
     */
    getCurrentUser: async () => {
        return api.get('/auth/me')
    },

    /**
     * Refresh auth token
     * @returns {Promise<Object>} - New token
     */
    refreshToken: async () => {
        return api.post('/auth/refresh', {})
    },

    /**
     * Request password reset
     * @param {string} email - User email
     * @returns {Promise<Object>}
     */
    forgotPassword: async (email) => {
        return api.post('/auth/forgot-password', { email })
    },

    /**
     * Reset password
     * @param {Object} data - { token, password }
     * @returns {Promise<Object>}
     */
    resetPassword: async (data) => {
        return api.post('/auth/reset-password', data)
    },
}

export default authService
