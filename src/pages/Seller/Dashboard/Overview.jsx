import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  MoreVertical,
  Activity
} from 'lucide-react'

const Overview = () => {
  const stats = [
    { title: 'Total Sales', value: '$12,450.00', icon: DollarSign, change: '+12.5%', trend: 'up' },
    { title: 'Active Listings', value: '8', icon: Package, change: '+2', trend: 'up' },
    { title: 'Pending Orders', value: '3', icon: ShoppingBag, change: 'Requires Action', trend: 'neutral' },
    { title: 'Store Rating', value: '4.9/5', icon: Activity, change: 'Top Rated', trend: 'up' },
  ]

  const recentActivity = [
    { id: 1, action: 'Umbreon VMAX Sold', time: '2h ago', type: 'sale' },
    { id: 2, action: 'New Listing: Black Lotus', time: '5h ago', type: 'listing' },
    { id: 3, action: '$450.00 Sent to Bank', time: '1d ago', type: 'payout' },
  ]

  return (
    <div className="space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Overview</h1>
            <button className="bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
                <Package size={18} />
                Add Listing
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <div key={i} className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            i === 0 ? 'bg-green-500/10 text-green-500' :
                            i === 1 ? 'bg-blue-500/10 text-blue-500' :
                            i === 2 ? 'bg-orange-500/10 text-orange-500' :
                            'bg-purple-500/10 text-purple-500'
                        }`}>
                            <stat.icon size={20} />
                        </div>
                        {stat.trend === 'up' && <TrendingUp size={16} className="text-green-500" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                    <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">{stat.change}</span>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pending Dispatch */}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-white">Pending Dispatch</h2>
                    <button className="text-[#D4A017] text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">View All</button>
                </div>
                
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-[#111C2E] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
                        <div className="w-12 h-16 bg-[#0B1220] rounded-lg flex items-center justify-center border border-white/5">
                            <Package size={20} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm">#OD-1029{i}</h4>
                            <p className="text-xs text-muted-foreground">Ash Ketchum • 1 items</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-bold text-sm">$200.50</p>
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Processing</span>
                        </div>
                        <button className="hidden sm:block px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-colors">
                            Mark as Shipped
                        </button>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-white mb-2">Recent Activity</h2>
                <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 space-y-6">
                    {recentActivity.map((activity, i) => (
                        <div key={activity.id} className="flex gap-4 relative">
                            {/* Connector Line */}
                            {i !== recentActivity.length - 1 && (
                                <div className="absolute top-8 left-[5px] w-0.5 h-full bg-white/5"></div>
                            )}
                            
                            <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                                activity.type === 'sale' ? 'bg-green-500' :
                                activity.type === 'listing' ? 'bg-blue-500' : 'bg-[#D4A017]'
                            }`}></div>
                            
                            <div>
                                <p className="text-sm font-bold text-white">{activity.action}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Overview
