import { useMemo, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import TableLayout from '@layouts/TableLayout'
import { ADMIN_LISTINGS_COLUMNS } from './adminListingsColumns'
import productService from '@/services/productService'

/* ── Admin Listings Page ── */
const AdminListings = () => {
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all listings
  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await productService.getAllListings()
      if (response?.success) {
        setListings(response.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err)
      setError(err.message || 'Failed to load listings.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const handleView = (listing) => {
    navigate(`/admin/listings/${listing._id}`)
  }

  const columns = useMemo(
    () =>
      ADMIN_LISTINGS_COLUMNS({
        onView: handleView,
      }),
    []
  )

  return (
    <div className="space-y-4">
      {/* Heading */}
      <p className="text-[10px] font-bold text-[#D4A017] uppercase tracking-[0.25em]">
        Global Catalog Oversight
      </p>

      {/* Table */}
      <TableLayout
        data={listings}
        columns={columns}
        loading={isLoading}
        showCategories={false}
        showSearch={false}
        dark
      />

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          Error loading listings: {error}
        </div>
      )}
    </div>
  )
}

export default AdminListings
