import { useState } from 'react'
import { Package, Truck, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { pokemonLogo } from '@assets'
import orderService from '@/services/orderService'
import shippingService from '@/services/shippingService'
import toast from 'react-hot-toast'

const OrderCard = ({ order, onUpdateStatus }) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const { 
    _id,
    orderNumber,
    createdAt,
    orderStatus, 
    totalAmount, 
    items, 
    shippingAddress,
    feeBreakdown,
    labelUrl,
    trackingUrl,
    trackingNumber
  } = order

  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false)

  // Display fields
  const displayId = orderNumber || _id?.slice(-6) || 'Unknown'
  const buyerName = shippingAddress?.fullName || 'Unknown Buyer'
  const netEarnings = feeBreakdown?.sellerNet || 0
  const dateStr = createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown Date'
  const statusLine = (orderStatus || 'processing').toLowerCase()

  // Status mapping for colors and labels
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'confirmed': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'shipped': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'delivered': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'disputed': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  // Image formatter fallback (same logic from buyer side)
  const formatImageUrl = (path) => {
    if (!path || path === '') return pokemonLogo
    if (path.startsWith('http')) return path
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
    let serverBase = ''
    try { serverBase = new URL(apiBase).origin }
    catch { serverBase = apiBase.split('/api')[0] }
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${serverBase}${cleanPath}`
  }

  const handleDownloadInvoice = async () => {
    try {
      setIsDownloading(true)
      const blob = await orderService.downloadInvoice(_id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice_${orderNumber || _id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Invoice downloaded successfully')
    } catch (error) {
      console.error('Failed to download invoice:', error)
      toast.error('Failed to download invoice')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleGenerateLabel = async () => {
    try {
      setIsGeneratingLabel(true)
      const res = await shippingService.generateLabel(_id)
      if (res?.success && res.data?.labelUrl) {
         toast.success('Label generated successfully!')
         window.open(res.data.labelUrl, '_blank')
         // We call this to update the parent component's state to 'shipped' visually
         if (onUpdateStatus) onUpdateStatus(_id, 'shipped')
      } else {
         throw new Error(res.message || 'Failed to generate label')
      }
    } catch (err) {
      console.error('Label error:', err)
      toast.error(err.message || 'Error generating label')
    } finally {
      setIsGeneratingLabel(false)
    }
  }

  const handleDownloadLabel = async () => {
    try {
      setIsDownloading(true)
      const blob = await shippingService.downloadLabel(_id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      // Provide a clean filename using order ID
      a.download = `shipping_label_${orderNumber || _id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Label downloaded successfully')
    } catch (err) {
      console.error('Download label error:', err)
      toast.error('Failed to download shipping label')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="bg-[#111C2E] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div>
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Order #</span>
             <span className="text-white font-bold font-mono">{displayId}</span>
          </div>
          <div>
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Buyer</span>
             <span className="text-white font-bold">{buyerName}</span>
          </div>
          <div>
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Net Earnings</span>
             <span className="text-[#D4A017] font-bold">€{netEarnings.toFixed(2)}</span>
          </div>
          <div>
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Date</span>
             <span className="text-muted-foreground font-medium text-sm">{dateStr}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(statusLine)}`}>
              {statusLine}
           </div>
           
           {statusLine === 'processing' && (
             <Button 
                onClick={() => onUpdateStatus(_id, 'confirmed')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 h-auto flex items-center gap-2 cursor-pointer transition-colors"
                title="Acknowledge order and prepare for shipment"
             >
               <Package size={14} />
               Confirm Order
             </Button>
           )}

           {statusLine === 'confirmed' && (
             <Button 
                onClick={handleGenerateLabel}
                disabled={isGeneratingLabel}
                className="bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-bold text-xs px-4 py-2 h-auto flex items-center gap-2 cursor-pointer transition-colors"
                title="Generate SendCloud Parcel & Print Label"
             >
               {isGeneratingLabel ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
               <span className="hidden sm:inline">Create Shipment & Label</span>
               <span className="sm:hidden">Ship</span>
             </Button>
           )}

           {(statusLine === 'shipped' || statusLine === 'delivered') && labelUrl && (
              <Button 
                 onClick={handleDownloadLabel}
                 disabled={isDownloading}
                 variant="outline"
                 className="border-white/10 hover:bg-white/5 text-white font-bold text-xs px-3 py-2 h-auto flex items-center gap-2 cursor-pointer transition-colors"
                 title="Re-print Shipping Label"
              >
                 <Download size={14} />
                 <span className="hidden sm:inline">Print Label</span>
              </Button>
           )}

           {(statusLine === 'shipped' || statusLine === 'delivered') && !labelUrl && (
              <div 
                 className="px-3 py-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 text-yellow-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-2"
                 title="SendCloud Test Mode: Labels are not generated until billing is active."
              >
                 <Truck size={14} />
                 <span>Draft Label (Test Mode)</span>
              </div>
           )}
           <Button 
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              variant="outline"
              className="border-white/10 hover:bg-white/5 text-white font-bold text-xs px-3 py-2 h-auto flex items-center gap-2 cursor-pointer transition-colors"
              title="Download Order Invoice (PDF)"
           >
             {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
             <span className="hidden sm:inline">Invoice</span>
           </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-8">
         {/* Items List */}
         <div className="flex-1 space-y-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Items Sold ({items?.length || 0})</span>
            {items?.map((item, index) => (
               <div key={index} className="flex gap-4">
                  <div className="w-12 h-16 bg-[#0B1220] rounded-lg border border-white/5 flex items-center justify-center p-1 overflow-hidden">
                     <img 
                       src={formatImageUrl(item.image)} 
                       alt={item.title} 
                       className="w-full h-full object-contain"
                       onError={(e) => { e.target.src = pokemonLogo }}
                     />
                  </div>
                  <div>
                     <h4 className="text-white font-bold text-sm">{item.title}</h4>
                     <p className="text-muted-foreground text-xs font-mono">Qty: {item.quantity}</p>
                     <p className="text-[#D4A017] text-xs font-bold mt-1">€{item.price.toFixed(2)}</p>
                  </div>
               </div>
            ))}
         </div>

         {/* Shipping Details */}
         <div className="lg:w-1/3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">Delivery Address</span>
            <div className="bg-[#0B1220] rounded-xl p-5 border border-white/5 h-full flex flex-col justify-center">
               <p className="text-white text-sm font-medium mb-1">{shippingAddress?.address || 'No address'}</p>
               <p className="text-muted-foreground text-sm mb-4">{shippingAddress?.city || 'No city'}, {shippingAddress?.zipCode || 'No zip'}</p>
               
               {trackingUrl ? (
                 <div className="flex flex-col gap-1 mt-auto">
                    <div className="flex items-center gap-2 text-[#D4A017]">
                      <Truck size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">In Transit</span>
                    </div>
                    <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 underline font-medium">
                       Track: {trackingNumber}
                    </a>
                 </div>
               ) : (
                 <div className="flex items-center gap-2 text-[#D4A017] mt-auto">
                    <Truck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Secure Tracked Delivery Required</span>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  )
}

export default OrderCard
