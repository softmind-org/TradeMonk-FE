import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  MoreVertical,
  Activity,
  Loader2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import orderService from '@/services/orderService'
import userService from '@/services/userService'
import toast from 'react-hot-toast'
import { pokemonLogo } from '@assets'

const Overview = () => {
  const navigate = useNavigate()
  const [pendingOrders, setPendingOrders] = useState([])
  const [statsData, setStatsData] = useState(null)
  const [activityData, setActivityData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      // 1. Fetch pending dispatch orders (Used for the list below)
      const ordersResponse = await orderService.getSellerOrders('confirmed')
      if (ordersResponse?.data) {
        setPendingOrders(ordersResponse.data.slice(0, 5))
      }

      // 2. Fetch general stats and activity
      const statsResponse = await userService.getMyStats()
      console.log('Dashboard Stats Response:', statsResponse)
      if (statsResponse?.data) {
        setStatsData(statsResponse.data)
        setActivityData(statsResponse.data.recentActivity || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      const errorMsg = error.response?.data?.message || 'Could not load dashboard statistics'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, { status: newStatus })
      if (response.success) {
        toast.success(`Order marked as ${newStatus}`)
        fetchDashboardData() // Refresh everything
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error(error?.response?.data?.message || 'Failed to update order status')
    }
  }

  const formatImageUrl = (path) => {
    if (!path || path === '') return pokemonLogo
    if (path.startsWith('http')) return path
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
    let serverBase = ''
    try { serverBase = new URL(apiBase).origin }
    catch { serverBase = apiBase.split('/api')[0] }
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${serverBase}${cleanPath}`
  }

  const stats = [
    { 
      title: 'Total Sales', 
      value: `€${statsData?.totalSalesNet?.toFixed(2) || '0.00'}`, 
      icon: DollarSign, 
      change: 'Lifetime Net', 
      trend: (statsData?.totalSalesNet > 0 ? 'up' : 'neutral') 
    },
    { 
      title: 'Active Listings', 
      value: statsData?.activeListings?.toString() || '0', 
      icon: Package, 
      change: 'In Store', 
      trend: (statsData?.activeListings > 0 ? 'up' : 'neutral') 
    },
    { 
      title: 'Pending Orders', 
      value: pendingOrders.length.toString(), 
      icon: ShoppingBag, 
      change: 'Requires Action', 
      trend: (pendingOrders.length > 0 ? 'down' : 'neutral') 
    },
    { 
      title: 'Store Rating', 
      value: `${statsData?.storeRating || '5.0'}/5`, 
      icon: Activity, 
      change: 'Top Rated', 
      trend: 'up' 
    },
  ]

  const formatActivityTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className="space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Overview</h1>
            <button 
                onClick={() => navigate('/seller/listings/add')}
                className="bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
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
                    <button onClick={() => navigate('/seller/orders')} className="text-[#D4A017] text-xs font-bold uppercase tracking-wider hover:text-white transition-colors cursor-pointer">View All</button>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#D4A017] animate-spin" />
                  </div>
                ) : pendingOrders.length === 0 ? (
                  <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-8 text-center text-sm text-muted-foreground">
                    All caught up! No orders pending dispatch.
                  </div>
                ) : (
                  pendingOrders.map(order => (
                      <div key={order._id} className="bg-[#111C2E] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-white/10 transition-colors">
                          <div className="w-12 h-16 bg-[#0B1220] rounded-lg flex items-center justify-center border border-white/5 overflow-hidden">
                              <img 
                                src={formatImageUrl(order.items?.[0]?.image)} 
                                alt="Item" 
                                className="w-full h-full object-contain"
                                onError={(e) => { e.target.src = pokemonLogo }}
                              />
                          </div>
                          <div className="flex-1 min-w-0">
                              <h4 className="text-white font-bold text-sm">#{order.orderNumber || order._id.slice(-6)}</h4>
                              <p className="text-xs text-muted-foreground">{order.shippingAddress?.fullName || 'Buyer'} • {order.items?.length || 0} items</p>
                          </div>
                          <div className="text-left sm:text-right mt-2 sm:mt-0 w-full sm:w-auto flex sm:block justify-between items-center sm:space-y-1">
                              <p className="text-[#D4A017] font-bold text-sm">€{order.feeBreakdown?.sellerNet?.toFixed(2) || '0.00'}</p>
                              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider bg-orange-400/10 px-2 py-0.5 rounded">Confirmed</span>
                          </div>
                          <button 
                             onClick={() => handleUpdateStatus(order._id, 'shipped')}
                             className="w-full sm:w-auto mt-3 sm:mt-0 px-4 py-2 bg-[#D4A017] hover:bg-[#D4A017]/90 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                              Mark as Shipped
                          </button>
                      </div>
                  ))
                )}
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-white mb-2">Recent Activity</h2>
                <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 space-y-6">
                    {activityData.length === 0 ? (
                      <div className="text-center py-4 text-xs text-muted-foreground">No recent activity</div>
                    ) : (
                      activityData.map((activity, i) => (
                        <div key={activity.id} className="flex gap-4 relative">
                            {/* Connector Line */}
                            {i !== activityData.length - 1 && (
                                <div className="absolute top-8 left-[5px] w-0.5 h-full bg-white/5"></div>
                            )}
                            
                            <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                                activity.type === 'sale' ? 'bg-green-500' :
                                activity.type === 'listing' ? 'bg-blue-500' : 'bg-[#D4A017]'
                            }`}></div>
                            
                            <div>
                                <p className="text-sm font-bold text-white">{activity.action}</p>
                                <p className="text-xs text-muted-foreground">{formatActivityTime(activity.time)}</p>
                            </div>
                        </div>
                      ))
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Overview
