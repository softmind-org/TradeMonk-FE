/**
 * Image Utility functions
 */

import { pokemonLogo } from '../assets'

/**
 * Helper to format image URLs
 * Prepends the backend server origin to the stored relative path if needed
 * @param {string} path - Relative or absolute image path
 * @returns {string} - Full image URL or fallback logo
 */
export const formatImageUrl = (path) => {
    if (!path || path === '') return pokemonLogo;

    // If it's already a full URL, return it
    if (path.startsWith('http')) return path;

    // Get server API URL from env
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
    let serverUrl = ''

    try {
        serverUrl = new URL(apiUrl).origin
    } catch (e) {
        serverUrl = apiUrl.split('/api')[0]
    }

    // Ensure we don't have double slashes if path already starts with slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`

    return `${serverUrl}${cleanPath}`
}
