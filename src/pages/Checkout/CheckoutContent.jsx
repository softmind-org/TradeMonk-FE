import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { useCart, useAuth } from '@context'
import { Button, Input } from '@components/ui'
import { ArrowLeft, Truck, ArrowRight, Lock } from 'lucide-react'
import { pokemonLogo } from '@assets'
import { useFormik } from 'formik'
import { checkoutSchema } from '@/schemas/checkout-schema'

const CheckoutContent = () => {
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  const { items, subtotal, shipping, total, clearCart } = useCart()
  const { user } = useAuth()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const formik = useFormik({
    initialValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      address: '',
      city: '',
      zipCode: ''
    },
    validationSchema: checkoutSchema,
    onSubmit: async (values) => {
        console.log('Submitting form with values:', values)
        if (!stripe || !elements) {
            console.error('Stripe or Elements not loaded')
            return
        }
    
        setIsProcessing(true)
        setErrorMessage(null)
    
        // Trigger form validation for Stripe Element
        const { error: submitError } = await elements.submit()
        
        if (submitError) {
          console.error('Stripe Element Error:', submitError)
          setErrorMessage(submitError.message)
          setIsProcessing(false)
          return
        }
    
        // Simulate payment processing delay (replace with actual backend call)
        await new Promise(resolve => setTimeout(resolve, 2000))
    
        const orderId = `TM-${Math.floor(100000 + Math.random() * 900000)}`
        const orderDate = new Date().toLocaleDateString('en-US')
        
        const orderData = {
          id: orderId,
          date: orderDate,
          total: total.toFixed(2),
          status: 'Paid',
          progress: 25,
          items: items
        }
        
        const existingOrders = JSON.parse(localStorage.getItem('tradeMonk_orders') || '[]')
        localStorage.setItem('tradeMonk_orders', JSON.stringify([orderData, ...existingOrders]))
    
        console.log('Payment Processed Successfully', { shippingInfo: values, items, total, orderId })
        // derived state from cart is passed to orderData, so we can clear cart in next screen
        
        navigate('/order-complete', { 
          state: { 
            order: orderData
          } 
        })
        setIsProcessing(false)
    }
  })

  // Debug: Log validation errors
  if (Object.keys(formik.errors).length > 0 && formik.submitCount > 0) {
      console.log('Checkout Validation Errors:', formik.errors)
  }

  // Format image URL helper
  const formatImageUrl = (path) => {
    if (!path || path === '') return pokemonLogo
    if (path.startsWith('http')) return path
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
    let serverBase = ''
    try {
      serverBase = new URL(apiBase).origin
    } catch (e) {
      serverBase = apiBase.split('/api')[0]
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${serverBase}${cleanPath}`
  }

  return (
    <div className="bg-background min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <button 
          onClick={() => navigate('/cart')}
          className="inline-flex items-center text-muted-foreground hover:text-white text-sm font-medium mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} className="mr-2" />
          BACK TO VAULT
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column - Shipping & Payment */}
          <div className="space-y-8">
            <form id="checkout-form" onSubmit={formik.handleSubmit}>
                {/* Shipping Identity */}
                <div>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-[#D4A017]/10 flex items-center justify-center text-[#D4A017]">
                    <Truck size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-white">Shipping Identity</h2>
                </div>
                
                <div className="space-y-4">
                    <div>
                    <label htmlFor="fullName" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Full Name
                    </label>
                    <Input 
                        id="fullName"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.fullName && formik.errors.fullName}
                        placeholder="John Alex"
                        className="bg-[#111C2E] border-white/5 focus:border-[#D4A017]"
                    />
                    </div>
                    <div>
                    <label htmlFor="address" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Delivery Address
                    </label>
                    <Input 
                        id="address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.address && formik.errors.address}
                        placeholder="123 Collector Lane"
                        className="bg-[#111C2E] border-white/5 focus:border-[#D4A017]"
                    />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                        City
                        </label>
                        <Input 
                        id="city"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.city && formik.errors.city}
                        placeholder="Neo-San Francisco"
                        className="bg-[#111C2E] border-white/5 focus:border-[#D4A017]"
                        />
                    </div>
                    <div>
                        <label htmlFor="zipCode" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Zip / Postal Code
                        </label>
                        <Input 
                        id="zipCode"
                        name="zipCode"
                        value={formik.values.zipCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.zipCode && formik.errors.zipCode}
                        placeholder="94103"
                        className="bg-[#111C2E] border-white/5 focus:border-[#D4A017]"
                        />
                    </div>
                    </div>
                </div>
                </div>
            </form>

            {/* Secure Payment Section (Payment Element Only) */}
            <div className="bg-[#0B1220] border border-white/5 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#D4A017]/10 flex items-center justify-center text-[#D4A017]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-white">Secure Payment</h2>
              </div>

              <PaymentElement 
                options={{
                  layout: 'tabs',
                  theme: 'night',
                  variables: {
                    colorPrimary: '#D4A017',
                    colorBackground: '#111C2E',
                    colorText: '#ffffff',
                    colorDanger: '#ef4444',
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    borderRadius: '8px',
                  }
                }}
              />
              
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {errorMessage}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-[#059669]/10 border border-[#059669]/20 rounded-xl">
              <Lock className="w-5 h-5 text-[#34D399]" />
              <span className="text-xs font-bold text-[#34D399] uppercase tracking-wider">
                Encrypted via Stripe Institutional Standard
              </span>
            </div>
          </div>

          {/* Right Column - Order Inventory */}
          <div>
            <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 lg:p-8 sticky top-24">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
                Order Inventory
              </h2>

              {/* Cart Items List */}
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-black/20 rounded-xl border border-white/5">
                    <div className="w-12 h-16 bg-[#0B1220] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img 
                        src={formatImageUrl(item.image)} 
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm truncate">{item.title}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                          QTY: {item.quantity}
                        </span>
                        <span className="text-[#D4A017] font-bold text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Subtotal</span>
                  <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Insured Shipping</span>
                  <span className="text-white font-bold">${shipping.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10 mb-8">
                <span className="text-white font-bold text-lg">Grand Total</span>
                <span className="text-[#D4A017] text-2xl font-bold">${total.toFixed(2)}</span>
              </div>
              
              {/* Authorize Payment Button - Triggers Form Submission */}
              <Button 
                onClick={() => {
                  console.log('Authorize Payment Clicked')
                  formik.handleSubmit()
                }}
                disabled={!stripe || isProcessing}
                className="w-full bg-secondary hover:bg-secondary/90 text-black font-bold py-4 text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors"
                type="button"
              >
                {isProcessing ? 'Processing...' : `Authorize Payment`}
                {!isProcessing && <ArrowRight size={18} />}
              </Button>
              
              {/* Validation Error Message */}
              {Object.keys(formik.errors).length > 0 && formik.submitCount > 0 && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                   <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <span className="text-red-500 font-bold text-xs">!</span>
                   </div>
                   <p className="text-red-400 text-xs font-medium">
                     Please correct the errors in the Shipping Identity form before proceeding.
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutContent
