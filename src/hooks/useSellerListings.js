import { useQuery } from '@tanstack/react-query'
import productService from '../services/productService'
import { formatImageUrl } from '../utils'

/**
 * Custom hook to fetch products for the logged-in seller
 * @param {Object} params - Pagination and sort parameters
 * @returns {Object} - Query result with listings, isLoading, error
 */
export const useSellerListings = (params = {}) => {
    return useQuery({
        queryKey: ['seller-listings', params],
        queryFn: async () => {
            const response = await productService.getSellerProducts(params)

            // API returns: 
            // { success: true, count, total, totalPages, currentPage, data: [...] }

            // Map API data to the format expected by MyListings table columns
            const mappedData = (response.data || []).map(item => ({
                id: item._id,
                name: item.title,
                image: formatImageUrl(item.images?.[0] || ''),
                backImage: formatImageUrl(item.backImage || ''),
                gameCategory: item.gameSystem,
                setName: item.collectionName,
                setNumber: item.setNumber || '', // Fallback to empty string for consistent UI editing
                rarity: item.rarity,
                condition: item.condition,
                price: item.price,
                quantity: item.quantity,
                status: item.status,
                description: item.description,
            }))

            return {
                listings: mappedData,
                total: response.total || mappedData.length,
                totalPages: response.totalPages || 1,
                currentPage: response.currentPage || 1
            }
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}

export default useSellerListings
