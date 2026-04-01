import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Pencil,
  Trash2,
  Tag,
  Clock,
  Eye,
  Heart,
  ShieldCheck,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react'
import { useModal } from '../../../context/modal'
import DeleteConfirmation from '@components/Modals/DeleteConfirmation'
import { useDeleteListing } from '../../../hooks/useDeleteListing'
import productService from '@/services/productService'
import { formatImageUrl } from '../../../utils'

/* ── Stat Card ── */
const StatCard = ({ label, value, accent = false }) => (
  <div className="bg-[#0B1220] border border-white/5 rounded-xl p-5 flex flex-col justify-center">
    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
      {label}
    </span>
    <span className={`text-2xl font-bold ${accent ? 'text-[#D4A017]' : 'text-white'}`}>
      {value}
    </span>
  </div>
)

/* ── Listing Detail Page (Admin View) ── */
const AdminListingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { openModal, closeModal } = useModal()
  const deleteMutation = useDeleteListing()

  const [listing, setListing] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await productService.getProductById(id)
      if (response?.success) {
        setListing(response.data)
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

  // If no listing data, redirect back
  if (error || !listing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => navigate('/admin/listings')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Inventory</span>
        </button>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-white mb-2">Listing Not Found</h2>
          <p className="text-muted-foreground text-sm">{error || 'The listing data is unavailable.'}</p>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    openModal(
      <DeleteConfirmation
        listing={{ name: listing.title, id: listing._id }}
        onConfirm={async () => {
          try {
            await deleteMutation.mutateAsync(listing._id)
            closeModal()
            navigate('/admin/listings')
          } catch (err) {
            console.error('Delete failed:', err)
          }
        }}
        onCancel={closeModal}
      />,
      440
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Link */}
      <button
        onClick={() => navigate('/admin/listings')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
      >
        <ChevronLeft size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Back to Inventory</span>
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Card Image */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0B1220] rounded-2xl p-6 border border-white/5 aspect-[3/4] flex items-center justify-center">
            {listing.images?.[0] ? (
              <img
                src={formatImageUrl(listing.images[0])}
                alt={listing.title}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="w-24 h-32 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Tag size={32} className="text-muted-foreground" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{listing.title}</h1>
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
                {listing.collectionName} • {listing.gameSystem}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleDelete}
                className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Market Price"
              value={`€${Number(listing.price || 0).toLocaleString()}`}
              accent
            />
            <StatCard
              label="Available Stock"
              value={`${listing.quantity || 1} Units`}
            />
            <div className="bg-[#0B1220] border border-white/5 rounded-xl p-5 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Current Status
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${listing.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                <span className="text-lg font-bold text-white uppercase">{listing.status}</span>
              </div>
            </div>
          </div>

          {/* Collectible Metadata */}
          <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Tag size={16} className="text-muted-foreground" />
              <span className="text-white font-bold">Collectible Metadata</span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rarity:</span>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                  {listing.rarity || 'Secret Rare'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Condition:</span>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                  {listing.condition || 'Mint'}
                </span>
              </div>
            </div>
          </div>

          {/* Collector's Notes */}
          <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Collector's Notes
              </span>
            </div>
            <div className="bg-[#0B1220] rounded-xl p-4 border border-white/5">
              <p className="text-gray-300 text-sm leading-relaxed italic">
                "{listing.description || 'No Description'}"
              </p>
            </div>
          </div>

          {/* Verified Authentication */}
          <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold mb-1">Verified Authentication</h3>
              <p className="text-muted-foreground text-xs">
                This listing is currently being monitored for price volatility and authentication integrity.
              </p>
            </div>
            <ShieldCheck size={32} className="text-[#60A5FA] flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminListingDetail
