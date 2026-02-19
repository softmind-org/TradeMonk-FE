import api from './api';

export const orderService = {
    /**
     * Create a new order after successful payment
     * @param {Object} orderData - { items, totalAmount, feeBreakdown, shippingAddress, paymentIntentId }
     * @returns {Promise<Object>}
     */
    createOrder: async (orderData) => {
        return api.post('/orders', orderData);
    },

    /**
     * Get all orders for the current user
     * @returns {Promise<Object>}
     */
    getMyOrders: async () => {
        return api.get('/orders');
    },

    /**
     * Get single order details
     * @param {string} orderId 
     * @returns {Promise<Object>}
     */
    getOrder: async (orderId) => {
        return api.get(`/orders/${orderId}`);
    }
};

export default orderService;
