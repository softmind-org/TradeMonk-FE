import { useState, useEffect } from 'react'
import { Search, Filter, Loader2 } from 'lucide-react'
import OrderCard from './components/OrderCard'
import orderService from '@/services/orderService'
import toast from 'react-hot-toast'

const SalesOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      // Fetch ONLY 'processing' and 'confirmed' orders for active sales list
      // Delivered/Shipped usually go to a history tab, but for now we fetch all or specific
      const response = await orderService.getSellerOrders()
      if (response?.data) {
        // Filter out completed ones if we want this to be just "active"
        // Let's just show all for now or sort them
        const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setOrders(sorted)
      }
    } catch (error) {
      console.error('Failed to fetch sales orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, { status: newStatus })
      if (response.success) {
        toast.success(`Order marked as ${newStatus}`)
        fetchOrders() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error(error?.response?.data?.message || 'Failed to update order status')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Sales Orders</h1>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#D4A017] animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-12 text-center">
             <p className="text-muted-foreground font-medium">No sales orders found.</p>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard 
              key={order._id} 
              order={order} 
              onUpdateStatus={handleUpdateStatus} 
            />
          ))
        )}
      </div>
    </div>
  )
}

export default SalesOrders
