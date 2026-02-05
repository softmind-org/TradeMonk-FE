/**
 * Product Service
 * Handles data fetching for products
 */
import api from './api'

export const productService = {
    /**
     * Get products with optional filters
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} - Paginated product list
     */
    getProducts: async (params = {}) => {
        // Build query string from params
        const queryParams = new URLSearchParams(params).toString()
        const endpoint = `/products${queryParams ? `?${queryParams}` : ''}`
        return api.get(endpoint)
    },

    /**
     * Toggle favorite status for a product
     * @param {string} productId - Product ID
     * @returns {Promise<Object>} - { success, isFavorited, message }
     */
    toggleFavorite: async (productId) => {
        return api.post(`/products/${productId}/favorite`)
    },

    /**
     * Check if a product is favorited by the current user
     * @param {string} productId - Product ID
     * @returns {Promise<Object>} - { success, isFavorited }
     */
    checkFavorite: async (productId) => {
        return api.get(`/products/${productId}/favorite`)
    },

    /**
     * Get all favorited products for the current user
     * @returns {Promise<Object>} - { success, data: [...productIds] }
     */
    getFavorites: async () => {
        return api.get('/products/favorites')
    },

    /**
     * Get a single product by ID
     * @param {string} productId - Product ID
     * @returns {Promise<Object>} - { success, data: {...product} }
     */
    getProductById: async (productId) => {
        return api.get(`/products/${productId}`)
    }
}

export default productService
