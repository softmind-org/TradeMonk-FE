import { useMemo, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import TableLayout from '@layouts/TableLayout'
import { ADMIN_SELLERS_COLUMNS } from './adminSellersColumns'
import userService from '@/services/userService'

/* ── Admin Sellers Page ── */
const AdminSellers = () => {
  const navigate = useNavigate()
  const [sellers, setSellers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSellers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userService.getSellers()
      if (response?.success) {
        setSellers(response.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch sellers:', err)
      setError(err.message || 'Failed to load sellers.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSellers()
  }, [fetchSellers])

  const handleView = (seller) => {
    navigate(`/admin/sellers/${seller._id}`)
  }

  const handleToggleStatus = async (seller) => {
    const newStatus = seller.status === 'active' ? 'suspended' : 'active'
    try {
      const response = await userService.freezeSeller(seller._id, newStatus)
      if (response?.success) {
        setSellers((prev) =>
          prev.map((s) => (s._id === seller._id ? { ...s, status: response.data.status } : s))
        )
      }
    } catch (err) {
      console.error('Failed to toggle seller status:', err)
    }
  }

  const columns = useMemo(
    () =>
      ADMIN_SELLERS_COLUMNS({
        onView: handleView,
        onToggleStatus: handleToggleStatus,
      }),
    []
  )

  return (
    <div className="space-y-4">
      {/* Analytics Header */}
      <div
        className="rounded-2xl p-6 border border-white/5"
        style={{ backgroundColor: '#111C2E' }}
      >
        <h2 className="text-lg font-bold text-white mb-1">Seller Network Analytics</h2>
        <p className="text-xs text-muted-foreground">
          Reviewing {sellers.length} active verified merchants.
        </p>
      </div>

      {/* Table */}
      <TableLayout
        data={sellers}
        columns={columns}
        loading={isLoading}
        showCategories={false}
        showSearch={false}
        dark
      />

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          Error loading sellers: {error}
        </div>
      )}
    </div>
  )
}

export default AdminSellers
