/**
 * Category Service
 * Handles API calls for admin category management
 */
import api from './api'

export const categoryService = {
    /**
     * Get all categories (public)
     * @returns {Promise<Object>} - { success, data: [...categories] }
     */
    getAll: async () => {
        return api.get('/categories')
    },

    /**
     * Create a new category (admin only)
     * @param {Object} categoryData - { name, slug, description }
     * @returns {Promise<Object>} - { success, data: { ...category } }
     */
    create: async (categoryData) => {
        return api.post('/categories', categoryData)
    },

    /**
     * Update an existing category (admin only)
     * @param {string} categoryId - Category ID
     * @param {Object} categoryData - { name, slug, description }
     * @returns {Promise<Object>} - { success, data: { ...category } }
     */
    update: async (categoryId, categoryData) => {
        return api.put(`/categories/${categoryId}`, categoryData)
    },

    /**
     * Toggle category status (admin only)
     * @param {string} categoryId - Category ID
     * @param {string} status - 'enabled' | 'disabled'
     * @returns {Promise<Object>} - { success, data: { ...category } }
     */
    toggleStatus: async (categoryId, status) => {
        return api.patch(`/categories/${categoryId}/status`, { status })
    },
}

export default categoryService
