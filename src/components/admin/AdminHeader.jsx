import { Bell, Menu, CheckCircle2 } from 'lucide-react'

const AdminHeader = ({ title = 'Overview', onMenuClick }) => {
  return (
    <header className="h-20 bg-[#0B1220] border-b border-white/5 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30">
        <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick}
              className="md:hidden text-muted-foreground hover:text-white"
            >
                <Menu size={24} />
            </button>
            
            {/* Page Title */}
            <h1 className="text-xl font-extrabold text-white tracking-wide">
                {title}
            </h1>
        </div>

        <div className="flex items-center gap-6">
            {/* System Status Badge */}
            <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">System Online</span>
            </div>

            {/* Notifications */}
            <button className="relative text-muted-foreground hover:text-white transition-colors">
                <Bell size={20} />
            </button>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-lg bg-[#1E293B] border border-white/10 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-[#2A3B52] transition-colors text-sm">
                AD
            </div>
        </div>
    </header>
  )
}

export default AdminHeader
