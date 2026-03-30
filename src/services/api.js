import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response.data; // Return only the data portion
    },
    (error) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - clear token
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                
                // Redirect to login with expired flag, but avoid loop if already on login
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login?expired=true';
                }
            }

            // Return a formatted error object
            return Promise.reject({
                message: data.message || 'An error occurred',
                status,
                data,
            });
        } else if (error.request) {
            // Request made but no response received
            return Promise.reject({
                message: 'Network error. Please check your connection.',
                status: 0,
            });
        } else {
            // Something else happened
            return Promise.reject({
                message: error.message || 'An unexpected error occurred',
                status: 0,
            });
        }
    }
);

export default api;
