/**
 * Header Component
 * Main navigation header with logo, search, and actions
 */
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useCart } from '@/context'
import { useLogout } from '@/hooks/useLogout'
import { 
  LayoutDashboard, 
  Package, 
  User, 
  Heart, 
  LogOut,
  Store,
  Shield
} from 'lucide-react'
import { formatImageUrl } from '@/utils/imageUtils'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const { user, isAuthenticated } = useAuth()
  const { itemCount } = useCart()
  const { mutate: logout } = useLogout()

  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsMobileMenuOpen(false)
      // Optional: Clear search box after submit, but usually better to leave it so user knows what they searched
    }
  }

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
  }

  // Get user initial for avatar
  const getUserInitial = () => {
    if (!user) return 'U';
    // Use first letter of fullName if available, else email
    const name = user.fullName || user.email || 'U';
    return name.charAt(0).toUpperCase();
  }

  return (
    <header className="bg-card py-3 px-4 lg:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <span className="text-background font-bold text-sm">TM</span>
          </div>
          <span className="text-foreground font-semibold text-lg hidden sm:block">Trademonk</span>
        </Link>

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
          {/* Browse Games / Browse */}
          <Link 
            to="/marketplace" 
            className="hidden lg:block text-foreground text-sm hover:text-secondary transition-colors"
          >
            {isAuthenticated ? 'Browse' : 'Browse Games'}
          </Link>

          {!isAuthenticated && (
            /* Sell Cards Button - Guest Only */
            <Link 
              to="/register"
              className="bg-secondary text-background text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity hidden sm:block"
            >
              Sell Cards
            </Link>
          )}

          {/* Vertical Divider for Auth User */}
          {isAuthenticated && (
             <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>
          )}

          {/* Log In Button (Guest) or Avatar (User) */}
          {!isAuthenticated ? (
            <Link 
              to="/login" 
              className="text-foreground text-sm hover:text-secondary transition-colors hidden sm:block"
            >
              Log In
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D4A01733] text-secondary text-[10px] font-black hover:bg-[#D4A01755] transition-colors overflow-hidden"
              >
                {user?.storeLogo ? (
                   <img src={formatImageUrl(user.storeLogo)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   getUserInitial()
                )}
              </button>

              {/* User Dropdown */}
              {isDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-3 w-64 rounded-xl backdrop-blur-md z-50 overflow-hidden"
                  style={{
                    backgroundColor: '#1E293BCC', // 80% opacity asked by user
                    border: '1px solid #1E293B',
                    boxShadow: '0px 20px 50px 0px #00000080'
                  }}
                >
                  <div className="p-5">
                    <p className="text-[#94A3B8] text-[10px] font-bold tracking-wider uppercase mb-1">
                        {user?.role === 'seller' ? 'MERCHANT' : 'COLLECTOR'}
                    </p>
                    <p className="text-white font-bold text-sm truncate">
                      {user?.fullName || user?.email}
                    </p>
                  </div>

                  <div className="border-t border-white/5 py-2">
                    <Link 
                      to={user?.role === 'seller' ? '/seller/dashboard' : '/'} 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-[#94A3B8] hover:text-white hover:bg-white/5 text-[12px] font-bold transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      {user?.role === 'seller' ? 'Seller Dashboard' : 'Buyer Dashboard'}
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin/dashboard" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-[#D4A017] hover:text-[#D4A017] hover:bg-white/5 text-[12px] font-bold transition-colors"
                      >
                        <Shield size={16} />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[#94A3B8] hover:text-white hover:bg-white/5 text-[12px] font-bold transition-colors">
                      <Package size={16} />
                      My Orders
                    </Link>
                    <Link 
                      to={user?.role === 'seller' ? '/seller/profile' : '/profile'} 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-[#94A3B8] hover:text-white hover:bg-white/5 text-[12px] font-bold transition-colors"
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    {/* <Link to="/favorites" className="flex items-center gap-3 px-5 py-2.5 text-[#94A3B8] hover:text-white hover:bg-white/5 text-[12px] font-bold transition-colors">
                      <Heart size={16} />
                      My Favorites
                    </Link> */}
                  </div>

                  <div className="border-t border-white/5 py-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-[#FF5D5D] hover:bg-[#FF5D5D10] text-[12px] font-bold transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative">
            <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-background text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

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
            <Link to="/browse" className="text-foreground text-sm hover:text-secondary">
              {isAuthenticated ? 'Browse' : 'Browse Games'}
            </Link>
            {!isAuthenticated && (
              <>
                <Link to="/sell" className="text-foreground text-sm hover:text-secondary">Sell Cards</Link>
                <Link to="/login" className="text-foreground text-sm hover:text-secondary">Log In</Link>
              </>
            )}
            {isAuthenticated && (
               <div className="border-t border-border mt-2 pt-2">
                  <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D4A01733] text-secondary text-[10px] font-black overflow-hidden">
                        {user?.storeLogo ? (
                          <img src={formatImageUrl(user.storeLogo)} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          getUserInitial()
                        )}
                      </div>
                      <span className="text-foreground text-sm font-medium">{user?.fullName || user?.email}</span>
                  </div>
                  <button onClick={handleLogout} className="text-[#FF5D5D] text-sm font-medium flex items-center gap-2">
                    <LogOut size={14} /> Sign Out
                  </button>
               </div>
            )}
          
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
