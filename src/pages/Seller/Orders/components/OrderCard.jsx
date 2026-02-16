import { Package, Truck, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui'
import { pokemonLogo } from '@assets'

const OrderCard = ({ order }) => {
  const { 
    id, 
    buyerName, 
    date, 
    status, 
    total, 
    items, 
    shippingAddress 
  } = order

  // Status mapping for colors and labels
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'shipped': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'delivered': return 'text-green-400 bg-green-400/10 border-green-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  return (
    <div className="bg-[#111C2E] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div>
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Order ID</span>
             <span className="text-white font-bold font-mono">#{id}</span>
          </div>
          <div>
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Buyer</span>
             <span className="text-white font-bold">{buyerName}</span>
          </div>
          <div>
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Net Earnings</span>
             <span className="text-[#D4A017] font-bold">€{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(status)}`}>
              {status}
           </div>
           
           {status === 'processing' && (
             <Button className="bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-bold text-xs px-4 py-2 h-auto flex items-center gap-2">
               <Truck size={14} />
               Mark as Shipped
             </Button>
           )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-8">
         {/* Items List */}
         <div className="flex-1 space-y-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Items Sold</span>
            {items.map((item, index) => (
               <div key={index} className="flex gap-4">
                  <div className="w-12 h-16 bg-[#0B1220] rounded-lg border border-white/5 flex items-center justify-center p-1">
                     <img 
                       src={item.image || pokemonLogo} 
                       alt={item.name} 
                       className="w-full h-full object-contain"
                     />
                  </div>
                  <div>
                     <h4 className="text-white font-bold text-sm">{item.name}</h4>
                     <p className="text-muted-foreground text-xs">{item.set} • Qty: {item.quantity}</p>
                  </div>
               </div>
            ))}
         </div>

         {/* Shipping Details */}
         <div className="lg:w-1/3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">Shipping Address</span>
            <div className="bg-[#0B1220] rounded-xl p-5 border border-white/5 h-full flex flex-col justify-center">
               <p className="text-white text-sm font-medium mb-1">{shippingAddress.street}</p>
               <p className="text-muted-foreground text-sm mb-4">{shippingAddress.city}, {shippingAddress.zip}</p>
               
               <div className="flex items-center gap-2 text-[#D4A017]">
                  <Truck size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Secure Tracked Delivery Required</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default OrderCard
