import { useState, useRef, useEffect } from 'react'
import { Search, Bell, Menu, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/context'
import { useLogout } from '@/hooks/useLogout'
import { Link } from 'react-router-dom'

const SellerHeader = ({ onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user } = useAuth()
  const { mutate: logout } = useLogout()

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

  const getUserInitial = () => {
    if (!user) return 'S';
    return (user.fullName || user.email || 'S').charAt(0).toUpperCase();
  }

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
  }

  return (
    <header className="h-20 bg-[#0B1220] border-b border-white/5 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30">
        <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick}
              className="md:hidden text-muted-foreground hover:text-white"
            >
                <Menu size={24} />
            </button>
            
            {/* Search Bar */}
            <div className="hidden md:block relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search rare Pokémon, Yu-Gi-Oh..." 
                  className="w-full bg-[#111C2E] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D4A017] transition-colors"
                />
            </div>
        </div>

        <div className="flex items-center gap-6">
            {/* Balance Badge */}
            <div className="hidden md:flex items-center gap-3 bg-[#111C2E] border border-white/10 rounded-lg px-4 py-2">
                <div className="w-6 h-6 rounded-full bg-[#D4A017]/20 flex items-center justify-center text-[#D4A017] text-xs font-bold">€</div>
                <span className="text-white font-bold text-sm">€12,450.00</span>
            </div>

            {/* Notifications */}
            <button className="relative text-muted-foreground hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D4A017]"></span>
            </button>

            {/* Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-lg bg-[#D4A017] flex items-center justify-center text-black font-bold cursor-pointer hover:opacity-90 transition-opacity"
                >
                    {getUserInitial()}
                </button>

                {isDropdownOpen && (
                    <div 
                      className="absolute top-full right-0 mt-3 w-56 rounded-xl backdrop-blur-md z-50 overflow-hidden shadow-2xl border border-white/5"
                      style={{ backgroundColor: '#1E293BEE' }}
                    >
                        <div className="p-4 border-b border-white/5">
                            <p className="text-[#94A3B8] text-[10px] font-bold tracking-wider uppercase mb-0.5">
                                MERCHANT
                            </p>
                            <p className="text-white font-bold text-sm truncate">
                                {user?.fullName || user?.email}
                            </p>
                        </div>

                        <div className="py-2">
                            <Link 
                              to="/seller/profile" 
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-[#94A3B8] hover:text-white hover:bg-white/5 text-xs font-bold transition-colors"
                            >
                                <User size={16} />
                                Profile Page
                            </Link>
                            <Link 
                              to="/" 
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-[#94A3B8] hover:text-white hover:bg-white/5 text-xs font-bold transition-colors"
                            >
                                <LayoutDashboard size={16} />
                                Buyer Side
                            </Link>
                        </div>

                        <div className="border-t border-white/5 py-2">
                            <button 
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-[#FF5D5D] hover:bg-[#FF5D5D10] text-xs font-bold transition-colors text-left"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </header>
  )
}

export default SellerHeader

