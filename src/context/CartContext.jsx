import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import cartService from '@/services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'trademonk_guest_cart'
const SHIPPING_COST = 15.00 // Fixed shipping cost per seller
const SERVICE_FEE_RATE = 0.015 // 1.5% Stripe processing fee
const SERVICE_FEE_FIXED = 0.25 // €0.25 fixed per transaction

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [sellerGroups, setSellerGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, user } = useAuth()

  // Load guest cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading guest cart:', error)
    } finally {
      if (!isAuthenticated) setIsLoading(false)
    }
  }, [isAuthenticated])

  // Save cart to localStorage whenever items change (for persistence and guests)
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Build seller groups from flat items (for guest mode)
  const buildSellerGroups = useCallback((flatItems) => {
    const groups = {}
    flatItems.forEach(item => {
      const sellerId = item.seller?.userId || item.seller || 'unknown'
      const sellerName = item.seller?.name || 'Unknown Seller'
      if (!groups[sellerId]) {
        groups[sellerId] = { sellerId, sellerName, items: [], subtotal: 0 }
      }
      groups[sellerId].items.push(item)
      groups[sellerId].subtotal += item.price * item.quantity
    })
    return Object.values(groups)
  }, [])

  // Fetch cart from backend (new seller-grouped response)
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)
      const response = await cartService.getCart()
      if (response?.success && response.sellers) {
        // Backend returns { sellers: [{ sellerId, sellerName, items: [{ _id, productId, quantity }] }] }
        // Transform each seller group's items into our flat items + keep groups
        const groups = response.sellers.map(group => ({
          sellerId: group.sellerId,
          sellerName: group.sellerName,
          subtotal: group.subtotal,
          items: group.items.map(item => ({
            cartItemId: item._id,
            id: item.productId?._id,
            title: item.productId?.title,
            price: item.productId?.price,
            image: item.productId?.images?.[0] || '',
            quantity: item.quantity,
            seller: item.productId?.seller,
            maxQuantity: item.productId?.quantity
          }))
        }))

        // Set seller groups directly from backend
        setSellerGroups(groups)

        // Flatten for backward compatibility (items array)
        const flatItems = groups.flatMap(g => g.items)
        setItems(flatItems)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  // Initial load
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Sync Local Cart to Backend on Login
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated && items.length > 0) {
        // Find items that don't have a cartItemId (local items)
        const localItems = items.filter(item => !item.cartItemId)
        if (localItems.length === 0) {
           fetchCart()
           return
        }

        setIsLoading(true)
        try {
          // Add each local item to backend
          for (const item of localItems) {
            await cartService.addToCart(item.id, item.quantity)
          }
          // After syncing all, fetch the final state from backend
          await fetchCart()
        } catch (error) {
          console.error('Error syncing cart:', error)
        } finally {
          setIsLoading(false)
        }
      } else if (isAuthenticated) {
        fetchCart()
      }
    }

    syncCart()
  }, [isAuthenticated]) // Only run on auth change

  // Add item to cart
  const addToCart = useCallback(async (product, quantity = 1) => {
    const productId = product.id || product._id
    
    // 1. Check stock limits
    const existingItem = items.find(item => item.id === productId)
    const newQuantity = (existingItem?.quantity || 0) + quantity
    if (product.quantity !== undefined && newQuantity > product.quantity) {
      alert(`Only ${product.quantity} items available in stock.`)
      return
    }

    if (isAuthenticated) {
      try {
        const response = await cartService.addToCart(productId, quantity)
        if (response?.success) {
          await fetchCart()
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
      }
    } else {
      // Guest mode: update local items
      setItems(prevItems => {
        const exists = prevItems.find(item => item.id === productId)
        if (exists) {
          return prevItems.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
          )
        }
        return [...prevItems, {
          id: productId,
          title: product.title,
          price: product.price,
          image: product.image || product.images?.[0],
          quantity: quantity,
          seller: product.seller,
          maxQuantity: product.quantity
        }]
      })
    }
  }, [isAuthenticated, fetchCart, items])

  // Remove item from cart
  const removeFromCart = useCallback(async (id, cartItemId) => {
    if (isAuthenticated && cartItemId) {
      try {
        const response = await cartService.removeFromCart(cartItemId)
        if (response?.success) {
          await fetchCart()
        }
      } catch (error) {
        console.error('Error removing from cart:', error)
      }
    } else {
      // Guest mode or cleanup
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }, [isAuthenticated, fetchCart])

  // Update item quantity
  const updateQuantity = useCallback(async (productId, quantity, cartItemId) => {
    if (quantity < 1) {
      await removeFromCart(productId, cartItemId)
      return
    }

    // Stock check
    const item = items.find(i => i.id === productId)
    if (item?.maxQuantity !== undefined && quantity > item.maxQuantity) {
        alert(`Limit reached: Only ${item.maxQuantity} available.`)
        return
    }
    
    if (isAuthenticated) {
      try {
        const response = await cartService.addToCart(productId, quantity)
        if (response?.success) {
          await fetchCart()
        }
      } catch (error) {
        console.error('Error updating quantity:', error)
      }
    } else {
      setItems(prev => prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }, [isAuthenticated, fetchCart, items, removeFromCart])

  // Increment quantity
  const incrementQuantity = useCallback(async (item) => {
    await updateQuantity(item.id, item.quantity + 1, item.cartItemId)
  }, [updateQuantity])

  // Decrement quantity
  const decrementQuantity = useCallback(async (item) => {
    await updateQuantity(item.id, item.quantity - 1, item.cartItemId)
  }, [updateQuantity])

  // Clear entire cart
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart()
        setItems([])
        setSellerGroups([])
      } catch (error) {
        console.error('Error clearing cart:', error)
      }
    } else {
      setItems([])
      setSellerGroups([])
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }, [isAuthenticated])

  // ── Computed seller groups for guest mode ──────────────────────
  // When not authenticated, build groups from flat items
  const computedSellerGroups = useMemo(() => {
    if (isAuthenticated && sellerGroups.length > 0) return sellerGroups
    if (items.length === 0) return []
    return buildSellerGroups(items)
  }, [isAuthenticated, sellerGroups, items, buildSellerGroups])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = computedSellerGroups.length > 0 ? computedSellerGroups.length * SHIPPING_COST : 0
  
  // Service fee is now absorbed by the seller/platform, so the buyer doesn't pay it directly
  const serviceFee = 0
  const total = subtotal + shipping

  // Help for product pages
  const isInCart = useCallback((productId) => {
    return items.some(item => item.id === productId)
  }, [items])

  const getItemQuantity = useCallback((productId) => {
    const item = items.find(i => i.id === productId)
    return item ? item.quantity : 0
  }, [items])

  const value = {
    items,
    sellerGroups: computedSellerGroups,
    itemCount,
    subtotal,
    shipping,
    serviceFee,
    total,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    fetchCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
