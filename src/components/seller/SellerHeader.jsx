import { Search, Bell, Menu } from 'lucide-react'

const SellerHeader = ({ onMenuClick }) => {
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

            {/* Avatar */}
            <div className="w-10 h-10 rounded-lg bg-[#D4A017] flex items-center justify-center text-black font-bold cursor-pointer hover:opacity-90 transition-opacity">
                J
            </div>
        </div>
    </header>
  )
}

export default SellerHeader
