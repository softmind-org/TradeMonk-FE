/**
 * Admin Payments Page
 * Displays platform GMV and marketplace revenue (commission) stats
 */
import { useState, useEffect, useCallback } from 'react'
import { ShieldCheck, TrendingUp } from 'lucide-react'
import orderService from '@/services/orderService'

const AdminPayments = () => {
  const [stats, setStats] = useState({
    totalGmv: 0,
    marketplaceRevenue: 0,
    growthPercent: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await orderService.getPaymentStats()
      if (response?.success) {
        setStats(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch payment stats:', err)
      setError(err.message || 'Failed to load payment statistics.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-[#111C2E] border border-white/5 rounded-2xl p-8 h-[200px] animate-pulse"
            >
              <div className="h-3 w-40 bg-white/10 rounded mb-6" />
              <div className="h-10 w-56 bg-white/10 rounded mb-8" />
              <div className="h-4 w-64 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1 — Total Platform GMV */}
        <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-8 flex flex-col justify-between min-h-[200px]">
          <div>
            <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase mb-4">
              Total Platform GMV
            </p>
            <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {formatCurrency(stats.totalGmv)}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <p className="text-muted-foreground text-sm">
              Payments and payouts are securely handled via Stripe Connect.
            </p>
          </div>
        </div>

        {/* Card 2 — Marketplace Revenue */}
        <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-8 flex flex-col justify-between min-h-[200px]">
          <div>
            <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase mb-4">
              Marketplace Revenue (3.5% Fee)
            </p>
            <p className="text-4xl md:text-5xl font-black text-[#D4A017] tracking-tight italic">
              {formatCurrency(stats.marketplaceRevenue)}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-8">
            <TrendingUp size={18} className="text-emerald-400" />
            <p className="text-muted-foreground text-sm">
              {stats.growthPercent >= 0 ? '+' : ''}
              {stats.growthPercent}% growth month-over-month
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPayments
