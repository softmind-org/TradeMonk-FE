import { useState, useEffect } from 'react'
import { ShieldCheck, ArrowRight, DollarSign, Loader2, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui'
import payoutService from '@/services/payoutService'
import toast from 'react-hot-toast'

const Payouts = () => {
  const [availableBalance, setAvailableBalance] = useState(0)
  const [pendingBalance, setPendingBalance] = useState(0)
  const [eligibleOrdersCount, setEligibleOrdersCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)

  const [payouts, setPayouts] = useState([])

  const fetchHistory = async () => {
    try {
      const response = await payoutService.getPayoutHistory()
      if (response?.data) {
        setPayouts(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch payout history:', error)
    }
  }

  const fetchBalance = async () => {
    try {
      setIsLoading(true)
      const response = await payoutService.getPayoutBalance()
      if (response?.data) {
        setAvailableBalance(response.data.availableBalance || 0)
        setPendingBalance(response.data.pendingBalance || 0)
        setEligibleOrdersCount(response.data.eligibleOrders?.length || 0)
      }
    } catch (error) {
      console.error('Failed to fetch payout balance:', error)
      toast.error('Could not load payout balance')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
    fetchHistory()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleRequestPayout = async () => {
    if (availableBalance <= 0) {
      toast.error('No funds available for payout')
      return
    }

    try {
      setIsRequesting(true)
      const response = await payoutService.requestPayout()
      if (response.success) {
        toast.success(response.message || 'Payout requested successfully')
        fetchBalance() // Refresh balances
      }
    } catch (error) {
      console.error('Payout request error:', error)
      toast.error(error?.response?.data?.message || 'Failed to request payout')
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-white">Earnings & Payouts</h1>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#111C2E] border border-white/5 rounded-2xl">
           <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin mb-4" />
           <p className="text-muted-foreground text-sm font-medium">Calculating your earnings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Balance Card */}
          <div className="lg:col-span-2 bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#16A34A]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  Available for Payout
                </span>
                <div className="text-5xl md:text-6xl font-black text-white mb-3">
                  €{availableBalance.toFixed(2)}
                </div>
                <div className="flex items-center gap-2 text-[#16A34A]">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider bg-[#16A34A]/10 px-2 py-0.5 rounded">
                    {eligibleOrdersCount} Eligible Order{eligibleOrdersCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={handleRequestPayout}
                disabled={availableBalance <= 0 || isRequesting}
                className="!bg-[#16A34A] hover:!bg-[#16A34A]/80 text-white font-bold px-8 py-4 h-auto text-sm uppercase tracking-wide disabled:opacity-50 transition-colors"
              >
                {isRequesting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Request Payout'
                )}
              </Button>
            </div>
          </div>

          {/* Pending Clearance Card */}
          <div className="bg-[#0B1220] border border-[#D4A017]/20 rounded-2xl p-6 md:p-8 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-widest block mb-2 flex items-center gap-2">
              <Clock size={14} />
              Pending Clearance
            </span>
            <div className="text-3xl font-black text-white mb-2">
              €{pendingBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
              Funds from recently shipped orders. Money becomes available 7 days after shipping.
            </p>
          </div>
        </div>
      )}

      {/* Commission Policy Footer */}
      <div className="bg-[#0B1220] border border-blue-500/20 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm mb-1">Fund Release Policy</h3>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-2xl">
            Trademonk deducts a flat platform fee from sales. Payouts are manually requested and processed via Stripe Connect. Funds are locked for 7 days after marking an order as shipped, or unlock instantly when delivered.
          </p>
        </div>
      </div>

      {/* Payout History Section */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">
          Recent Payouts
        </h2>
        
        <div className="bg-[#111C2E] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
          {payouts.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No payout history found.
            </div>
          ) : (
            payouts.map((payout) => (
              <div 
                key={payout.id} 
                className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">#{payout.id?.slice(-8).toUpperCase()}</span>
                    </div>
                    <span className="text-muted-foreground text-xs font-medium">{formatDate(payout.date)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-white font-bold text-lg mb-1">
                    €{payout.amount.toFixed(2)}
                  </div>
                  <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-wider bg-[#16A34A]/10 px-2 py-0.5 rounded">
                    {payout.status || 'SUCCESSFUL'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Payouts
