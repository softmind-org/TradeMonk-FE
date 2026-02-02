/**
 * Hero Section Component
 * Displays the main hero banner with stats
 */
import { heroBg, pokemonLogo, yugiohLogo, magicLogo } from '@assets'

const HeroSection = ({ stats }) => {
  const ecosystems = [
    { name: 'Pokémon', icon: pokemonLogo },
    { name: 'Yu-Gi-Oh', icon: yugiohLogo },
    { name: 'Magic: The Gathering', icon: magicLogo },
  ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay with blur */}
      <div
        className="absolute inset-0"
        style={{ 
          backgroundColor: '#1E3A8A1A',
          backdropFilter: 'blur(180px)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-foreground font-semibold mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
          The Marketplace for<br />
          Serious Card Collector
        </h1>
        
        {/* Subtitle */}
        <p className="text-primary text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Buy and sell authentic Trading Card Game singles with confidence. Direct from verified collectors worldwide
        </p>
        
        {/* CTA Button */}
        <button className="bg-secondary text-background font-medium rounded-lg transition-all hover:opacity-90 py-2 px-12 text-base">
          Browse Cards
        </button>
        
        {/* Secure Payment Badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-foreground">
          <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-sm">secure payments via stripe</span>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 mt-10 opacity-30">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{stats?.listings || '50k+'}</div>
            <div className="text-xs uppercase tracking-wider text-foreground">Listings</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{stats?.sellers || '12k+'}</div>
            <div className="text-xs uppercase tracking-wider text-foreground">Sellers</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{stats?.volume || '$4.2M'}</div>
            <div className="text-xs uppercase tracking-wider text-foreground">Volume</div>
          </div>
        </div>
      </div>
      
      {/* Verified Ecosystems */}
      <div className="relative z-10 mt-16 text-center">
        <span className="text-xs uppercase tracking-widest text-foreground opacity-30 mb-8 block">
          Verified Ecosystems
        </span>
        
        {/* Ecosystem Cards */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          {ecosystems.map((ecosystem) => (
            <a
              key={ecosystem.name}
              href={`/${ecosystem.name.toLowerCase().replace(/[:\s]/g, '-')}`}
              className="bg-card border border-border rounded-xl px-6 py-4 flex items-center gap-3 hover:border-secondary transition-colors min-w-40"
            >
              <img 
                src={ecosystem.icon} 
                alt={ecosystem.name}
                className="w-6 h-6 object-contain"
              />
              <span className="text-foreground text-sm font-medium">{ecosystem.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
