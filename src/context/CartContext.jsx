/**
 * Cart Context
 * Manages cart state with localStorage persistence
 * Ready for future API integration
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'trademonk_cart'
const SHIPPING_COST = 15.00 // Fixed shipping cost

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      console.log('Cart updated:', items)
    }
  }, [items, isLoading])

  // Add item to cart
  const addToCart = useCallback((product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // limit quantity to 10 for now as per requirement (or stock if available)
        const newQuantity = existingItem.quantity + 1
        if (newQuantity > (product.maxQuantity || 10)) {
            console.warn('Max quantity reached for:', product.title)
            return prevItems
        }

        // Update quantity if item exists
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
      
      // Add new item with quantity 1
      console.log('Adding to cart:', product)
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }, [])

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId))
  }, [])

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }, [removeFromCart])

  // Increment quantity
  const incrementQuantity = useCallback((productId) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }, [])

  // Decrement quantity
  const decrementQuantity = useCallback((productId) => {
    setItems(prevItems => {
      const item = prevItems.find(i => i.id === productId)
      if (item && item.quantity <= 1) {
        return prevItems.filter(i => i.id !== productId)
      }
      return prevItems.map(i =>
        i.id === productId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    })
  }, [])

  // Clear entire cart
  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // Calculate totals
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = items.length > 0 ? SHIPPING_COST : 0
  const total = subtotal + shipping

  // Check if item is in cart
  const isInCart = useCallback((productId) => {
    return items.some(item => item.id === productId)
  }, [items])

  // Get item quantity
  const getItemQuantity = useCallback((productId) => {
    const item = items.find(i => i.id === productId)
    return item ? item.quantity : 0
  }, [items])

  const value = {
    items,
    itemCount,
    subtotal,
    shipping,
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
