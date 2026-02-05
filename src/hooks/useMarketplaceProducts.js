import { useQuery } from '@tanstack/react-query'
import productService from '../services/productService'

/**
 * Custom hook to fetch marketplace products with filters
 * @param {Object} filters - Filter options
 * @param {string} filters.gameSystem - Game system filter ('All', 'Pokémon', etc.)
 * @param {string} filters.condition - Condition filter ('ALL', 'MINT', 'NM', etc.)
 * @param {string} filters.priceMin - Minimum price
 * @param {string} filters.priceMax - Maximum price
 * @param {string} sortBy - Sort option ('newest', 'price-low', 'price-high')
 * @returns {Object} - Query result with data, isLoading, error
 */
export const useMarketplaceProducts = (filters = {}, sortBy = 'newest') => {
    // Build API params from frontend filters
    const buildParams = () => {
        const params = {}

        // Game System filter
        if (filters.gameSystem && filters.gameSystem !== 'All') {
            params.game = filters.gameSystem
        }

        // Condition filter
        if (filters.condition && filters.condition !== 'ALL') {
            params.condition = filters.condition
        }

        // Price filters
        if (filters.priceMin && filters.priceMin !== '') {
            params.minPrice = filters.priceMin
        }
        if (filters.priceMax && filters.priceMax !== '') {
            params.maxPrice = filters.priceMax
        }

        // Sort mapping
        switch (sortBy) {
            case 'price-low':
                params.sort = 'price'
                break
            case 'price-high':
                params.sort = '-price'
                break
            case 'newest':
            default:
                params.sort = '-createdAt'
                break
        }

        return params
    }

    return useQuery({
        // Include all filter values in queryKey for automatic refetching
        queryKey: ['marketplace-products', filters, sortBy],
        queryFn: async () => {
            const params = buildParams()
            const response = await productService.getProducts(params)
            // API returns { success: true, data: [...], count, total, totalPages, currentPage }
            return {
                products: response.data || [],
                total: response.total || 0,
                totalPages: response.totalPages || 1,
                currentPage: response.currentPage || 1
            }
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        keepPreviousData: true, // Keep showing old data while fetching new
    })
}

export default useMarketplaceProducts
