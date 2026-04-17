import { useMutation, useQueryClient } from '@tanstack/react-query'
import productService from '../services/productService'

/**
 * Custom hook to create a new product listing
 * @returns {Object} - Mutation object
 */
export const useCreateListing = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (productData) => productService.createProduct(productData),
        onSuccess: () => {
            // Invalidate seller-listings query to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['seller-listings'] })
        },
    })
}

export default useCreateListing
