import { useState, useEffect } from 'react'
import { Search, Filter, Loader2, Download } from 'lucide-react'
import OrderCard from './components/OrderCard'
import orderService from '@/services/orderService'
import toast from 'react-hot-toast'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const SalesOrders = () => {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [isDownloading, setIsDownloading] = useState(false)

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

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true)
      // Call service to download (returns blob since responseType is 'blob')
      const response = await orderService.downloadCsvReport(selectedMonth, selectedYear)
      
      const blob = new Blob([response], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sales_report_${String(selectedMonth).padStart(2, '0')}_${selectedYear}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Report downloaded successfully')
    } catch (error) {
      console.error('Failed to download report:', error)
      toast.error('Failed to download report.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Sales Orders</h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select 
              className="bg-[#111C2E] border border-white/10 text-white text-sm rounded-lg px-3 py-2 cursor-pointer focus:ring-1 focus:ring-[#D4A017] focus:outline-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
              {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
              ))}
          </select>
          <select 
              className="bg-[#111C2E] border border-white/10 text-white text-sm rounded-lg px-3 py-2 cursor-pointer flex-shrink-0 focus:ring-1 focus:ring-[#D4A017] focus:outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
              {[...Array(5)].map((_, i) => (
                  <option key={i} value={currentYear - i}>{currentYear - i}</option>
              ))}
          </select>
          <button
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-[#D4A017] hover:bg-[#B88A0F] text-black font-bold text-sm px-4 py-2 rounded-lg transition-colors whitespace-nowrap disabled:opacity-70 cursor-pointer"
          >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> : <Download className="w-4 h-4 flex-shrink-0" />}
              Export Report
          </button>
        </div>
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
