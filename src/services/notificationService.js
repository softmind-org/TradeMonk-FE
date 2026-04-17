import api from './api';

const notificationService = {
    /**
     * Get current user's latest notifications with unread count
     * @returns {Promise<{ data: Array, unreadCount: number }>}
     */
    getMyNotifications: async () => {
        return api.get('/notifications');
    },

    /**
     * Mark a single notification as read
     * @param {string} id
     */
    markOneRead: async (id) => {
        return api.patch(`/notifications/${id}/read`);
    },

    /**
     * Mark all notifications as read
     */
    markAllRead: async () => {
        return api.patch('/notifications/read-all');
    }
};

export default notificationService;
