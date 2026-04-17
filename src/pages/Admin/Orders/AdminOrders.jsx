import { useMemo, useState, useEffect, useCallback } from 'react'
import TableLayout from '@layouts/TableLayout'
import { ADMIN_ORDERS_COLUMNS } from './adminOrdersColumns'
import orderService from '@/services/orderService'

/* ── Admin Orders Page ── */
const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await orderService.getAllOrders()
      if (response?.success) {
        setOrders(response.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setError(err.message || 'Failed to load orders.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleView = (order) => {
    // Placeholder — will navigate to order detail later
    console.log('View order:', order.orderNumber)
  }

  const columns = useMemo(
    () =>
      ADMIN_ORDERS_COLUMNS({
        onView: handleView,
      }),
    []
  )

  return (
    <div className="space-y-4">
      {/* Table */}
      <TableLayout
        data={orders}
        columns={columns}
        loading={isLoading}
        showCategories={false}
        showSearch={false}
        dark
      />
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          Error loading orders: {error}
        </div>
      )}

      {/* Footer Note */}
      <p className="text-[11px] text-muted-foreground italic">
        Admin access is observer-only. Dispute resolution requires manual intervention via Seller Network Hub.
      </p>
    </div>
  )
}

export default AdminOrders
