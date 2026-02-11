/**
 * Order History Page
 * Displays a list of past orders with tracking status
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@components/ui'
import { ArrowRight, Package, MapPin, CheckCircle, Clock, Search } from 'lucide-react'
import { pokemonLogo } from '@assets'

const OrderHistory = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('tradeMonk_orders') || '[]')
    setOrders(savedOrders)
    setLoading(false)
  }, [])

  // Format image URL helper (reused)
  const formatImageUrl = (path) => {
    if (!path || path === '') return pokemonLogo
    if (path.startsWith('http')) return path
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
    let serverBase = ''
    try { 
        serverBase = new URL(apiBase).origin 
    } catch (e) { 
        serverBase = apiBase.split('/api')[0] 
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${serverBase}${cleanPath}`
  }

  if (loading) {
    return (
      <>
         <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full"></div>
         </div>
      </>
    )
  }

  return (
    <>
      <div className="bg-background min-h-screen py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Order History</h1>
              <p className="text-muted-foreground text-sm uppercase tracking-wider font-bold">
                Tracking {orders.length} Secured Acquisitions
              </p>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Search mock */}
               <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search Order ID..." 
                    className="bg-[#0B1220] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-secondary"
                  />
               </div>
               <button 
                 onClick={() => navigate('/marketplace')}
                 className="text-[#D4A017] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:text-white transition-colors"
               >
                 New Acquisition <ArrowRight size={14} />
               </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-[#111C2E] rounded-3xl border border-white/5">
                <Package size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">No Acquisitions Yet</h3>
                <p className="text-muted-foreground mb-6">Start your collection today.</p>
                <Button onClick={() => navigate('/marketplace')}>Browse Marketplace</Button>
              </div>
            ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors">
                    
                    {/* Top Row: Info & Actions */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 border-b border-white/5 pb-8">
                      <div className="flex flex-wrap gap-8 md:gap-16">
                         <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                              Order Identifier
                            </span>
                            <span className="text-white font-bold text-lg">
                              #{order.id.replace('TM-', 'TM-')}
                            </span>
                         </div>
                         <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                              Date Secured
                            </span>
                            <span className="text-white font-bold text-lg">
                              {order.date}
                            </span>
                         </div>
                         <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                              Total Value
                            </span>
                            <span className="text-[#D4A017] font-bold text-lg">
                              ${order.total}
                            </span>
                         </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 rounded-full bg-[#1E3A8A]/30 border border-[#1E3A8A] flex items-center gap-2">
                           <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                           <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                             {order.status}
                           </span>
                        </div>
                        <button className="text-muted-foreground hover:text-white transition-colors">
                           <ArrowRight size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Items & Progress */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                       
                       {/* Items Thumbnails */}
                       <div>
                          <div className="flex gap-4 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                             {order.items.map((item, idx) => (
                                <div key={idx} className="relative w-16 h-24 bg-[#0B1220] rounded-lg border border-white/10 overflow-hidden flex-shrink-0 group">
                                   <img 
                                     src={formatImageUrl(item.image)} 
                                     alt={item.title} 
                                     className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                   />
                                   <div className="absolute bottom-0 right-0 bg-[#D4A017] text-background text-[8px] font-bold px-1.5 py-0.5 rounded-tl-md">
                                     x{item.quantity}
                                   </div>
                                </div>
                             ))}
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">
                            {order.items.reduce((acc, item) => acc + item.quantity, 0)} rare pieces in this acquisition
                          </p>
                       </div>

                       {/* Progress Tracker */}
                       <div className="relative pt-4">
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2"></div>
                          {/* Active Progress Bar */}
                          <div 
                            className="absolute top-1/2 left-0 h-0.5 bg-[#D4A017] -translate-y-1/2 transition-all duration-1000"
                            style={{ width: `${order.progress}%` }}
                          ></div>

                          <div className="relative flex justify-between">
                             {/* Step 1: Grading (Active) */}
                             <div className="flex flex-col items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-[#D4A017] border-4 border-[#111C2E] shadow-[0_0_0_2px_#D4A017] z-10"></div>
                                <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-wider">Grading</span>
                             </div>

                             {/* Step 2: Shipped */}
                             <div className="flex flex-col items-center gap-2 opacity-50">
                                <div className="w-4 h-4 rounded-full bg-[#111C2E] border-2 border-white/20 z-10"></div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Shipped</span>
                             </div>

                             {/* Step 3: Delivered */}
                             <div className="flex flex-col items-center gap-2 opacity-50">
                                <div className="w-4 h-4 rounded-full bg-[#111C2E] border-2 border-white/20 z-10"></div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Delivered</span>
                             </div>
                          </div>
                       </div>

                    </div>

                  </div>
                ))
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default OrderHistory
