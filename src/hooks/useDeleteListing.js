import { useMutation, useQueryClient } from '@tanstack/react-query'
import productService from '../services/productService'

/**
 * Custom hook to delete a product listing
 * @returns {Object} - Mutation object
 */
export const useDeleteListing = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (productId) => productService.deleteProduct(productId),
        onSuccess: () => {
            // Invalidate seller-listings query to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['seller-listings'] })
        },
    })
}

export default useDeleteListing
