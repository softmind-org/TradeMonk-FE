/**
 * Marketplace Page
 * Features sidebar filters, sorting, and product grid
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Button, ProductCard, Input } from '@components/ui'
import { useAuth } from '@context'
import { useMarketplaceProducts } from '@/hooks/useMarketplaceProducts'
import { useFavorites } from '@/hooks/useFavorite'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import productService from '@/services/productService'
import categoryService from '@/services/categoryService'
import { pokemonLogo } from '@assets'
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="mb-8 border-b border-white/5 pb-8 last:border-0">
      <button 
        className="flex items-center justify-between w-full mb-4 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="aspect-[3/4] bg-gray-700/20 rounded-xl animate-pulse"></div>
    ))}
  </div>
)

const Marketplace = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  
  // -- State --
  const [filters, setFilters] = useState({
    gameSystem: 'All', // 'All', 'Pokémon', 'Yu-Gi-Oh', 'Magic: The Gathering'
    condition: 'ALL', // 'ALL', 'MINT', 'NM', 'LP', 'MP', 'HP', 'DMG'
    priceMin: '',
    priceMax: ''
  })
  
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'price-low', 'price-high'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low' },
    { value: 'price-high', label: 'Price: High' }
  ]
  
  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'Newest'

  // Fetch dynamic categories
  const { data: categoryData } = useQuery({
    queryKey: ['marketplaceCategories'],
    queryFn: async () => {
      const res = await categoryService.getAll()
      return res.data || []
    }
  })

  // Combine "All" with fetched category names. Default fallback if api fails.
  const dynamicGameSystems = categoryData && categoryData.length > 0 
    ? ['All', ...categoryData.map(c => c.name)] 
    : ['All', 'Pokémon', 'Yu-Gi-Oh', 'Magic: The Gathering']

  // -- API Integration --
  const { data, isLoading, error } = useMarketplaceProducts(filters, sortBy, searchQuery)
  const products = data?.products || []
  
  // Get product IDs for favorites
  const productIds = products.map(p => p._id)
  const { favorites, toggleFavorite } = useFavorites(productIds)

  // Prefetch favorite status for all products when loaded
  useEffect(() => {
    if (isAuthenticated && products.length) {
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
  const cards = products.map(product => ({
    id: product._id,
    image: formatImageUrl(product.images?.[0]),
    backImage: formatImageUrl(product.backImage),
    name: product.title,
    price: product.price,
    condition: product.condition,
    edition: product.collectionName,
    sellerType: product.seller?.sellerType,
    badge: product.badges?.[0], 
    topBadge: product.rarity,
    rating: product.rating || 5,
    isFavorite: !!favorites[product._id]
  }))

  // Console log data as requested
  useEffect(() => {
    console.log('🛒 Marketplace State Update:', {
      filters,
      sortBy,
      resultsCount: cards.length,
      isLoading,
      data: cards
    })
  }, [filters, sortBy, cards, isLoading])


  // -- Handlers --
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleCardClick = (id) => {
    navigate(`/product/${id}`)
  }
  
  // -- FilterSection and LoadingSkeleton moved outside to prevent re-rendering focus loss --

  return (
    <>
      <div className="bg-background min-h-screen py-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          
          <div className="flex flex-col lg:flex-row gap-8">
             {/* Mobile Filter Toggle */}
             <div className="lg:hidden mb-4">
                <Button 
                   onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                   className="w-full border border-white/10"
                >
                  {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                </Button>
             </div>

            {/* Sidebar Filters */}
            <aside className={`w-full lg:w-64 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-24">
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Refine Gallery</h2>
                
                {/* Game System Filter */}
                <FilterSection title="Game System">
                   {dynamicGameSystems.map(game => (
                     <div 
                        key={game}
                        className={`cursor-pointer py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
                           filters.gameSystem === game 
                             ? 'bg-[#111C2E] text-white border border-[#D4A017]/30' 
                             : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => handleFilterChange('gameSystem', game)}
                     >
                        {game}
                     </div>
                   ))}
                </FilterSection>

                {/* Condition Filter */}
                 <FilterSection title="Condition">
                    <div className="flex flex-wrap gap-2">
                      {['ALL', 'MINT', 'NM', 'LP', 'MP', 'HP', 'DMG'].map(cond => (
                         <button
                            key={cond}
                            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
                               filters.condition === cond
                                ? 'bg-[#111C2E] border-[#D4A017]/50 text-white'
                                : 'bg-transparent border-white/10 text-muted-foreground hover:border-white/20'
                            }`}
                            onClick={() => handleFilterChange('condition', cond)}
                         >
                            {cond}
                         </button>
                      ))}
                    </div>
                 </FilterSection>

                 {/* Price Authority Filter */}
                 <FilterSection title="Price Authority">
                    <div className="space-y-3">
                       <Input 
                          placeholder="€ Min" 
                          type="number" 
                          min="0"
                          value={filters.priceMin}
                          onChange={(e) => {
                             if (e.target.value === '' || Number(e.target.value) >= 0) {
                                handleFilterChange('priceMin', e.target.value);
                             }
                          }}
                          className="bg-[#111C2E] border-white/10 h-10 text-sm"
                       />
                       <Input 
                          placeholder="€ Max" 
                          type="number"
                          min="0"
                          value={filters.priceMax}
                          onChange={(e) => {
                             if (e.target.value === '' || Number(e.target.value) >= 0) {
                                handleFilterChange('priceMax', e.target.value);
                             }
                          }}
                          className="bg-[#111C2E] border-white/10 h-10 text-sm"
                       />
                    </div>
                 </FilterSection>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-white/5 gap-4">
                 <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
                       {isLoading ? 'Loading...' : `${data?.total || cards.length} Verified Listings Available`}
                    </p>
                 </div>
                 
                 {/* Sort Dropdown */}
                 <div className="relative group min-w-[200px]" ref={sortRef}>
                    <button
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className={`w-full flex items-center justify-between bg-[#111C2E] border rounded-lg h-12 px-4 text-sm text-white focus:outline-none transition-colors font-medium ${isSortOpen ? 'border-[#D4A017]' : 'border-white/10 hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs font-bold uppercase tracking-wide">Order By:</span>
                        <span>{currentSortLabel}</span>
                      </div>
                      <svg className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isSortOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#111C2E] border border-white/10 rounded-lg shadow-xl overflow-hidden z-20">
                        {sortOptions.map((option, index) => (
                           <button
                             key={option.value}
                             onClick={() => {
                               setSortBy(option.value)
                               setIsSortOpen(false)
                             }}
                             className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                               sortBy === option.value
                                 ? 'bg-[#D4A017]/10 text-white font-semibold border-l-2 border-[#D4A017]'
                                 : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium border-l-2 border-transparent'
                             } ${index !== sortOptions.length - 1 ? 'border-b border-b-white/5' : ''}`}
                           >
                             {option.label}
                           </button>
                        ))}
                      </div>
                    )}
                 </div>
              </div>

              {/* Grid */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : cards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cards.map(card => (
                    <ProductCard
                      key={card.id}
                      {...card}
                      isLoggedIn={isAuthenticated}
                      onFavoriteClick={() => handleFavoriteClick(card.id)}
                      onCardClick={handleCardClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[#111C2E] rounded-2xl border border-white/5">
                   <p className="text-muted-foreground font-medium">No results found matching your filters.</p>
                   <Button 
                      variant="link" 
                      className="text-[#D4A017] mt-2"
                      onClick={() => {
                        setFilters({ gameSystem: 'All', condition: 'ALL', priceMin: '', priceMax: '' })
                        if (searchQuery) {
                           searchParams.delete('q')
                           setSearchParams(searchParams)
                        }
                      }}
                   >
                      Clear Filters
                   </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Marketplace
