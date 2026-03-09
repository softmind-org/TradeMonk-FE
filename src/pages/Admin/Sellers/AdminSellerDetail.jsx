import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Star, ShieldCheck, UserX, UserCheck, Mail, BarChart3, Clock } from 'lucide-react'
import userService from '@/services/userService'

const AdminSellerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [sellerData, setSellerData] = useState(null)
  const [stats, setStats] = useState(null)
  const [topListing, setTopListing] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isToggling, setIsToggling] = useState(false)

  const fetchSellerDetail = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userService.getSellerDetail(id)
      if (response?.success) {
        setSellerData(response.data.seller)
        setStats(response.data.stats)
        setTopListing(response.data.topListing)
      }
    } catch (err) {
      console.error('Failed to fetch seller:', err)
      setError(err.message || 'Failed to load seller details.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchSellerDetail()
  }, [fetchSellerDetail])

  const handleToggleStatus = async () => {
    if (!sellerData) return
    const newStatus = sellerData.status === 'active' ? 'suspended' : 'active'
    try {
      setIsToggling(true)
      const response = await userService.freezeSeller(sellerData._id, newStatus)
      if (response?.success) {
        setSellerData(response.data)
      }
    } catch (err) {
      console.error('Failed to toggle status:', err)
    } finally {
      setIsToggling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="text-[#D4A017] animate-spin" />
        <span className="ml-3 text-muted-foreground text-sm">Loading seller profile…</span>
      </div>
    )
  }

  if (error || !sellerData) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-sm mb-4">{error || 'Seller not found'}</p>
        <button
          onClick={() => navigate('/admin/sellers')}
          className="bg-[#D4A017] text-black font-bold text-xs px-6 py-2 rounded-lg"
        >
          Back to Sellers
        </button>
      </div>
    )
  }

  const { fullName, _id: sellerId, status, stripeOnboardingComplete, createdAt } = sellerData
  const isActive = status === 'active'
  const initials = fullName ? fullName.charAt(0).toUpperCase() : 'S'
  const idStr = sellerId ? `USR-${sellerId.slice(-3).toUpperCase()}` : 'USR-XXX'
  const joinedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-CA') : '—'

  const formatGmv = (val) => {
    if (!val) return '€0'
    if (val >= 1000) return `€${(val / 1000).toFixed(1)}k`
    return `€${val.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/sellers')}
        className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Merchant Oversight
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT: Profile Card ── */}
                {/* ── LEFT: Profile Card ── */}



        <div className="lg:col-span-4 space-y-6">
          <div
            className="rounded-2xl p-8 flex flex-col items-center border border-white/5 relative overflow-hidden"
            style={{ backgroundColor: '#111C2E' }}
          >
            {/* Purple Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-purple-500" />

            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black text-[#D4A017] border border-white/5 bg-[#0B1220] mb-5">
              {initials}
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">{fullName}</h2>
              <ShieldCheck size={16} className="text-[#D4A017]" />
            </div>

            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 text-center">
              Verified Power Seller • {idStr}
            </p>

            {stats && (
              <div className="flex items-center gap-1.5 mb-6">
                <Star size={14} className="text-[#D4A017] fill-[#D4A017]" />
                <span className="text-sm font-bold text-[#D4A017]">
                  {stats.storeRating} Store Rating
                </span>
              </div>
            )}

            {/* Seller Info */}
            <div className="w-full space-y-3 mb-6 border-t border-white/5 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Stripe Status</span>
                <div className="flex items-center gap-1.5">
                  {stripeOnboardingComplete ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-[#4ADE80] flex items-center justify-center">
                        <span className="text-[#4ADE80] text-[8px]">✓</span>
                      </span>
                      <span className="text-[11px] font-bold text-[#4ADE80] uppercase">Linked</span>
                    </>
                  ) : (
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Pending</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Refund Rate</span>
                <span className="text-sm font-bold text-white">{stats?.refundRate || '0.0%'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Joined</span>
                <span className="text-sm font-bold text-white">{joinedDate}</span>
              </div>
            </div>

            {/* Freeze / Unfreeze */}
            <button
              onClick={handleToggleStatus}
              disabled={isToggling}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors mb-3 ${
                isActive
                  ? 'bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/20'
                  : 'bg-[#4ADE80]/10 hover:bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/20'
              }`}
            >
              {isToggling ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isActive ? (
                <>
                  <UserX size={16} /> Freeze Store
                </>
              ) : (
                <>
                  <UserCheck size={16} /> Unfreeze Store
                </>
              )}
            </button>

            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10 text-white hover:bg-white/5 transition-colors">
              <Mail size={16} /> Contact Merchant
            </button>
          </div>

          {/* Risk Assessment */}
          <div
            className="rounded-2xl p-6 border border-white/5"
            style={{ backgroundColor: '#111C2E' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={14} className="text-muted-foreground" />
              <h4 className="text-sm font-bold text-white">Risk Assessment</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Merchant consistently adheres to shipping SLAs. Low risk profile based on high-value transaction history.
            </p>
          </div>
        </div>

        {/* ── RIGHT: Stats & Activity ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* KPI Cards */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl p-5 border border-white/5" style={{ backgroundColor: '#111C2E' }}>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Total GMV</p>
                <h3 className="text-2xl font-black text-[#4ADE80]">{formatGmv(stats.totalGmv)}</h3>
              </div>
              <div className="rounded-2xl p-5 border border-white/5" style={{ backgroundColor: '#111C2E' }}>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Listings</p>
                <h3 className="text-2xl font-black text-white">{stats.totalListings}</h3>
              </div>
              <div className="rounded-2xl p-5 border border-white/5" style={{ backgroundColor: '#111C2E' }}>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Followers</p>
                <h3 className="text-2xl font-black text-white">{stats.followers >= 1000 ? `${(stats.followers / 1000).toFixed(1)}k` : stats.followers}</h3>
              </div>
              <div className="rounded-2xl p-5 border border-white/5" style={{ backgroundColor: '#111C2E' }}>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Disputes</p>
                <h3 className="text-2xl font-black text-[#4ADE80]">{stats.disputes}</h3>
              </div>
            </div>
          )}

          {/* Top-Tier Inventory Analysis */}
          <div
            className="rounded-2xl p-6 border border-white/5"
            style={{ backgroundColor: '#111C2E' }}
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={16} className="text-muted-foreground" />
              <h4 className="text-base font-bold text-white">Top-Tier Inventory Analysis</h4>
            </div>

            {topListing ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-lg bg-[#0B1220] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {topListing.images?.[0] ? (
                      <img src={topListing.images[0]} alt={topListing.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[8px] text-muted-foreground">IMG</span>
                    )}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{topListing.title}</h5>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      {[topListing.collectionName, topListing.setNumber].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-[#D4A017]">
                    €{Number(topListing.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] font-bold text-[#4ADE80] uppercase tracking-wider">In Stock</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active listings found.</p>
            )}
          </div>

          {/* Recent Merchant Events */}
          <div
            className="rounded-2xl p-6 border border-white/5"
            style={{ backgroundColor: '#111C2E' }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Clock size={16} className="text-muted-foreground" />
              <h4 className="text-base font-bold text-white">Recent Merchant Events</h4>
            </div>

            <div className="space-y-0 divide-y divide-white/5">
              <div className="flex items-center justify-between py-4 first:pt-0">
                <div>
                  <h5 className="text-sm font-bold text-white">KYC Renewal</h5>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                    Documentation verified successfully
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex-shrink-0">
                  2 days ago
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <h5 className="text-sm font-bold text-white">Bulk Listing Import</h5>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                    12 new items added to catalog
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex-shrink-0">
                  5 days ago
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <h5 className="text-sm font-bold text-white">Payout Initiated</h5>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                    Funds transferred to bank
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex-shrink-0">
                  1 week ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSellerDetail
