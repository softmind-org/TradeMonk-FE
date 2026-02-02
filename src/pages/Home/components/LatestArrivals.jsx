/**
 * Latest Arrivals Section Component
 * Displays a grid of latest card listings
 */
import { useState } from 'react'
import { ProductCard } from '@components/ui'
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

const LatestArrivals = ({ onCardClick }) => {
  const { isAuthenticated } = useAuth()
  
  // Data matching the user provided images
  const [cards, setCards] = useState([
    {
      id: 1,
      image: charizard,
      backImage: pokemonLogo, // In a real app, this would be the actual card back
      name: 'Charizard VMAX',
      price: 185.50,
      condition: 'MINT',
      edition: 'SHINING FATES',
      badge: 'POWER SELLER',
      topBadge: 'SECRET RARE',
      rating: 4.9,
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
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
      isFavorite: false,
    },
  ])

  const handleFavoriteClick = (id) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
      )
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
          <a 
            href="/marketplace"
            className="text-secondary text-xs font-bold uppercase tracking-widest hover:underline hidden sm:block"
          >
            ENTER MARKETPLACE
          </a>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <ProductCard
              key={card.id}
              {...card}
              isLoggedIn={isAuthenticated}
              // isFavorite matches the state managed here
              onFavoriteClick={() => handleFavoriteClick(card.id)}
              onCardClick={onCardClick}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <a 
            href="/marketplace"
            className="text-secondary text-xs font-bold uppercase tracking-widest hover:underline"
          >
            ENTER MARKETPLACE
          </a>
        </div>
      </div>
    </section>
  )
}

export default LatestArrivals
