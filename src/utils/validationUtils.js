/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with strength info
 */
export const validatePassword = (password) => {
    const result = {
        isValid: false,
        strength: 'weak',
        errors: [],
    }

    if (password.length < 8) {
        result.errors.push('Password must be at least 8 characters')
    }
    if (!/[A-Z]/.test(password)) {
        result.errors.push('Password must contain at least one uppercase letter')
    }
    if (!/[a-z]/.test(password)) {
        result.errors.push('Password must contain at least one lowercase letter')
    }
    if (!/[0-9]/.test(password)) {
        result.errors.push('Password must contain at least one number')
    }
    if (!/[!@#$%^&*]/.test(password)) {
        result.errors.push('Password must contain at least one special character (!@#$%^&*)')
    }

    if (result.errors.length === 0) {
        result.isValid = true
        result.strength = 'strong'
    } else if (result.errors.length <= 2) {
        result.strength = 'medium'
    }

    return result
}

/**
 * Check if value is empty (null, undefined, empty string, empty array/object)
 * @param {any} value - Value to check
 * @returns {boolean} - Is empty
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true
    if (typeof value === 'string') return value.trim() === ''
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
}
