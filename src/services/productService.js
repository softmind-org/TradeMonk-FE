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
    },

    /**
     * Get products for the current seller
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} - Paginated product list for seller
     */
    getSellerProducts: async (params = {}) => {
        const queryParams = new URLSearchParams(params).toString()
        const endpoint = `/products/me${queryParams ? `?${queryParams}` : ''}`
        return api.get(endpoint)
    },

    /**
     * Create a new product listing
     * @param {FormData|Object} productData - Product data
     * @returns {Promise<Object>} - Created product
     */
    createProduct: async (productData) => {
        return api.post('/products', productData, {
            headers: {
                'Content-Type': productData instanceof FormData ? 'multipart/form-data' : 'application/json'
            }
        })
    },

    /**
     * Update an existing product listing
     * @param {string} productId - Product ID
     * @param {FormData|Object} productData - Updated product data
     * @returns {Promise<Object>} - Updated product
     */
    updateProduct: async (productId, productData) => {
        return api.put(`/products/${productId}`, productData, {
            headers: {
                'Content-Type': productData instanceof FormData ? 'multipart/form-data' : 'application/json'
            }
        })
    },

    /**
     * Delete a product listing
     * @param {string} productId - Product ID
     * @returns {Promise<Object>} - Success message
     */
    deleteProduct: async (productId) => {
        return api.delete(`/products/${productId}`)
    },

    // --- ADMIN METHODS ---
    /**
     * Get all listings across all sellers (admin only)
     * @returns {Promise<Object>} - { success, data: [...products] }
     */
    getAllListings: async () => {
        return api.get('/products/all')
    },
}

export default productService
