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
}

export default userService
