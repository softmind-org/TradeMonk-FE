/**
 * Tailwind CSS class merge utility
 * Combines class names and handles conflicts
 */

/**
 * Combine multiple class names
 * @param  {...string} classes - Class names to combine
 * @returns {string} - Combined class string
 */
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

export default cn
