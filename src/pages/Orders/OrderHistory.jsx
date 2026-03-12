/**
 * Order History Page
 * Displays a list of past orders with tracking status
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@components/ui'
import { ArrowRight, Package, Download, Loader2 } from 'lucide-react'
import { pokemonLogo } from '@assets'
import orderService from '@/services/orderService'

// ── Helpers ──────────────────────────────────────────────────────────

/** Map backend orderStatus to display config */
const STATUS_MAP = {
  grading:   { label: 'Grading',    color: 'blue',   step: 1 },
  shipped:   { label: 'Shipped',    color: 'yellow', step: 2 },
  delivered: { label: 'Delivered',  color: 'green',  step: 3 },
}

const getStatusConfig = (status) => STATUS_MAP[status] || STATUS_MAP.grading

/** Progress % based on step */
const getProgress = (step) => {
  if (step === 1) return 15
  if (step === 2) return 55
  return 100
}

/** Resolve image path to full URL */
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

// ── Sub-components ───────────────────────────────────────────────────

/** Single order card */
const OrderCard = ({ order }) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const statusConfig = getStatusConfig(order.orderStatus)
  const progress = getProgress(statusConfig.step)

  const statusColors = {
    blue:   { bg: 'bg-[#1E3A8A]/30', border: 'border-[#1E3A8A]', text: 'text-blue-400', dot: 'bg-blue-500', ping: 'bg-blue-400' },
    yellow: { bg: 'bg-[#78350F]/30', border: 'border-[#D4A017]', text: 'text-[#D4A017]', dot: 'bg-[#D4A017]', ping: 'bg-[#D4A017]' },
    green:  { bg: 'bg-[#064E3B]/30', border: 'border-[#059669]', text: 'text-emerald-400', dot: 'bg-emerald-500', ping: 'bg-emerald-400' },
  }
  const sc = statusColors[statusConfig.color] || statusColors.blue

  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0)

  const handleDownloadInvoice = async () => {
    try {
      setIsDownloading(true)
      const blob = await orderService.downloadInvoice(order._id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice_${order.orderNumber || order._id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download invoice:', error)
      // Assuming toast exists, wait, we don't have toast imported here. Let's import it if we want.
      // But we can just fail silently or alert.
      alert('Failed to download invoice')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors">

      {/* Top Row: Info & Status */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 border-b border-white/5 pb-8">
        <div className="flex flex-wrap gap-8 md:gap-16">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
              Order Identifier
            </span>
            <span className="text-white font-bold text-lg">
              #{order.orderNumber}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
              Date Secured
            </span>
            <span className="text-white font-bold text-lg">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
              Total Value
            </span>
            <span className="text-[#D4A017] font-bold text-lg">
              €{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4A017] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:text-white transition-colors mr-2"
              title={`Track: ${order.trackingNumber || 'Package'}`}
            >
              Track Package
            </a>
          )}
          <div className={`px-4 py-1.5 rounded-full ${sc.bg} border ${sc.border} flex items-center gap-2`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${sc.ping} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${sc.dot}`}></span>
            </span>
            <span className={`${sc.text} text-xs font-bold uppercase tracking-wider`}>
              {statusConfig.label}
            </span>
          </div>

          <button
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
             className="bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold text-xs px-3 py-2 h-auto flex items-center gap-2 cursor-pointer transition-colors rounded-lg"
             title="Download Order Invoice (PDF)"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            <span className="hidden sm:inline">Invoice</span>
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
            {totalItems} rare piece{totalItems !== 1 ? 's' : ''} in this acquisition
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="relative pt-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-[#D4A017] -translate-y-1/2 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>

          <div className="relative flex justify-between">
            {['Grading', 'Shipped', 'Delivered'].map((stepLabel, i) => {
              const stepNum = i + 1
              const isActive = statusConfig.step >= stepNum
              return (
                <div key={stepLabel} className={`flex flex-col items-center gap-2 ${isActive ? '' : 'opacity-50'}`}>
                  <div className={`w-4 h-4 rounded-full z-10 ${
                    isActive
                      ? 'bg-[#D4A017] border-4 border-[#111C2E] shadow-[0_0_0_2px_#D4A017]'
                      : 'bg-[#111C2E] border-2 border-white/20'
                  }`}></div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isActive ? 'text-[#D4A017]' : 'text-muted-foreground'
                  }`}>
                    {stepLabel}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────

const OrderHistory = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getMyOrders()
        setOrders(response.data || [])
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setError(err.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full"></div>
      </div>
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
                Tracking {orders.length} Secured Acquisition{orders.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/marketplace')}
                className="text-[#D4A017] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:text-white transition-colors"
              >
                New Acquisition <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

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
                <OrderCard key={order._id} order={order} />
              ))
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default OrderHistory
