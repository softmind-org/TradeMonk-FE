/**
 * Order Complete Page
 * Displays success message and order details after checkout
 */
import { useEffect } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { MainLayout } from '@layouts'
import { Button } from '@components/ui'
import { Check, Download, ArrowRight } from 'lucide-react'
import { jsPDF } from 'jspdf'

import { useCart } from '@context'

const OrderComplete = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const order = state?.order

  useEffect(() => {
    if (order) {
        clearCart()
    }
  }, [order, clearCart])

  // Redirect to marketplace if no order state (prevent direct access)
  if (!order) {
    return <Navigate to="/marketplace" replace />
  }

  const handleDownloadReceipt = () => {
    const doc = new jsPDF()
    
    // Add content to PDF
    doc.setFontSize(20)
    doc.text('TradeMonk Receipt', 20, 20)
    
    doc.setFontSize(12)
    doc.text(`Order ID: ${order.id}`, 20, 40)
    doc.text(`Date: ${order.date}`, 20, 50)
    doc.text(`Total: $${order.total}`, 20, 60)
    
    doc.text('Items:', 20, 80)
    let y = 90
    order.items.forEach(item => {
      doc.text(`- ${item.title} x${item.quantity} ($${item.price})`, 20, y)
      y += 10
    })
    
    doc.save(`TradeMonk_Receipt_${order.id}.pdf`)
  }

  return (
    <MainLayout>
      <div className="bg-background min-h-screen flex items-center justify-center p-4">
        <div className="max-w-3xl w-full text-center">
          
          {/* Success Icon */}
          <div className="w-24 h-24 bg-[#059669]/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <div className="w-16 h-16 bg-[#059669] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(5,150,105,0.5)]">
               <Check size={40} className="text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-4 uppercase">
            Acquisition Complete
          </h1>
          
          {/* Subtitle */}
          <p className="text-muted-foreground text-lg mb-12">
            Your order <span className="text-white font-bold">{order.id}</span> has been secured and sent to grading verification.
          </p>

          {/* Order Card */}
          <div className="bg-[#111C2E] border border-white/5 rounded-3xl p-8 md:p-12 mb-12 text-left relative overflow-hidden">
            {/* Top Border Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent opacity-50"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-white/5">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  Order Date
                </span>
                <span className="text-white font-bold text-xl">
                  {order.date}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  Total Secured
                </span>
                <span className="text-[#D4A017] font-bold text-xl">
                  {order.total}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                  Auth Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#60A5FA] font-bold text-sm bg-[#1E3A8A]/20 px-3 py-1 rounded-full border border-[#1E3A8A]/30 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse"></div>
                    Pending Verification
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground/60 italic text-center leading-relaxed">
              "The cards in this order will now undergo a mandatory identity and centering check by our professional partners before final dispatch."
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button 
               onClick={() => navigate('/marketplace')}
               className="w-full md:w-auto min-w-[240px] bg-secondary hover:bg-secondary/90 text-black font-bold py-4 text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,160,23,0.2)] hover:shadow-[0_0_30px_rgba(212,160,23,0.4)] transition-all"
            >
              Return to Dashboard
              <ArrowRight size={18} />
            </Button>
            
            <Button 
               onClick={handleDownloadReceipt}
               className="w-full md:w-auto min-w-[200px] bg-transparent hover:bg-white/5 text-white font-bold py-4 text-sm uppercase tracking-wide border border-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download size={18} />
              Receipt PDF
            </Button>
          </div>

        </div>
      </div>
    </MainLayout>
  )
}

export default OrderComplete
