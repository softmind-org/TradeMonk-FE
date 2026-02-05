import { useQuery } from '@tanstack/react-query'
import productService from '../services/productService'

/**
 * Custom hook to fetch latest product arrivals
 * @param {number} limit - Number of products to fetch
 * @returns {Object} - Query result
 */
export const useLatestArrivals = (limit = 8) => {
    return useQuery({
        queryKey: ['latest-arrivals', limit],
        queryFn: async () => {
            const response = await productService.getProducts({
                limit,
                sort: '-createdAt' // Sort by newest first
            })
            // Return the data array directly if possible, or the whole response
            // Based on user provided response structure: { success: true, data: [...] }
            return response.data || []
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export default useLatestArrivals
