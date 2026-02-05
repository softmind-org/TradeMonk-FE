import { useMutation, useQuery, useQueries, useQueryClient } from '@tanstack/react-query'
import productService from '../services/productService'
import { useAuth } from '@/context'

/**
 * Custom hook to manage product favorites
 * Provides toggle function and checks favorite status
 */
export const useFavorite = (productId) => {
    const queryClient = useQueryClient()
    const { isAuthenticated } = useAuth()

    // Query to check if product is favorited
    const { data: favoriteData } = useQuery({
        queryKey: ['favorite', productId],
        queryFn: async () => {
            const response = await productService.checkFavorite(productId)
            return response.isFavorited || false
        },
        enabled: !!productId && isAuthenticated, // Only fetch if logged in
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Mutation to toggle favorite
    const toggleMutation = useMutation({
        mutationFn: () => productService.toggleFavorite(productId),
        // Optimistic update
        onMutate: async () => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['favorite', productId] })

            // Snapshot the previous value
            const previousValue = queryClient.getQueryData(['favorite', productId])

            // Optimistically update to the new value
            queryClient.setQueryData(['favorite', productId], !previousValue)

            return { previousValue }
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, variables, context) => {
            queryClient.setQueryData(['favorite', productId], context.previousValue)
        },
        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['favorite', productId] })
        },
    })

    return {
        isFavorite: !!favoriteData,
        isLoading: toggleMutation.isPending,
        toggleFavorite: () => {
            if (!isAuthenticated) return // Don't toggle if not logged in
            toggleMutation.mutate()
        }
    }
}

/**
 * Hook to manage favorites for multiple products
 * Uses useQueries for reactivity - re-renders when any favorite status changes
 */
export const useFavorites = (productIds = []) => {
    const queryClient = useQueryClient()
    const { isAuthenticated } = useAuth()

    // Use useQueries to subscribe to all favorite statuses reactively
    const favoriteQueries = useQueries({
        queries: productIds.map(id => ({
            queryKey: ['favorite', id],
            queryFn: async () => {
                const response = await productService.checkFavorite(id)
                return response.isFavorited || false
            },
            enabled: !!id && isAuthenticated,
            staleTime: 5 * 60 * 1000,
        }))
    })

    // Build favorites map from query results
    const favorites = {}
    productIds.forEach((id, index) => {
        const query = favoriteQueries[index]
        if (query?.data !== undefined) {
            favorites[id] = query.data
        }
    })

    // Toggle function that works with any product ID
    const toggleFavorite = async (productId) => {
        if (!isAuthenticated) return

        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: ['favorite', productId] })

        // Snapshot the previous value
        const previousValue = queryClient.getQueryData(['favorite', productId])

        // Optimistically update to the new value
        queryClient.setQueryData(['favorite', productId], !previousValue)

        try {
            await productService.toggleFavorite(productId)
            queryClient.invalidateQueries({ queryKey: ['favorite', productId] })
        } catch (error) {
            // Roll back on error
            queryClient.setQueryData(['favorite', productId], previousValue)
        }
    }

    return {
        favorites,
        toggleFavorite,
        isFavorite: (id) => !!favorites[id],
        isLoading: favoriteQueries.some(q => q.isLoading)
    }
}

export default useFavorite
