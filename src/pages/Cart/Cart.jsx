/**
 * Cart Page
 */
import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@components/ui'
import { useCart, useAuth } from '@context'
import { ArrowLeft, ShieldCheck, ArrowRight, Store, AlertCircle } from 'lucide-react'
import CartItem from './CartItem'
import { pokemonLogo } from '@assets'
import settingService from '@/services/settingService'

const Cart = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { 
    items, 
    sellerGroups,
    sellerShippingCosts,
    itemCount, 
    subtotal, 
    shipping, 
    serviceFee,
    total,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    isLoading: cartLoading
  } = useCart()

  const [marketplaceMode, setMarketplaceMode] = useState('preparation')
  const [configLoading, setConfigLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingService.getSettings()
        if (res.success && res.data?.marketplaceMode) {
          setMarketplaceMode(res.data.marketplaceMode)
        }
      } catch (err) {
        console.error('Failed to load settings', err)
      } finally {
        setConfigLoading(false)
      }
    }
    fetchSettings()
  }, [])

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

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/cart' }} replace />
  }

  if (authLoading || cartLoading || configLoading) {
    return (
      <div className="bg-background min-h-screen py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-6 w-40 bg-gray-700/50 rounded animate-pulse mb-8"></div>
          <div className="h-10 w-64 bg-gray-700/50 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-32 bg-gray-700/20 rounded-xl animate-pulse"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-700/20 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link 
            to="/marketplace" 
            className="inline-flex items-center text-muted-foreground hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            RETURN TO GALLERY
          </Link>

          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Vault is Empty</h2>
            <p className="text-muted-foreground mb-8">Start adding rare cards to your collection!</p>
            <Button 
              onClick={() => navigate('/marketplace')}
              className="bg-secondary hover:bg-secondary/90 text-black font-bold px-8"
            >
              Browse Marketplace
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Link 
          to="/marketplace" 
          className="inline-flex items-center text-muted-foreground hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          RETURN TO GALLERY
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Your Vault</h1>
          <span className="bg-secondary text-black text-xs font-bold px-3 py-1 rounded-full">
            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Items grouped by seller */}
          <div className="lg:col-span-2 space-y-6">
            {sellerGroups.map((group, groupIdx) => (
              <div key={group.sellerId} className="space-y-3">
                {/* Seller Header */}
                <div className="flex items-center gap-3 px-1">
                  <div className="w-7 h-7 rounded-lg bg-[#D4A017]/10 flex items-center justify-center">
                    <Store size={14} className="text-[#D4A017]" />
                  </div>
                  <span className="text-white font-bold text-sm uppercase tracking-wider">
                    {group.sellerName}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    ({group.items.length} {group.items.length === 1 ? 'item' : 'items'})
                  </span>
                </div>
                
                {/* Items in this group */}
                <div className="space-y-3">
                  {group.items.map(item => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onIncrement={incrementQuantity}
                      onDecrement={decrementQuantity}
                      onRemove={removeFromCart}
                      formatImageUrl={formatImageUrl}
                    />
                  ))}
                </div>

                {/* Per-seller shipping note */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0B1220] rounded-lg border border-white/5">
                  <span className="text-xs text-muted-foreground font-medium">
                    Insured Shipping — Package {groupIdx + 1}
                  </span>
                  <span className="text-white text-xs font-bold">
                    €{(sellerShippingCosts[group.sellerId] ?? 0.00).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Subtotal ({itemCount} items)</span>
                  <span className="text-white font-medium">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Shipping ({sellerGroups.length} {sellerGroups.length === 1 ? 'package' : 'packages'})
                  </span>
                  <span className="text-white font-medium">€{shipping.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border mb-6">
                <span className="text-white font-bold">Total</span>
                <span className="text-secondary text-2xl font-bold">€{total.toFixed(2)}</span>
              </div>

              {marketplaceMode === 'preparation' ? (
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-4 text-center">
                  <div className="flex justify-center mb-2">
                    <AlertCircle className="text-orange-500" size={20} />
                  </div>
                  <h3 className="text-orange-500 font-bold text-sm mb-1 uppercase tracking-wider">Preparation Mode</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    The marketplace is currently in preparation mode. Sellers are onboarding but checkout is temporarily disabled.
                  </p>
                </div>
              ) : null}

              <Button 
                onClick={() => navigate('/checkout')}
                disabled={marketplaceMode === 'preparation'}
                className="w-full bg-secondary hover:bg-secondary/90 text-black font-bold py-4 text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </Button>

              <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground">
                <ShieldCheck size={16} className="text-secondary" />
                <span className="text-xs font-bold uppercase tracking-wider">Secure Stripe Checkout</span>
              </div>

              <p className="text-[10px] text-muted-foreground/60 text-center mt-4 leading-relaxed">
                Platform commission and professional grading fees included in the total price.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
