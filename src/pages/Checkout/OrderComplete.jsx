/**
 * Order Complete Page
 * Displays success message and order details after multi-seller checkout
 */
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'

import { Button } from '@components/ui'
import { Check, Download, ArrowRight, Store } from 'lucide-react'
import { jsPDF } from 'jspdf'

import { useCart } from '@context'
import orderService from '@/services/orderService'

const OrderComplete = () => {
  const { state, search } = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const [orders, setOrders] = useState(state?.allOrders || (state?.order ? [state.order] : []))
  const [isLoading, setIsLoading] = useState(orders.length === 0)
  const [error, setError] = useState(null)

  useEffect(() => {
    const finalizeOrder = async () => {
      // If orders already exist in state, just clear cart
      if (orders.length > 0) {
        setIsLoading(false)
        await clearCart()
        return
      }

      // Check for redirect params (Stripe redirect adds these)
      const params = new URLSearchParams(search)
      const paymentIntentId = params.get('payment_intent')
      const redirectStatus = params.get('redirect_status')

      if (paymentIntentId) {
        if (redirectStatus && redirectStatus !== 'succeeded') {
          setError(`Payment status: ${redirectStatus}. Please check your payment method.`)
          setIsLoading(false)
          return
        }

        try {
          // Fetch orders matching this payment intent from backend
          const response = await orderService.getMyOrders()
          const matchingOrders = (response.data || []).filter(
            o => o.paymentIntentId === paymentIntentId
          )

          if (matchingOrders.length > 0) {
            setOrders(matchingOrders)
            await clearCart()
          } else {
            setError('Order information lost. Please contact support if payment was debited.')
          }
        } catch (err) {
          console.error('Error fetching orders after redirect:', err)
          setError('An error occurred while confirming your order.')
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    finalizeOrder()
  }, [])

  // Redirect to marketplace if no orders and no loading
  if (!isLoading && orders.length === 0 && !error) {
    return <Navigate to="/marketplace" replace />
  }

  // ── Computed values ──────────────────────────────
  const grandTotal = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const totalItems = orders.reduce((sum, o) => sum + (o.items?.length || 0), 0)

  const handleDownloadReceipt = () => {
    if (orders.length === 0) return
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('TradeMonk Receipt', 20, 20)
    
    let y = 40
    orders.forEach((order, idx) => {
      doc.setFontSize(14)
      doc.text(`Order ${idx + 1}: ${order.orderNumber || order._id}`, 20, y)
      y += 10
      doc.setFontSize(11)
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, y)
      y += 8
      doc.text(`Total: €${(order.totalAmount || 0).toFixed(2)}`, 20, y)
      y += 10
      order.items?.forEach(item => {
        doc.text(`  - ${item.title} x${item.quantity} (€${item.price})`, 20, y)
        y += 8
      })
      y += 6
    })

    doc.setFontSize(14)
    doc.text(`Grand Total: €${grandTotal.toFixed(2)}`, 20, y)
    
    doc.save(`TradeMonk_Receipt_${orders[0]?.orderNumber || 'order'}.pdf`)
  }

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">Securing Your Order...</h2>
          <p className="text-muted-foreground mt-2">Verifying payment with Stripe</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-red-500 text-4xl">!</span>
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter mb-4 uppercase">Verification Failed</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button 
             onClick={() => navigate('/marketplace')}
             className="w-full bg-secondary hover:bg-secondary/90 text-black font-bold py-4"
          >
            Back to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  return (
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
          {orders.length === 1 ? (
            <>Your order <span className="text-white font-bold">{orders[0].orderNumber}</span> has been secured and sent to grading verification.</>
          ) : (
            <>{orders.length} orders created and secured across {orders.length} sellers.</>
          )}
        </p>

        {/* Order Cards */}
        <div className="space-y-4 mb-12">
          {orders.map((order, idx) => (
            <div key={order._id} className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-8 text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent opacity-50"></div>
              
              {/* Order header */}
              {orders.length > 1 && (
                <div className="flex items-center gap-2 mb-4">
                  <Store size={14} className="text-[#D4A017]" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Package {idx + 1} of {orders.length}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                    Order #
                  </span>
                  <span className="text-white font-bold text-lg">
                    {order.orderNumber || order._id?.slice(-6)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                    Amount
                  </span>
                  <span className="text-[#D4A017] font-bold text-lg">
                    €{(order.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                    Status
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#60A5FA] font-bold text-sm bg-[#1E3A8A]/20 px-3 py-1 rounded-full border border-[#1E3A8A]/30 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse"></div>
                      Processing
                    </span>
                  </div>
                </div>
              </div>

              {/* Items list */}
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{item.title} <span className="text-white/40">×{item.quantity}</span></span>
                    <span className="text-white font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Grand Total (if multiple orders) */}
          {orders.length > 1 && (
            <div className="bg-[#111C2E] border border-[#D4A017]/20 rounded-2xl p-6 flex justify-between items-center">
              <span className="text-white font-bold text-lg">Grand Total ({orders.length} orders)</span>
              <span className="text-[#D4A017] font-bold text-2xl">€{grandTotal.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Date */}
        <p className="text-xs text-muted-foreground mb-8">
          {new Date(orders[0]?.createdAt).toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          })}
        </p>

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
  )
}

export default OrderComplete
