/**
 * Marketplace Page
 * Features sidebar filters, sorting, and product grid
 */
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@layouts'
import { Button, ProductCard, Input } from '@components/ui'
import { useAuth } from '@context'
import { 
  charizard, 
  blueEyes, 
  blackLotus, 
  darkMagicianGirl,
  gengar,
  umbreon,
  exodia,
  pokemonLogo 
} from '@assets'

const Marketplace = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  // -- State --
  const [filters, setFilters] = useState({
    gameSystem: 'All', // 'All', 'Pokémon', 'Yu-Gi-Oh', 'Magic: The Gathering'
    condition: 'ALL', // 'ALL', 'MINT', 'NM', 'LP', 'MP', 'HP', 'DMG'
    priceMin: '',
    priceMax: ''
  })
  
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'price-low', 'price-high'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // -- Mock Data --
  // Using the same data as LatestArrivals + some extras for testing
  const initialCards = [
    {
      id: 1,
      image: charizard,
      backImage: pokemonLogo,
      name: 'Charizard VMAX',
      price: 185.50,
      condition: 'MINT',
      edition: 'SHINING FATES',
      badge: 'POWER SELLER',
      topBadge: 'SECRET RARE',
      rating: 4.9,
      game: 'Pokémon',
      dateAdded: '2024-01-15'
    },
    {
      id: 2,
      image: blueEyes,
      backImage: pokemonLogo,
      name: 'Blue-Eyes White Dragon',
      price: 4500.00,
      condition: 'NM',
      edition: 'LEGEND OF BLUE...',
      badge: 'FAST SHIPPING',
      topBadge: 'ULTRA RARE',
      rating: 4.9,
      game: 'Yu-Gi-Oh',
      dateAdded: '2024-01-14'
    },
    {
      id: 3,
      image: blackLotus,
      backImage: pokemonLogo,
      name: 'Black Lotus',
      price: 250000.00,
      condition: 'NM',
      edition: 'LIMITED EDITION...',
      badge: 'TOP RATED',
      topBadge: 'RARE',
      rating: 4.9,
      game: 'Magic: The Gathering',
      dateAdded: '2024-01-10'
    },
    {
      id: 4,
      image: umbreon,
      backImage: pokemonLogo,
      name: 'Umbreon VMAX',
      price: 620.00,
      condition: 'MINT',
      edition: 'EVOLVING SKIES',
      badge: 'FAST SHIPPING',
      topBadge: 'SECRET RARE',
      rating: 4.9,
      game: 'Pokémon',
      dateAdded: '2024-01-12'
    },
    {
      id: 5,
      image: darkMagicianGirl,
      backImage: pokemonLogo,
      name: 'Dark Magician Girl',
      price: 320.00,
      condition: 'LP',
      edition: "MAGICIAN'S FOR...",
      badge: 'POWER SELLER',
      topBadge: 'SECRET RARE',
      rating: 4.9,
      game: 'Yu-Gi-Oh',
      dateAdded: '2024-01-13'
    },
    {
      id: 6,
      image: blackLotus,
      backImage: pokemonLogo,
      name: 'Mox Diamond',
      price: 780.00,
      condition: 'NM',
      edition: 'STRONGHOLD',
      badge: 'TOP RATED',
      topBadge: 'RARE',
      rating: 4.9,
      game: 'Magic: The Gathering',
      dateAdded: '2024-01-11'
    },
    {
      id: 7,
      image: gengar,
      backImage: pokemonLogo,
      name: 'Gengar VMAX',
      price: 245.00,
      condition: 'MINT',
      edition: 'FUSION STRIKE',
      badge: 'FAST SHIPPING',
      topBadge: 'SECRET RARE',
      rating: 4.9,
      game: 'Pokémon',
      dateAdded: '2024-01-09'
    },
    {
      id: 8,
      image: exodia,
      backImage: pokemonLogo,
      name: 'Exodia the Forbidden One',
      price: 1500.00,
      condition: 'NM',
      edition: 'LEGEND OF BLUE...',
      badge: 'POWER SELLER',
      topBadge: 'ULTRA RARE',
      rating: 4.9,
      game: 'Yu-Gi-Oh',
      dateAdded: '2024-01-08'
    },
  ]

  // -- Filtering & Sorting Logic --
  const filteredCards = useMemo(() => {
    let result = [...initialCards]

    // Filter by Game
    if (filters.gameSystem !== 'All') {
      result = result.filter(card => card.game === filters.gameSystem)
    }

    // Filter by Condition
    if (filters.condition !== 'ALL') {
      result = result.filter(card => card.condition === filters.condition)
    }

    // Filter by Price
    if (filters.priceMin !== '') {
      result = result.filter(card => card.price >= Number(filters.priceMin))
    }
    if (filters.priceMax !== '') {
      result = result.filter(card => card.price <= Number(filters.priceMax))
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded) // Descending date
      }
    })

    return result
  }, [filters, sortBy])

  // Console log data as requested
  useEffect(() => {
    console.log('🛒 Marketplace State Update:', {
      filters,
      sortBy,
      resultsCount: filteredCards.length,
      data: filteredCards
    })
  }, [filters, sortBy, filteredCards])


  // -- Handlers --
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleCardClick = (id) => {
    navigate(`/product/${id}`)
  }
  
  // -- Subcomponents (internal for now) --
  
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

  return (
    <MainLayout>
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
                   {['All', 'Pokémon', 'Yu-Gi-Oh', 'Magic: The Gathering'].map(game => (
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
                          placeholder="$ Min" 
                          type="number" 
                          value={filters.priceMin}
                          onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                          className="bg-[#111C2E] border-white/10 h-10 text-sm"
                       />
                       <Input 
                          placeholder="$ Max" 
                          type="number"
                          value={filters.priceMax}
                          onChange={(e) => handleFilterChange('priceMax', e.target.value)}
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
                       {filteredCards.length} Verified Listings Available
                    </p>
                 </div>
                 
                 {/* Sort Dropdown */}
                 <div className="relative group min-w-[200px]">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground text-xs font-bold uppercase tracking-wide z-10">
                       Order By:
                    </div>
                    <select
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value)}
                       className="w-full bg-[#111C2E] border border-white/10 rounded-lg h-12 pl-24 pr-10 text-sm text-white focus:outline-none focus:border-[#D4A017] appearance-none cursor-pointer font-medium"
                    >
                       <option value="newest">Newest</option>
                       <option value="price-low">Price: Low</option>
                       <option value="price-high">Price: High</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                 </div>
              </div>

              {/* Grid */}
              {filteredCards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCards.map(card => (
                    <ProductCard
                      key={card.id}
                      {...card}
                      isLoggedIn={isAuthenticated}
                      // Using local state for favorites not strictly required for this demo but good for UI
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
                      onClick={() => setFilters({ gameSystem: 'All', condition: 'ALL', priceMin: '', priceMax: '' })}
                   >
                      Clear Filters
                   </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Marketplace
