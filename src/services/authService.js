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
        const response = await api.post('/auth/login', credentials);

        // Backend returns: { success: true, data: { _id, fullName, email, role, accessToken } }
        if (response.success && response.data) {
            const { accessToken, ...user } = response.data;

            // Store token and user data
            localStorage.setItem('authToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));
        }

        return response;
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} - Created user data
     */
    register: async (userData) => {
        return api.post('/auth/register', userData);
    },

    /**
     * Logout user
     * @returns {Promise<void>}
     */
    logout: async () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return api.post('/auth/logout', {});
    },

    /**
     * Get current user profile
     * @returns {Promise<Object>} - User profile data
     */
    getCurrentUser: async () => {
        return api.get('/auth/me');
    },

    /**
     * Refresh auth token
     * @returns {Promise<Object>} - New token
     */
    refreshToken: async () => {
        return api.post('/auth/refresh', {});
    },

    /**
     * Request password reset (Send OTP)
     * @param {Object|string} email - User email
     * @returns {Promise<Object>}
     */
    forgotPassword: async (email) => {
        // Handle both object and string input for flexibility
        const payload = typeof email === 'object' ? email : { email };
        return api.post('/auth/forgot-password', payload);
    },

    /**
     * Verify OTP
     * @param {Object} data - { email, otp }
     * @returns {Promise<Object>}
     */
    verifyOTP: async (data) => {
        return api.post('/auth/verify-otp', data);
    },

    /**
     * Reset password
     * @param {Object} data - { email, otp, newPassword, confirmPassword }
     * @returns {Promise<Object>}
     */
    resetPassword: async (data) => {
        return api.post('/auth/reset-password', data);
    },
}

export default authService
