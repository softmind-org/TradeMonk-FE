import api from './api';

export const payoutService = {
    /**
     * Get seller's payout balance (available and pending)
     * Available funds are from delivered orders or shipped orders older than 7 days
     * @returns {Promise<Object>} { availableBalance, pendingBalance, eligibleOrders }
     */
    getPayoutBalance: async () => {
        return api.get('/payouts/balance');
    },

    /**
     * Request a manual payout transfer to Connected Stripe Account
     * Triggers transfer of all eligible available balance
     * @returns {Promise<Object>} { transferId, amount, ordersProcessed }
     */
    requestPayout: async () => {
        return api.post('/payouts/request');
    }
};

export default payoutService;
