import { useMutation, useQueryClient } from '@tanstack/react-query'
import productService from '../services/productService'

/**
 * Custom hook to update an existing product listing
 * @returns {Object} - Mutation object
 */
export const useUpdateListing = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ productId, productData }) =>
            productService.updateProduct(productId, productData),
        onSuccess: (data, variables) => {
            // Invalidate queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['seller-listings'] })
            queryClient.invalidateQueries({ queryKey: ['product', variables.productId] })
        },
    })
}

export default useUpdateListing
