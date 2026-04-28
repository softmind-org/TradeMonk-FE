/**
 * Chat Service
 * Handles API calls for messaging between buyers and sellers
 */
import api from './api'

export const chatService = {
    /**
     * Get all conversations for the current user
     * @returns {Promise<Object>} - { success, data: [...conversations] }
     */
    getConversations: async () => {
        return api.get('/chat/conversations')
    },

    /**
     * Get or create a conversation for a specific product + seller
     * @param {string} productId - Product ID
     * @param {string} sellerId - Seller user ID
     * @returns {Promise<Object>} - { success, data: conversation }
     */
    getOrCreateConversation: async (productId, sellerId) => {
        return api.post('/chat/conversations', { productId, sellerId })
    },

    /**
     * Get messages for a conversation
     * @param {string} conversationId - Conversation ID
     * @param {number} page - Page number for pagination
     * @returns {Promise<Object>} - { success, data: [...messages], pagination }
     */
    getMessages: async (conversationId, page = 1) => {
        return api.get(`/chat/conversations/${conversationId}/messages?page=${page}&limit=50`)
    },

    /**
     * Send a message (text + optional image)
     * @param {string} conversationId - Conversation ID
     * @param {FormData|Object} messageData - Message data
     * @returns {Promise<Object>} - { success, data: message }
     */
    sendMessage: async (conversationId, messageData) => {
        const isFormData = messageData instanceof FormData
        return api.post(`/chat/conversations/${conversationId}/messages`, messageData, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
        })
    },

    /**
     * Mark all messages in a conversation as read
     * @param {string} conversationId - Conversation ID
     * @returns {Promise<Object>} - { success, message }
     */
    markAsRead: async (conversationId) => {
        return api.put(`/chat/conversations/${conversationId}/read`)
    }
}

export default chatService
