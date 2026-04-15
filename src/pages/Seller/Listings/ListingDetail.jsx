import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeft,
  Pencil,
  Trash2,
  Tag,
  Clock,
  Eye,
  Heart,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react'
import { useModal } from '../../../context/modal'
import DeleteConfirmation from '@components/Modals/DeleteConfirmation'
import { useDeleteListing } from '../../../hooks/useDeleteListing'
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

/* ── Listing Detail Page (Seller View) ── */
const ListingDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { openModal, closeModal } = useModal()
  const deleteMutation = useDeleteListing()
  const listing = location.state?.listing

  // If no listing data, redirect back
  if (!listing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => navigate('/seller/listings')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Inventory</span>
        </button>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-white mb-2">Listing Not Found</h2>
          <p className="text-muted-foreground text-sm">The listing data is unavailable.</p>
        </div>
      </div>
    )
  }

  const handleEdit = () => {
    navigate('/seller/listings/edit', { state: { listing } })
  }

  const handleDelete = () => {
    openModal(
      <DeleteConfirmation
        listing={listing}
        onConfirm={async () => {
          try {
            await deleteMutation.mutateAsync(listing.id)
            closeModal()
            navigate('/seller/listings')
          } catch (error) {
            console.error('Delete failed:', error)
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
        onClick={() => navigate('/seller/listings')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
      >
        <ChevronLeft size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Back to Inventory</span>
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Card Image */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0B1220] rounded-2xl p-6 border border-white/5 aspect-[3/4] flex items-center justify-center group [perspective:1000px]">
            {listing.image ? (
              <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Image */}
                <div className="absolute inset-0 [backface-visibility:hidden]">
                  <img
                    src={formatImageUrl(listing.image)}
                    alt={listing.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                {/* Back Image */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <img
                    src={formatImageUrl(listing.backImage)}
                    alt={`${listing.name} Back`}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
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
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{listing.name}</h1>
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
                {listing.setName} • {listing.gameCategory}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleEdit}
                className="bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                <Pencil size={14} />
                Edit Listing
              </button>
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
              value={`€${Number(listing.price).toLocaleString()}`}
              accent
            />
            <StatCard
              label="Available Stock"
              value={`${listing.quantity} Units`}
            />
            <div className="bg-[#0B1220] border border-white/5 rounded-xl p-5 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Current Status
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
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

export default ListingDetail
