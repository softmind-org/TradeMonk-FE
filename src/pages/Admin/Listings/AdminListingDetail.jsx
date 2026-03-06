import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Star, Calendar, ShieldCheck, ExternalLink, Flag, Share2, Trash2 } from 'lucide-react'
import productService from '@/services/productService'

const AdminListingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await productService.getProductById(id)
      if (response?.success) {
        setProduct(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch product:', err)
      setError(err.message || 'Failed to load listing.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="text-[#D4A017] animate-spin" />
        <span className="ml-3 text-muted-foreground text-sm">Loading asset…</span>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-sm mb-4">{error || 'Asset not found'}</p>
        <button
          onClick={() => navigate('/admin/listings')}
          className="bg-[#D4A017] text-black font-bold text-xs px-6 py-2 rounded-lg"
        >
          Back to Catalog
        </button>
      </div>
    )
  }

  const {
    title,
    collectionName,
    setNumber,
    gameSystem,
    price,
    condition,
    rarity,
    status,
    description,
    images,
    seller,
    createdAt,
    _id: productId,
  } = product

  const isActive = status === 'active'
  const subtitle = [collectionName, gameSystem, setNumber].filter(Boolean).join(' • ')
  const mainImage = images?.[0]
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/listings')}
        className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Catalog
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── LEFT: Image Card ── */}
        <div className="lg:col-span-4 space-y-6">
          <div
            className="rounded-2xl p-6 border border-white/5 flex flex-col items-center"
            style={{ backgroundColor: '#111C2E' }}
          >
            <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#0B1220] border border-white/10 mb-4">
              {mainImage ? (
                <img src={mainImage} alt={title} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  No Image
                </div>
              )}
            </div>
            <button className="bg-[#0B1220] border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
              View Full Res
            </button>
          </div>

          {/* Platform Status Card */}
          <div
            className="rounded-2xl p-6 border border-white/5"
            style={{ backgroundColor: '#111C2E' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={14} className="text-muted-foreground" />
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Platform Status
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Auto-Mod Audit</span>
                <span className="text-[11px] font-bold text-[#4ADE80] uppercase tracking-wider">Passed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Price Anomaly</span>
                <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">Low Volatility</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Flags</span>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">None</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Details ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: isActive ? '#4ADE801A' : '#EF44441A',
                    color: isActive ? '#4ADE80' : '#EF4444',
                  }}
                >
                  {isActive ? 'Active Asset' : status}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  ID: {productId?.slice(-4)?.toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-1">{title}</h1>
              <p className="text-sm font-bold text-[#D4A017] uppercase tracking-wider">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <button className="bg-[#4ADE80]/10 border border-[#4ADE80]/20 text-[#4ADE80] text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-[#4ADE80]/20 transition-colors flex items-center gap-2">
                <Star size={12} />
                Feature Asset
              </button>
              <button className="bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-[#3B82F6]/20 transition-colors flex items-center gap-2">
                <Flag size={12} />
                Edit Metadata
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5 border border-white/5" style={{ backgroundColor: '#111C2E' }}>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Listed Price
              </p>
              <h3 className="text-2xl font-black text-white">
                €{Number(price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="rounded-2xl p-5 border border-white/5" style={{ backgroundColor: '#111C2E' }}>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Market Match
              </p>
              <h3 className="text-2xl font-black text-[#4ADE80]">99.2%</h3>
            </div>
            <div className="rounded-2xl p-5 border border-white/5" style={{ backgroundColor: '#111C2E' }}>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Total Leads
              </p>
              <h3 className="text-2xl font-black text-blue-400">24</h3>
            </div>
          </div>

          {/* Core Parameters */}
          <div
            className="rounded-2xl p-6 border border-white/5"
            style={{ backgroundColor: '#111C2E' }}
          >
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck size={14} className="text-muted-foreground" />
              <h4 className="text-sm font-bold text-white">Core Parameters</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Rarity Classification
                </p>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-muted-foreground" />
                  <span className="text-sm font-bold text-white">{rarity || 'N/A'}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Merchant Entity
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#4ADE80]">
                    {seller?.name || 'Unknown'}
                  </span>
                  <ExternalLink size={12} className="text-[#4ADE80]" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Surface Condition
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{condition || 'N/A'}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Initialization Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-muted-foreground" />
                  <span className="text-sm font-bold text-white">{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Internal Descriptive Analysis
            </p>
            <div
              className="rounded-2xl p-6 border border-white/5"
              style={{ backgroundColor: '#111C2E' }}
            >
              <p className="text-sm text-white/80 italic leading-relaxed">
                {description ? `"${description}"` : 'No description provided'}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-colors">
                <Flag size={14} /> Report Inaccuracy
              </button>
              <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-colors">
                <Share2 size={14} /> Public URL
              </button>
            </div>
            <button className="bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-[#EF4444]/20 transition-colors flex items-center gap-2">
              <Trash2 size={14} /> De-Index Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminListingDetail
