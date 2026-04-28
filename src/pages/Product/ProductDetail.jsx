/**
 * Product Detail Page
 * Displays detailed information about a single product
 */
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import { Button, MarketHistoryChart } from '@components/ui'
import { useProductDetail } from '@/hooks/useProductDetail'
import { useCart } from '@context'
import { pokemonLogo } from '@assets'
import { ShoppingCart, Check, MessageCircle } from 'lucide-react'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [addedToCart, setAddedToCart] = useState(false)
  
  // Fetch product data from API
  const { data: product, isLoading, error } = useProductDetail(id)
  
  if (product) console.log('DEBUG Product Detail:', { title: product.title, front: product.images?.[0], back: product.backImage })
  
  const { addToCart, isInCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  
  // Add to cart handler
  const handleAddToCart = async () => {
    if (product) {
      setIsAdding(true)
      try {
        await addToCart(product, 1)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
      } finally {
        setIsAdding(false)
      }
    }
  }

  // Handle messaging the seller
  const handleMessageSeller = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user) {
      navigate('/login')
      return
    }
    // In this model, the seller ID is stored in seller.userId
    const targetSellerId = product.seller?.userId?._id || product.seller?.userId || product.seller?._id;
    navigate(`/messages?product=${product._id}&seller=${targetSellerId}`)
  }

  /**
   * Helper to format image URLs
   * Prepends the backend server origin to the stored relative path
   */
  const formatImageUrl = (path) => {
    // Known broken URL from previous uploads - swap with stable mirror
    const stablePokemonBack = 'https://upload.wikimedia.org/wikipedia/en/3/3b/Pokemon_Trading_Card_Game_cardback.jpg';
    
    if (path && (path.includes('assets.pokemon.com/assets/cms2/img/cards/web/back.png') || path.includes('limitlesstcg.s3'))) {
      return stablePokemonBack;
    }

    if (!path || path === '') {
      const system = product?.gameSystem;
      if (system === 'Pokémon') return stablePokemonBack;
      if (system?.includes('Yu-Gi-Oh')) return 'https://images.ygoprodeck.com/images/cards/back_high.jpg';
      return pokemonLogo;
    }
    
    // If it's already a full URL, return it
    if (path.startsWith('http')) return path;
    
    // Get server API URL from env
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
    let serverBase = '';
    
    try {
      serverBase = new URL(apiBase).origin;
    } catch (e) {
      serverBase = apiBase.split('/api')[0];
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${serverBase}${cleanPath}`;
  }

  // Loading State
  if (isLoading) {
    return (
      <>
        <div className="bg-background min-h-screen pb-20 pt-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="h-6 w-40 bg-gray-700/50 rounded animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-gray-700/20 rounded-3xl aspect-[3/4] animate-pulse"></div>
                <div className="bg-gray-700/20 rounded-2xl h-40 animate-pulse"></div>
              </div>
              <div className="lg:col-span-7 space-y-6">
                <div className="h-10 w-64 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-40 bg-gray-700/20 rounded-2xl animate-pulse"></div>
                <div className="h-24 bg-gray-700/20 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Error State
  if (error || !product) {
    return (
      <>
        <div className="bg-background min-h-screen pb-20 pt-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center py-20">
            <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/marketplace" className="text-secondary hover:underline font-bold">
              Return to Marketplace
            </Link>
          </div>
        </div>
      </>
    )
  }

  // Build badges from API data
  const badges = []
  if (product.condition) badges.push({ label: product.condition, type: 'condition' })
  if (product.gameSystem) badges.push({ label: product.gameSystem, type: 'game' })
  if (product.badges?.includes('VERIFIED')) badges.push({ label: 'VERIFIED', type: 'verified' })

  // Get badge styles based on type
  const getBadgeStyles = (type) => {
    switch (type) {
      case 'condition':
        return 'bg-[#D4A017]/10 text-[#D4A017] border-[#D4A017]/20'
      case 'game':
        return 'bg-[#1E3A8A]/20 text-[#60A5FA] border-[#1E3A8A]/30'
      case 'verified':
        return 'bg-[#059669]/10 text-[#34D399] border-[#059669]/20'
      default:
        return 'bg-white/5 text-white border-white/10'
    }
  }

  return (
    <>
      <div className="bg-background min-h-screen pb-20 pt-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb / Back Link */}
          <Link 
            to="/marketplace" 
            className="inline-flex items-center text-muted-foreground hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            RETURN TO GALLERY
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Left Column - Image Gallery + Chart */}
            <div className="lg:col-span-5 space-y-6">
              {/* Image */}
              <div className="bg-[#0B1220] rounded-3xl p-8 border border-white/5 relative aspect-[3/4] flex items-center justify-center group [perspective:1000px]">
                <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Image */}
                  <div className="absolute inset-0 [backface-visibility:hidden]">
                    <img 
                      src={formatImageUrl(product.images?.[0])} 
                      alt={product.title}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                  {/* Back Image */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <img 
                      src={formatImageUrl(product.backImage)} 
                      alt={`${product.title} Back`}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
                
                {/* Image Dots - show if multiple images */}
                {product.images?.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-6 h-1.5 bg-[#D4A017] rounded-full"></div>
                    {product.images.slice(1).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                    ))}
                  </div>
                )}
              </div>

              {/* Historical Market Value Chart - Below Image */}
              <MarketHistoryChart 
                data={product.marketHistory || []}
              />
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap gap-3 mb-4">
                  {badges.map((badge, index) => (
                    <span 
                      key={index}
                      className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border flex items-center gap-1 ${getBadgeStyles(badge.type)}`}
                    >
                      {badge.type === 'condition' && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {badge.type === 'game' && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      )}
                      {badge.type === 'verified' && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      )}
                      {badge.label}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{product.title}</h1>
                <p className="text-muted-foreground text-lg uppercase tracking-wide font-medium">
                  {product.collectionName}
                </p>
              </div>

              {/* Price Box */}
              <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Price</div>
                    <div className="text-5xl md:text-6xl font-bold text-white">
                      €{product.price?.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                    <Button 
                       onClick={handleAddToCart}
                       disabled={isAdding || addedToCart}
                       className={`w-full bg-secondary hover:bg-secondary/90 text-black font-bold py-4 text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${isAdding ? 'opacity-80' : ''}`}
                    >
                      {isAdding ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : addedToCart ? (
                        <>
                          <Check size={18} />
                          Added to Vault
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          Add to Vault
                        </>
                      )}
                    </Button>

                    {/* Hide Message button if viewer is the seller */}
                    {product?.seller?._id !== JSON.parse(localStorage.getItem('user') || 'null')?._id && (
                      <Button
                        onClick={handleMessageSeller}
                        className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 text-sm uppercase tracking-wide flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
                      >
                        <MessageCircle size={18} />
                        Message Seller
                      </Button>
                    )}

                    <Button 
                       onClick={() => navigate('/cart')}
                       className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 text-sm uppercase tracking-wider border border-white/10 cursor-pointer"
                    >
                      View Cart
                    </Button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Item Description</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Info Grid (Rarity & Authentication) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Rarity</span>
                  <span className="text-white font-bold text-lg">{product.rarity || 'N/A'}</span>
                </div>
                <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Authentication</span>
                  <div className="flex items-center gap-2">
                    {product.authentication === 'Verified' ? (
                      <>
                        <svg className="w-4 h-4 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[#34D399] font-bold text-lg">VERIFIED</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground font-bold text-lg">{product.authentication || 'Unverified'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {product.seller?.name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{product.seller?.name || 'Unknown Seller'}</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-muted-foreground">{product.seller?.reputation || 'New Seller'}</span>
                      <span className="text-[#D4A017]">• {product.seller?.positiveFeedback || '100%'}</span>
                    </div>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetail
