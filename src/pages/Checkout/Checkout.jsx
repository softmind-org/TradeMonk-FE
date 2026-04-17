/**
 * Checkout Page Wrapper
 * Wraps content in Stripe Elements provider
 */
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import { useCart, useAuth } from '@context'
import CheckoutContent from './CheckoutContent'

// Initialize Stripe using the environment variable
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(STRIPE_KEY);

const Checkout = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { items, total } = useCart()

  // Redirect if cart is empty or user not logged in
  if (!authLoading && !isAuthenticated) return <Navigate to="/login" replace />
  if (items.length === 0) return <Navigate to="/marketplace" replace />

  // Mock Element options for development
  const options = {
    mode: 'payment',
    amount: Math.round(total > 0 ? total * 100 : 100), // ensure amount > 0, convert to cents
    currency: 'eur',
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#D4A017',
        colorBackground: '#111C2E',
        colorText: '#ffffff',
      },
    },
  }

  return (
    <>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutContent />
      </Elements>
    </>
  )
}

export default Checkout
