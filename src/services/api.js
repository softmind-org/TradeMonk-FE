/**
 * API Service Configuration
 * Base configuration for API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * Base fetch wrapper with common configurations
 */
const apiClient = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`

    const defaultHeaders = {
        'Content-Type': 'application/json',
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    }

    try {
        const response = await fetch(url, config)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('API Error:', error)
        throw error
    }
}

// HTTP method helpers
export const api = {
    get: (endpoint, options = {}) =>
        apiClient(endpoint, { ...options, method: 'GET' }),

    post: (endpoint, data, options = {}) =>
        apiClient(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),

    put: (endpoint, data, options = {}) =>
        apiClient(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),

    patch: (endpoint, data, options = {}) =>
        apiClient(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),

    delete: (endpoint, options = {}) =>
        apiClient(endpoint, { ...options, method: 'DELETE' }),
}

export default api
