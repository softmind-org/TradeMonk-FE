import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import TableLayout from '@layouts/TableLayout'
import { MY_LISTINGS_COLUMNS } from './myListingsColumns'
import { useModal } from '../../../context/modal'
import DeleteConfirmation from '@components/Modals/DeleteConfirmation'
import { useDeleteListing } from '../../../hooks/useDeleteListing'
import { useSellerListings } from '../../../hooks/useSellerListings'

/* ── My Listings Page ── */
const MyListings = () => {
  const navigate = useNavigate()
  const { openModal, closeModal } = useModal()
  const [currentPage, setCurrentPage] = useState(1)
  const deleteMutation = useDeleteListing()

  // Fetch live seller listings
  const { data, isLoading, error } = useSellerListings({
    page: currentPage,
    limit: 10
  })

  const listings = data?.listings || []
  const totalItems = data?.total || 0
  const totalPages = data?.totalPages || 1

  const handleView = (listing) => {
    navigate(`/seller/listings/${listing.id}`, { state: { listing } })
  }

  const handleEdit = (listing) => {
    navigate('/seller/listings/edit', { state: { listing } })
  }

  const handleDelete = (listing) => {
    openModal(
      <DeleteConfirmation
        listing={listing}
        onConfirm={async () => {
          try {
            await deleteMutation.mutateAsync(listing.id)
            closeModal()
          } catch (error) {
            console.error('Delete failed:', error)
          }
        }}
        onCancel={closeModal}
      />,
      440
    )
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const columns = useMemo(
    () =>
      MY_LISTINGS_COLUMNS({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    []
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Listings</h1>
        <button
          onClick={() => navigate('/seller/listings/add')}
          className="bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add Listing
        </button>
      </div>

      {/* Table */}
      <TableLayout
        data={listings}
        columns={columns}
        loading={isLoading}
        queryParams={{ page: currentPage }}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        showCategories={false}
        showSearch={false}
        dark
      />
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          Error loading listings: {error.message || 'Something went wrong'}
        </div>
      )}
    </div>
  )
}

export default MyListings
