import api from './api';

export const cartService = {
    /**
     * Get all items in the user's cart
     * @returns {Promise<Object>}
     */
    getCart: async () => {
        return api.get('/cart');
    },

    /**
     * Add a product to the cart
     * @param {string} productId - The ID of the product
     * @param {number} quantity - The quantity to add
     * @returns {Promise<Object>}
     */
    addToCart: async (productId, quantity = 1) => {
        return api.post('/cart', { productId, quantity });
    },

    /**
     * Remove an item from the cart
     * @param {string} cartItemId - The ID of the cart item
     * @returns {Promise<Object>}
     */
    removeFromCart: async (cartItemId) => {
        return api.delete(`/cart/${cartItemId}`);
    },

    /**
     * Clear the entire cart
     * @returns {Promise<Object>}
     */
    clearCart: async () => {
        return api.delete('/cart/clear');
    },
};

export default cartService;
