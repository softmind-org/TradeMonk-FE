/**
 * Header Component
 * Main navigation header with logo, search, and actions
 */
import { useState } from 'react'

const Header = ({ cartCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    // Will be connected to search functionality
    console.log('Search:', searchQuery)
  }

  return (
    <header className="bg-card py-3 px-4 lg:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <span className="text-background font-bold text-sm">TM</span>
          </div>
          <span className="text-foreground font-semibold text-lg hidden sm:block">Trademonk</span>
        </a>

        {/* Search Bar - Hidden on mobile */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl"
        >
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rare pokemon, Yu-Gi-Oh..."
              className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
            />
          </div>
        </form>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Browse Games - Hidden on mobile */}
          <a 
            href="/browse" 
            className="hidden lg:block text-foreground text-sm hover:text-secondary transition-colors"
          >
            Browse Games
          </a>

          {/* Sell Cards Button */}
          <a 
            href="/sell"
            className="bg-secondary text-background text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity hidden sm:block"
          >
            Sell Cards
          </a>

          {/* Log In */}
          <a 
            href="/login" 
            className="text-foreground text-sm hover:text-secondary transition-colors hidden sm:block"
          >
            Log In
          </a>

          {/* Cart */}
          <a href="/cart" className="relative">
            <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-background text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-foreground"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rare pokemon, Yu-Gi-Oh..."
                className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          </form>

          {/* Mobile Links */}
          <div className="flex flex-col gap-3">
            <a href="/browse" className="text-foreground text-sm hover:text-secondary">Browse Games</a>
            <a href="/sell" className="text-foreground text-sm hover:text-secondary">Sell Cards</a>
            <a href="/login" className="text-foreground text-sm hover:text-secondary">Log In</a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
