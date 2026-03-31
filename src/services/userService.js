/**
 * User Service
 * Handles API calls for admin user management
 */
import api from './api'

export const userService = {
    /**
     * Get all users (admin only)
     * @returns {Promise<Object>} - { success, data: [...users] }
     */
    getAll: async () => {
        return api.get('/users')
    },

    /**
     * Get user details by ID (admin only)
     * @param {string} userId - User ID
     * @returns {Promise<Object>} - { success, data: { user, stats } }
     */
    getById: async (userId) => {
        return api.get(`/users/${userId}`)
    },

    /**
     * Toggle user status (suspend/activate) (admin only)
     * @param {string} userId - User ID
     * @param {string} status - 'active' | 'suspended'
     * @returns {Promise<Object>} - { success, data: { ...user } }
     */
    toggleStatus: async (userId, status) => {
        return api.patch(`/users/${userId}/status`, { status })
    },

    // --- SELLER ADMIN METHODS ---
    /**
     * Get all sellers with stats (admin only)
     * @returns {Promise<Object>}
     */
    getSellers: async () => {
        return api.get('/users/sellers')
    },

    /**
     * Get seller detail with full stats (admin only)
     * @param {string} sellerId
     * @returns {Promise<Object>}
     */
    getSellerDetail: async (sellerId) => {
        return api.get(`/users/sellers/${sellerId}`)
    },

    /**
     * Freeze/unfreeze seller account (admin only)
     * @param {string} sellerId
     * @param {string} status - 'active' | 'suspended'
     * @returns {Promise<Object>}
     */
    freezeSeller: async (sellerId, status) => {
        return api.patch(`/users/${sellerId}/status`, { status })
    },

    // --- LOGGED IN USER PROFILE METHODS ---
    /**
     * Get logged in user profile
     * @returns {Promise<Object>}
     */
    getProfile: async () => {
        return api.get('/users/profile')
    },

    /**
     * Update logged in user profile
     * @param {Object} data - Profile data
     * @returns {Promise<Object>}
     */
    updateProfile: async (data) => {
        const isFormData = data instanceof FormData
        return api.put('/users/profile', data, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
        })
    },
}

export default userService
