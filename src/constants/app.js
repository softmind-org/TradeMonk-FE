/**
 * Application Constants
 */

export const APP_NAME = 'TradeMonk'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Your trusted partner for trading solutions'

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
export const API_TIMEOUT = 30000 // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
}

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
}
