import { Users, Store, Package, ShoppingBag, TrendingUp, Zap, ChevronRight, BarChart3, ShieldCheck, Mail, AlertTriangle } from 'lucide-react'
import { Button } from '@components/ui'

const AdminOverview = () => {
  const kpis = [
    { name: 'TOTAL USERS', value: '1,240', icon: Users, iconColor: 'text-blue-400', bg: 'bg-[#111C2E]' },
    { name: 'ACTIVE SELLERS', value: '142', icon: Store, iconColor: 'text-purple-400', bg: 'bg-[#111C2E]' },
    { name: 'LIVE LISTINGS', value: '4,208', icon: Package, iconColor: 'text-emerald-400', bg: 'bg-[#111C2E]' },
    { name: 'DAILY ORDERS', value: '28', icon: ShoppingBag, iconColor: 'text-[#D4A017]', bg: 'bg-[#111C2E]' },
    { name: 'MARKET VOLUME', value: '$840k', icon: TrendingUp, iconColor: 'text-orange-400', bg: 'bg-[#111C2E]' },
  ]

  const activityFeed = [
    { id: 1, title: 'New seller "PokePawn" registered', time: '12M AGO', icon: Store, type: 'info' },
    { id: 2, title: 'New listing: Holo Charizard added', time: '28M AGO', icon: Package, type: 'info' },
    { id: 3, title: 'Order #TM-99201 completed by Ash K.', time: '45M AGO', icon: ShieldCheck, type: 'success' },
    { id: 4, title: 'User Gary O. suspended for suspicious bidding', time: '2H AGO', icon: AlertTriangle, type: 'warning' },
  ]

  return (
    <div className="space-y-6">
       {/* KPI Grid */}
       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon
            return (
              <div key={idx} className={`${kpi.bg} border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-[120px]`}>
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon size={16} className={kpi.iconColor} />
                 </div>
                 <div className="mt-4">
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">{kpi.name}</p>
                    <p className="text-2xl font-black text-white">{kpi.value}</p>
                 </div>
              </div>
            )
          })}
       </div>

       {/* Detailed Layout */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Marketplace Activity Feed */}
          <div className="lg:col-span-2 bg-[#111C2E] rounded-2xl border border-white/5 p-6">
             <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                    <Zap size={18} className="text-[#D4A017]" />
                    <h2 className="text-white font-bold text-lg">Marketplace Activity Feed</h2>
                 </div>
                 <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Real-Time Update</span>
             </div>

             <div className="space-y-3">
                {activityFeed.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="bg-[#0B1220] border border-white/5 rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:border-white/10 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[#111C2E] flex items-center justify-center border border-white/5">
                             <Icon size={18} className="text-muted-foreground" />
                          </div>
                          <div>
                             <p className="text-white text-sm font-bold">{activity.title}</p>
                             <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">{activity.time}</p>
                          </div>
                       </div>
                       <ChevronRight size={16} className="text-muted-foreground group-hover:text-white transition-colors" />
                    </div>
                  )
                })}
             </div>
          </div>

          {/* Platform Integrity Card */}
          <div className="bg-[#111C2E] rounded-2xl border border-white/5 p-6 flex flex-col justify-between">
             <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-emerald-400" />
                    <h2 className="text-white font-bold text-lg">Platform Integrity</h2>
                 </div>
                 <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Q1 Insights</span>
             </div>

             <div className="space-y-6">
                 {/* Progress Bar */}
                 <div>
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">GMV Milestone ($2M)</span>
                       <span className="text-white text-xs font-bold">42%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-[#D4A017] w-[42%] rounded-full"></div>
                    </div>
                 </div>

                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                       <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-1">Dispute Rate</p>
                       <p className="text-emerald-400 font-black text-lg">0.42%</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-1">SLA Adherence</p>
                       <p className="text-blue-400 font-black text-lg">99.8%</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-1">KYC Pipeline</p>
                       <p className="text-white font-black text-lg">12 Pending</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-1">Avg Ticket</p>
                       <p className="text-white font-black text-lg">$248.50</p>
                    </div>
                 </div>
             </div>

             <Button className="w-full mt-8 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest py-3">
                 Detailed Analytics Report
             </Button>
          </div>

       </div>
    </div>
  )
}

export default AdminOverview
