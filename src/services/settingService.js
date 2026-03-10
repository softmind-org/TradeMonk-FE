import api from './api';

const settingService = {
    /**
     * Fetch all global settings
     * @returns {Promise<Object>}
     */
    getSettings: async () => {
        return api.get('/settings');
    },

    /**
     * Update or create a specific setting (Admin Only)
     * @param {string} key 
     * @param {any} value 
     * @returns {Promise<Object>}
     */
    updateSetting: async (key, value) => {
        return api.post('/settings', { key, value });
    }
};

export default settingService;
