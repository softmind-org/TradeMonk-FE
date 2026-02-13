/**
 * Product Card Component
 * Reusable card for displaying trading cards
 */
import { cn } from '@utils'
import { pokemonLogo } from '@assets' // Using a placeholder for back image

const ProductCard = ({
  // Card data
  id,
  image,
  backImage = pokemonLogo, // Default back image if not provided
  name,
  price,
  condition, // NM, LP, MP, HP, DMG
  edition,
  rating,
  badge, // FAST SHIPPING, POWER SELLER, TOP RATED
  badgeType = 'default',
  topBadge, // RARE, SECRET RARE, ULTRA RARE
  
  // User state
  isLoggedIn = false,
  isFavorite = false,
  
  // Callbacks
  onFavoriteClick,
  onCardClick,
}) => {
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IE', { // Ireland/EU format
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price)
  }

  // Bottom Badge styles
  const getBottomBadgeStyles = (label) => {
    const baseStyles = 'text-[9px] font-semibold px-[6px] py-[2px] rounded bg-[#0B1220] uppercase tracking-wider'
    
    switch (label?.toUpperCase()) {
      case 'FAST SHIPPING':
        return `${baseStyles} text-[#228B22]` // Green
      case 'POWER SELLER':
        return `${baseStyles} text-secondary` // Gold
      case 'TOP RATED':
        return `${baseStyles} text-[#00D5FF]` // Cyan
      default:
        return `${baseStyles} text-muted-foreground`
    }
  }

  // Handle favorite clickers
  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    if (onFavoriteClick) {
      onFavoriteClick(id)
    }
  }

  return (
    <div 
      className="group cursor-pointer rounded-xl overflow-hidden border border-[#1E293B66] hover:border-[#D4A01780] transition-colors duration-300 bg-card"
      onClick={onCardClick ? () => onCardClick(id) : undefined}
    >
      {/* Image Container with Hover Effect */}
      <div className="relative aspect-[3/4] bg-[#0B1220] overflow-hidden">
        {/* Front Image */}
        <img 
          src={image} 
          alt={name}
          className="absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
        />
        
        {/* Back Image (shown on hover) */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0B1220] opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
           {/* Using the backImage prop, fallback to a placeholder style if it's a logo to make it look decent */}
           <img 
            src={backImage} 
            alt="Card Back"
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Favorite Button - Only shown when logged in */}
        {isLoggedIn && (
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-3 left-3 w-8 h-8 rounded-md flex items-center justify-center transition-all backdrop-blur-[12px] z-10",
              isFavorite 
                ? "bg-secondary" // Active: Primary Color
                : "bg-[#0F172A80] hover:bg-[#0F172A]" // Normal: Dark + Blur
            )}
          >
            <svg 
              className={cn(
                "w-4 h-4 transition-colors",
                isFavorite ? "text-black fill-current" : "text-white"
              )}
              viewBox="0 0 24 24" 
              fill={isFavorite ? "currentColor" : "none"} // Conditional fill
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
        
        {/* Top Right Badge (Rarity) */}
        {topBadge && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[#0B122099] text-[10px] font-semibold text-white uppercase tracking-wider backdrop-blur-sm z-10">
            {topBadge}
          </div>
        )}
      </div>
      
      {/* Info Container */}
      <div className="bg-card px-4 pb-4 pt-3">
        {/* Price & Bottom Badge Row */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-xl font-bold">
            {formatPrice(price)}
          </span>
          {badge && (
            <span className={getBottomBadgeStyles(badge)}>
              {badge}
            </span>
          )}
        </div>
        
        {/* Card Name */}
        <h3 className="text-white text-sm font-medium mb-3 truncate pb-3 border-b border-[#FFFFFF0D]">
          {name}
        </h3>
        
        {/* Footer Info: Condition/Edition & Rating */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider font-semibold">
            <span className="text-gray-400">{condition}</span>
            {edition && (
              <>
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="truncate max-w-[120px]">{edition}</span>
              </>
            )}
          </div>
          
          {/* Rating - Only shown when logged in */}
          {isLoggedIn && rating && (
            <div className="flex items-center gap-1 text-[#D4A017]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-bold">{rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
