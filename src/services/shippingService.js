import api from './api';

const shippingService = {
    /**
     * Get estimated shipping methods between two countries
     * @param {string} fromCountry - ISO-2 code (e.g., 'DE', 'ES')
     * @param {string} toCountry - ISO-2 code (e.g., 'NL', 'GB')
     * @param {number} weight - Weight in grams
     * @returns {Promise<Object>}
     */
    getMethods: async (fromCountry = '', toCountry = '', weight = 500) => {
        const query = new URLSearchParams();
        if (fromCountry) query.append('from', fromCountry);
        if (toCountry) query.append('to', toCountry);
        if (weight) query.append('weight', weight);

        return api.get(`/shipping/methods?${query.toString()}`);
    },

    /**
     * Get automatically calculated shipping estimates based on seller origin and item value tiers
     * @param {string} destinationCountry - ISO-2 code (e.g., 'NL', 'GB')
     * @param {Array} sellerGroups - Array of {sellerId, itemsTotal}
     * @returns {Promise<Object>}
     */
    getEstimates: async (destinationCountry, sellerGroups) => {
        return api.post('/shipping/estimate', { destinationCountry, sellerGroups });
    },

    /**
     * Generate label for a confirmed order via SendCloud
     * @param {string} orderId - Mongoose Order ID
     * @returns {Promise<Object>}
     */
    generateLabel: async (orderId) => {
        return api.post('/shipping/label', { orderId });
    }
};

export default shippingService;
