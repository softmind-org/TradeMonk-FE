import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Layers, 
  Package, 
  ShoppingBag, 
  CreditCard,
  Settings, 
  LogOut 
} from 'lucide-react'

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Sellers', icon: Store, path: '/admin/sellers' },
    { name: 'Categories', icon: Layers, path: '/admin/categories' },
    { name: 'Listings', icon: Package, path: '/admin/listings' },
    { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'Payments', icon: CreditCard, path: '/admin/payments' },
    { name: 'Platform Settings', icon: Settings, path: '/admin/settings' },
  ]

  const isActive = (path) => location.pathname === path

  const handleExitAdminMode = () => {
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
        md:relative md:translate-x-0 flex flex-col
      `}>
          {/* Logo & Branding */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-[#D4A017]/30 flex items-center justify-center p-1 relative">
                 <div className="w-full h-full border border-[#D4A017] flex justify-center clip-shield">
                     <span className="text-[#D4A017] font-semibold text-[10px] leading-none translate-y-2">TM</span>
                 </div>
              </div>
              <div>
                <span className="text-[9px] text-[#D4A017] font-bold uppercase tracking-[0.2em] block">Command Center</span>
                <span className="text-white font-extrabold text-sm tracking-wide">Trademonk Admin</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
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
                       : 'text-muted-foreground hover:text-white hover:bg-white/5 font-medium'}
                   `}
                 >
                   <Icon size={18} className={active ? 'text-black' : ''} />
                   <span className="text-sm">{link.name}</span>
                 </Link>
               )
             })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 mb-2 border-t border-white/5">
            <button 
              onClick={handleExitAdminMode}
              className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg w-full transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-bold">Exit Admin Hub</span>
            </button>
          </div>
      </aside>
    </>
  )
}

export default AdminSidebar
