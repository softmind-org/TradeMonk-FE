import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react'
// import { useAuth } from '@context' // No longer needed for logout
import { useLogout } from '@/hooks/useLogout' // Import the hook

const SellerSidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  // const { logout } = useAuth()
  const { mutate: logout } = useLogout() // Use the mutation

  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/seller/dashboard' },
    { name: 'My Listings', icon: Package, path: '/seller/listings' },
    { name: 'Sales Orders', icon: ShoppingBag, path: '/seller/orders' },
    { name: 'Payouts', icon: BarChart3, path: '/seller/payouts' },
    { name: 'Store Settings', icon: Settings, path: '/seller/settings' },
  ]

  const isActive = (path) => location.pathname === path

  const handleExitSellerMode = () => {
    navigate('/')
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-[#0B1220] border-r border-white/5 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4A017] rounded-lg flex items-center justify-center">
                <span className="text-black font-extrabold text-xl">TM</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Merchant Hub</span>
                <span className="text-white font-bold text-lg">Trademonk</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-8 px-4 space-y-2">
             {links.map((link) => {
               const Icon = link.icon
               const active = isActive(link.path)
               
               return (
                 <Link
                   key={link.path}
                   to={link.path}
                   onClick={() => onClose && onClose()}
                   className={`
                     flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                     ${active 
                       ? 'bg-[#D4A017] text-black font-bold shadow-[0_0_15px_rgba(212,160,23,0.3)]' 
                       : 'text-muted-foreground hover:text-white hover:bg-white/5'}
                   `}
                 >
                   <Icon size={20} className={active ? 'text-black' : ''} />
                   <span className="text-sm">{link.name}</span>
                 </Link>
               )
             })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 mb-2 border-t border-white/5">
            <button 
              onClick={handleExitSellerMode}
              className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg w-full transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm font-bold">Exit Seller Mode</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default SellerSidebar
