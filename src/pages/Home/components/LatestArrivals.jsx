/**
 * Latest Arrivals Section Component
 * Displays a grid of latest card listings
 */
import { useState, useEffect } from 'react'
import { ProductCard } from '@components/ui'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context'
import { useLatestArrivals } from '@/hooks/useLatestArrivals'
import { useFavorites } from '@/hooks/useFavorite'
import { pokemonLogo } from '@assets'
import { useQueryClient } from '@tanstack/react-query'
import productService from '@/services/productService'

const LatestArrivals = ({ onCardClick }) => {
  const { isAuthenticated } = useAuth()
  const { data: products, isLoading } = useLatestArrivals(8)
  const queryClient = useQueryClient()
  
  // Get product IDs for favorites
  const productIds = products?.map(p => p._id) || []
  const { favorites, toggleFavorite } = useFavorites(productIds)

  // Prefetch favorite status for all products when loaded
  useEffect(() => {
    if (isAuthenticated && products?.length) {
      products.forEach(product => {
        queryClient.prefetchQuery({
          queryKey: ['favorite', product._id],
          queryFn: async () => {
            const response = await productService.checkFavorite(product._id)
            return response.isFavorited || false
          },
          staleTime: 5 * 60 * 1000,
        })
      })
    }
  }, [isAuthenticated, products, queryClient])

  const handleFavoriteClick = (id) => {
    toggleFavorite(id)
  }

  /**
   * Helper to format image URLs
   * Prepends the backend server origin to the stored relative path
   */
  const formatImageUrl = (path) => {
    if (!path || path === '') return pokemonLogo;
    
    // If it's already a full URL, return it
    if (path.startsWith('http')) return path;
    
    // Get server API URL from env
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
    let serverBase = '';
    
    try {
      // Extract origin (e.g., http://localhost:5000)
      serverBase = new URL(apiBase).origin;
    } catch (e) {
      serverBase = apiBase.split('/api')[0];
    }
    // Backend already stores path as '/public/uploads/products/filename.jpg'
    // So we just need to join it with serverBase
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${serverBase}${cleanPath}`;
  }

  // Map API data to ProductCard props
  const cards = products?.map(product => ({
    id: product._id,
    image: formatImageUrl(product.images?.[0]),
    backImage: formatImageUrl(product.backImage),
    name: product.title,
    price: product.price,
    condition: product.condition,
    edition: product.collectionName,
    badge: product.badges?.[0] || 'FAST SHIPPING', // Use first badge if available or default
    topBadge: product.rarity,
    rating: product.rating || 5,
    isFavorite: !!favorites[product._id]
  })) || []

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 lg:px-2">
            <div className="flex items-center justify-between mb-8">
               <div>
                 <div className="h-8 w-48 bg-gray-700/50 rounded animate-pulse mb-2"></div>
                 <div className="h-4 w-32 bg-gray-700/50 rounded animate-pulse"></div>
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-gray-700/20 rounded-xl animate-pulse"></div>
                ))}
            </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-2">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-foreground text-2xl md:text-3xl font-bold mb-1">
              Latest Arrivals
            </h2>
            <p className="text-muted-foreground text-sm uppercase tracking-wider">
              DIRECT FROM VERIFIED SELLERS
            </p>
          </div>
          <Link 
            to="/marketplace" 
            className="hidden md:flex items-center gap-2 text-secondary font-bold hover:text-secondary transition-colors"
          >
            Enter Marketplace
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.length > 0 ? (
            cards.map((card) => (
              <ProductCard
                key={card.id}
                {...card}
                isLoggedIn={isAuthenticated}
                onFavoriteClick={() => handleFavoriteClick(card.id)}
                onCardClick={onCardClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No new cards available at the moment.
            </div>
          )}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 md:hidden flex justify-center">
          <Link 
            to="/marketplace" 
            className="flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors"
          >
           Enter Marketplace <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LatestArrivals
