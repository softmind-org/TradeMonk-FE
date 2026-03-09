import api from './api';

export const orderService = {
    // --- BUyER METHODS ---
    /**
     * Create a new order after successful payment
     * @param {Object} orderData - { items, totalAmount, feeBreakdown, shippingAddress, paymentIntentId }
     * @returns {Promise<Object>}
     */
    createOrder: async (orderData) => {
        return api.post('/orders', orderData);
    },

    /**
     * Get all orders for the current user (buyer)
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
    },

    // --- SELLER METHODS ---
    /**
     * Get orders for the logged-in seller
     * @param {string} [status] Optional status filter (processing, confirmed, shipped, delivered)
     * @returns {Promise<Object>}
     */
    getSellerOrders: async (status = '') => {
        const query = status ? `?status=${status}` : '';
        return api.get(`/orders/seller${query}`);
    },

    /**
     * Download monthly sales report CSV
     * @param {number|string} month (1-12)
     * @param {number|string} year 
     * @returns {Promise<Blob>}
     */
    downloadCsvReport: async (month, year) => {
        return api.get(`/orders/seller/report/csv?month=${month}&year=${year}`, {
            responseType: 'blob'
        });
    },

    /**
     * Update order status (for sellers)
     * @param {string} orderId 
     * @param {Object} data { status, trackingNumber, shippingCarrier }
     * @returns {Promise<Object>}
     */
    updateOrderStatus: async (orderId, data) => {
        return api.patch(`/orders/${orderId}/status`, data);
    },

    // --- ADMIN METHODS ---
    /**
     * Get all orders (admin only)
     * @returns {Promise<Object>}
     */
    getAllOrders: async () => {
        return api.get('/orders/all');
    },

    /**
     * Download order invoice as PDF
     * @param {string} orderId 
     * @returns {Promise<Blob>}
     */
    downloadInvoice: async (orderId) => {
        return api.get(`/orders/${orderId}/invoice`, {
            responseType: 'blob'
        });
    }
};

export default orderService;

