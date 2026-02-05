import { useQuery } from '@tanstack/react-query'
import productService from '../services/productService'

/**
 * Custom hook to fetch a single product by ID
 * @param {string} productId - Product ID
 * @returns {Object} - Query result with product, isLoading, error
 */
export const useProductDetail = (productId) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            const response = await productService.getProductById(productId)
            // API returns { success: true, data: {...product} }
            return response.data || null
        },
        enabled: !!productId, // Only fetch if productId exists
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export default useProductDetail
