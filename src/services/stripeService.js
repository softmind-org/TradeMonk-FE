/**
 * Stripe Service
 * Handles Stripe Connect onboarding and payment API calls
 */
import api from './api'

export const stripeService = {
    /**
     * Create a Stripe Express Connect account for the seller
     * @param {Object} data - { country, businessType }
     * @returns {Promise<Object>} - { success, stripeConnectId }
     */
    createConnectAccount: async (data = {}) => {
        return api.post('/stripe/connect/account', data)
    },

    /**
     * Get Stripe onboarding link for the seller
     * @returns {Promise<Object>} - { success, url }
     */
    createAccountLink: async () => {
        return api.post('/stripe/connect/account-link')
    },

    /**
     * Create an Account Session for embedded Connect components
     * @returns {Promise<Object>} - { success, clientSecret }
     */
    createAccountSession: async () => {
        return api.post('/stripe/connect/account-session')
    },

    /**
     * Get the seller's Stripe Connect account status
     * @returns {Promise<Object>} - { success, connected, onboardingComplete, payoutsEnabled, ... }
     */
    getAccountStatus: async () => {
        return api.get('/stripe/connect/account-status')
    },

    /**
     * Create a payment intent with Connect fees
     * @param {Object} paymentData - { sellerId, subtotal, shipping, serviceFee }
     * @returns {Promise<Object>} - { clientSecret, paymentIntentId, breakdown }
     */
    createPaymentIntent: async (paymentData) => {
        return api.post('/payments/create-intent', paymentData)
    },
}

export default stripeService
