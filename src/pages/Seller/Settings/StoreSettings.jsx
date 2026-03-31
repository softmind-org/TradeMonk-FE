import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Edit2, Check, CreditCard, Loader2, ExternalLink, AlertCircle, CheckCircle2, ChevronLeft, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui'
import stripeService from '@/services/stripeService'
import { loadConnectAndInitialize } from '@stripe/connect-js'
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
} from '@stripe/react-connect-js'
import userService from '@/services/userService'
import WarehouseAddressForm from './components/WarehouseAddressForm'
import { useAuth } from '@/context/AuthContext'

// Helper to format S3 image URLs when relative paths are returned instead of signed absolute paths
const formatImageUrl = (path) => {
  if (!path || path === '') return ''
  if (path.startsWith('http')) return path
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
  let serverBase = ''
  try { serverBase = new URL(apiBase).origin }
  catch { serverBase = apiBase.split('/api')[0] }
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${serverBase}${cleanPath}`
}

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLIC_KEY

// Country options for the registration form
const COUNTRIES = [
  { code: 'NL', name: 'Netherlands' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'IE', name: 'Ireland' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PL', name: 'Poland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'NO', name: 'Norway' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'JP', name: 'Japan' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
]

const BUSINESS_TYPES = [
  { value: 'individual', label: 'Individual/Sole Proprietor' },
  { value: 'company', label: 'Company' },
  { value: 'non_profit', label: 'Non-Profit' },
]

const StoreSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, updateUser } = useAuth()

  // Merchant Profile
  const [storeLogo, setStoreLogo] = useState('')
  const [storeName, setStoreName] = useState('')
  const [storeDescription, setStoreDescription] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [warehouseAddress, setWarehouseAddress] = useState({
    contactName: '',
    phone: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: 'NL'
  })
  
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const fileInputRef = useRef(null)

  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isEditingWarehouse, setIsEditingWarehouse] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' })

  // Stripe Connect State
  const [stripeStatus, setStripeStatus] = useState({
    connected: false,
    onboardingComplete: false,
    payoutsEnabled: false,
    chargesEnabled: false,
  })
  const [isLoadingStripe, setIsLoadingStripe] = useState(true)
  const [stripeError, setStripeError] = useState(null)
  const [stripeSuccess, setStripeSuccess] = useState(null)

  // Multi-step flow: 'initial' | 'register' | 'onboarding' | 'connected'
  const [step, setStep] = useState('initial')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Registration form
  const [country, setCountry] = useState('NL')
  const [businessType, setBusinessType] = useState('individual')

  // Stripe Connect embedded instance
  const [stripeConnectInstance, setStripeConnectInstance] = useState(null)
  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(false)

  // Fetch Profile and Stripe status on mount
  useEffect(() => {
    fetchProfile()
    fetchStripeStatus()

    // Handle return from Stripe (for account-link fallback)
    const stripeParam = searchParams.get('stripe')
    if (stripeParam === 'success') {
      setStripeSuccess('Stripe onboarding completed successfully!')
      setSearchParams({}, { replace: true })
      fetchStripeStatus()
    }
    if (stripeParam === 'refresh') {
      setStripeError('Your onboarding link expired. Please try again.')
      setSearchParams({}, { replace: true })
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await userService.getProfile()
      if (res?.success && res.data) {
        setStoreName(res.data.storeName || '')
        setUserEmail(res.data.email || '')
        if (res.data.storeLogo) {
          setStoreLogo(res.data.storeLogo)
        }
        // Store description if we ever add it to backend: setStoreDescription(res.data.storeDescription || '')
        if (res.data.warehouseAddress) {
          setWarehouseAddress(res.data.warehouseAddress)
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  const fetchStripeStatus = async () => {
    try {
      setIsLoadingStripe(true)
      const response = await stripeService.getAccountStatus()
      if (response?.success) {
        const status = {
          connected: response.connected ?? false,
          onboardingComplete: response.onboardingComplete ?? false,
          payoutsEnabled: response.payoutsEnabled ?? false,
          chargesEnabled: response.chargesEnabled ?? false,
        }
        setStripeStatus(status)

        // Determine the correct step
        if (status.connected && status.payoutsEnabled && status.onboardingComplete) {
          setStep('connected')
        } else if (status.connected && !status.onboardingComplete) {
          setStep('onboarding')
          // Auto-initialize embedded onboarding
          initializeEmbeddedOnboarding()
        } else {
          setStep('initial')
        }
      }
    } catch (err) {
      console.error('Failed to fetch Stripe status:', err)
    } finally {
      setIsLoadingStripe(false)
    }
  }

  // Initialize the Stripe Connect embedded onboarding instance
  const initializeEmbeddedOnboarding = useCallback(async () => {
    if (stripeConnectInstance) return // Already initialized

    try {
      setIsLoadingOnboarding(true)
      const instance = await loadConnectAndInitialize({
        publishableKey: STRIPE_PK,
        fetchClientSecret: async () => {
          const response = await stripeService.createAccountSession()
          if (response?.success && response?.clientSecret) {
            return response.clientSecret
          }
          throw new Error('Failed to get client secret')
        },
        appearance: {
          overlays: 'dialog',
          variables: {
            colorPrimary: '#635BFF',
            colorBackground: '#111C2E', // Dark background matching the card
            colorText: '#ffffff', // White text
            colorDanger: '#ef4444',
            borderRadius: '8px',
            fontFamily: 'Inter, system-ui, sans-serif',
            controlHeight: '44px',
            actionColorText: '#ffffff',
          },
          rules: {
            '.Input': {
              backgroundColor: '#0B1220', // Darker input background
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
            },
            '.Label': {
              color: '#94a3b8', // Muted foreground text
            },
          }
        },
      })
      setStripeConnectInstance(instance)
    } catch (err) {
      console.error('Failed to initialize embedded onboarding:', err)
      setStripeError('Failed to load Stripe onboarding. Please try again.')
    } finally {
      setIsLoadingOnboarding(false)
    }
  }, [stripeConnectInstance])

  // Step 1 → Step 2: Show registration form
  const handleShowRegisterForm = () => {
    setStep('register')
    setStripeError(null)
  }

  // Step 2: Create Stripe account and move to Step 3
  const handleCreateAccount = async () => {
    try {
      setIsSubmitting(true)
      setStripeError(null)

      const response = await stripeService.createConnectAccount({
        country,
        businessType,
      })

      if (response?.success) {
        setStep('onboarding')
        // Initialize embedded onboarding
        await initializeEmbeddedOnboarding()
      } else {
        setStripeError('Failed to create Stripe account. Please try again.')
      }
    } catch (err) {
      console.error('Stripe account creation error:', err)
      if (err.message?.includes('already exists')) {
        // Account already exists - move to onboarding
        setStep('onboarding')
        await initializeEmbeddedOnboarding()
      } else {
        setStripeError(err.message || 'Failed to create Stripe account.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle embedded onboarding completion
  const handleOnboardingExit = () => {
    setStripeSuccess('Stripe setup completed! Checking your account status...')
    // Re-fetch status to update UI
    fetchStripeStatus()
  }

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingLogo(true)
      const formData = new FormData()
      formData.append('storeLogo', file)
      
      const res = await userService.updateProfile(formData)
      if (res?.success && res.data) {
        setStoreLogo(res.data.storeLogo)
        if (user && updateUser) {
           updateUser({ ...user, storeLogo: res.data.storeLogo })
        }
        setProfileMessage({ type: 'success', text: 'Store logo updated successfully' })
      }
    } catch (error) {
      console.error('Failed to update logo:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update store logo'
      setProfileMessage({ type: 'error', text: errorMsg })
    } finally {
      setIsUploadingLogo(false)
      // reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = ''
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleNameSave = async () => {
    try {
      setIsSavingProfile(true)
      await userService.updateProfile({ storeName: storeName })
      setIsEditingName(false)
      setProfileMessage({ type: 'success', text: 'Store name updated successfully' })
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Failed to update store name' })
    } finally {
      setIsSavingProfile(false)
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleDescriptionSave = async () => {
    // Description isn't actively saved to backend yet in MVP, but we can close it
    setIsEditingDescription(false)
  }

  const handleWarehouseSave = async () => {
    try {
      setIsSavingProfile(true)
      await userService.updateProfile({ warehouseAddress: warehouseAddress })
      setIsEditingWarehouse(false)
      setProfileMessage({ type: 'success', text: 'Warehouse address updated successfully' })
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Failed to update warehouse address' })
    } finally {
      setIsSavingProfile(false)
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000)
    }
  }

  // Render the payment section based on current step
  const renderPaymentSection = () => {
    if (isLoadingStripe) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-[#635BFF] animate-spin" />
          <span className="ml-3 text-muted-foreground text-sm">Checking Stripe status...</span>
        </div>
      )
    }

    switch (step) {
      case 'initial':
        return renderNotConnected()
      case 'register':
        return renderRegistrationForm()
      case 'onboarding':
        return renderEmbeddedOnboarding()
      case 'connected':
        return renderConnected()
      default:
        return renderNotConnected()
    }
  }

  // State 1: Not Connected
  const renderNotConnected = () => (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#635BFF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <CreditCard size={24} className="text-[#635BFF]" />
        </div>
        <div>
          <h3 className="text-white font-bold text-base mb-1">Connect with Stripe</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Set up your Stripe Express account to start receiving payments securely and efficiently.
          </p>
        </div>
      </div>

      <Button
        onClick={handleShowRegisterForm}
        className="bg-[#635BFF] hover:bg-[#635BFF]/90 text-white font-bold px-8 py-3 text-sm uppercase tracking-wide w-full sm:w-auto"
      >
        Connect with Stripe
      </Button>

      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Check size={14} className="text-[#635BFF]" />
          <span>Secure Setup</span>
        </div>
        <div className="flex items-center gap-2">
          <Check size={14} className="text-[#635BFF]" />
          <span>Global Payments</span>
        </div>
        <div className="flex items-center gap-2">
          <Check size={14} className="text-[#635BFF]" />
          <span>Quick Payouts</span>
        </div>
      </div>
    </div>
  )

  // State 2: Registration Form
  const renderRegistrationForm = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setStep('initial')}
          className="text-muted-foreground hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h3 className="text-white font-bold text-base">Connect with Stripe</h3>
          <p className="text-muted-foreground text-xs">Set up your Stripe Express account to start accepting payments</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Email (read-only, from user account) */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
            Email Address
          </label>
          <div className="bg-[#0B1220]/80 border border-white/10 rounded-lg px-4 py-3 text-white/60 text-sm">
            {userEmail || 'Loading email...'}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
            Country
          </label>
          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#635BFF] transition-colors"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Business Type */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
            Business Type
          </label>
          <div className="relative">
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#635BFF] transition-colors"
            >
              {BUSINESS_TYPES.map((bt) => (
                <option key={bt.value} value={bt.value}>{bt.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={handleCreateAccount}
        disabled={isSubmitting}
        className="bg-[#635BFF] hover:bg-[#635BFF]/90 text-white font-bold px-8 py-3 text-sm uppercase tracking-wide w-full"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin mr-2" />}
        {isSubmitting ? 'Creating Account...' : 'Create Stripe Account'}
      </Button>
    </div>
  )

  // State 3: Embedded Onboarding
  const renderEmbeddedOnboarding = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-bold text-base">Complete Your Setup</h3>
          <span className="text-muted-foreground text-xs">Step 2 of 2</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Complete your account setup with Stripe to start accepting payments.
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-[#635BFF]/5 border border-[#635BFF]/20 rounded-xl p-4">
        <p className="text-[#a5a0ff] text-sm">
          Complete your account setup with Stripe to start accepting payments. This process is secure and handled directly by Stripe.
        </p>
      </div>

      {/* Embedded Stripe Connect Onboarding */}
      {isLoadingOnboarding || !stripeConnectInstance ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-[#635BFF] animate-spin" />
          <span className="ml-3 text-muted-foreground text-sm">Loading Stripe onboarding...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden">
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <ConnectAccountOnboarding
              onExit={handleOnboardingExit}
            />
          </ConnectComponentsProvider>
        </div>
      )}
    </div>
  )

  // State 4: Fully Connected
  const renderConnected = () => (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#635BFF] rounded-xl flex items-center justify-center">
          <CreditCard size={24} className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-white font-bold text-sm">Stripe Account Connected</h3>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              <CheckCircle2 size={12} /> Active
            </span>
          </div>
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">
            Payouts Enabled
          </p>
        </div>
      </div>
      <Button
        onClick={async () => {
          try {
            setIsSubmitting(true)
            const response = await stripeService.createAccountLink()
            if (response?.success && response?.url) {
              window.location.href = response.url
            }
          } catch (err) {
            setStripeError(err.message || 'Failed to open account management.')
          } finally {
            setIsSubmitting(false)
          }
        }}
        disabled={isSubmitting}
        className="bg-[#0B1220] hover:bg-[#0B1220]/80 text-white border border-white/10 font-bold text-sm px-6 py-2"
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin mr-2" /> : <ExternalLink size={14} className="mr-2" />}
        Manage Account
      </Button>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Success Banner */}
      {stripeSuccess && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-emerald-300 text-sm font-medium">{stripeSuccess}</p>
          <button onClick={() => setStripeSuccess(null)} className="ml-auto text-emerald-400/60 hover:text-emerald-400">✕</button>
        </div>
      )}

      {/* Error Banner */}
      {stripeError && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm font-medium">{stripeError}</p>
          <button onClick={() => setStripeError(null)} className="ml-auto text-red-400/60 hover:text-red-400">✕</button>
        </div>
      )}

      {/* Profile Messages Banner */}
      {profileMessage.text && (
        <div className={`flex items-center gap-3 p-4 rounded-xl animate-fade-in ${
          profileMessage.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/20' 
            : 'bg-red-500/10 border border-red-500/20'
        }`}>
          {profileMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <p className={`text-sm font-medium ${
            profileMessage.type === 'success' ? 'text-emerald-300' : 'text-red-300'
          }`}>{profileMessage.text}</p>
          <button onClick={() => setProfileMessage({ type: '', text: '' })} className={`ml-auto ${
            profileMessage.type === 'success' ? 'text-emerald-400/60 hover:text-emerald-400' : 'text-red-400/60 hover:text-red-400'
          }`}>✕</button>
        </div>
      )}

      {/* Merchant Profile Section */}
      <div className="space-y-6">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Merchant Profile
        </h2>

        <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          {/* Store Logo */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#D4A017] rounded-xl flex items-center justify-center overflow-hidden">
               {storeLogo ? (
                  <img src={formatImageUrl(storeLogo)} alt="Store Logo" className="w-full h-full object-cover" />
               ) : (
                  <span className="text-black text-2xl font-black">{storeName ? storeName.charAt(0).toUpperCase() : 'S'}</span>
               )}
            </div>
            <div>
               <Button 
                 onClick={() => fileInputRef.current?.click()} 
                 disabled={isUploadingLogo}
                 className="bg-[#0B1220] hover:bg-[#0B1220]/80 text-white border border-white/10 font-bold text-sm px-4 py-2"
               >
                 {isUploadingLogo ? <Loader2 size={16} className="animate-spin mr-2 inline" /> : null}
                 Change Logo
               </Button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={handleLogoChange} 
               />
            </div>
          </div>

          {/* Store Display Name */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-3">
              Store Display Name
            </label>
            <div className="relative">
              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="flex-1 bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4A017] transition-colors"
                    autoFocus
                  />
                  <Button
                    onClick={handleNameSave}
                    className="bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-bold px-4"
                  >
                    <Check size={18} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3">
                  <span className="text-white font-medium">{storeName}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-[#D4A017] hover:text-[#D4A017]/80 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Store Description */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-3">
              Store Description
            </label>
            <div className="relative">
              {isEditingDescription ? (
                <div className="space-y-2">
                  <textarea
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4A017] transition-colors resize-none"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleDescriptionSave}
                      className="bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-bold px-6"
                    >
                      <Check size={18} className="mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 gap-4">
                  <p className="text-white text-sm leading-relaxed flex-1">{storeDescription || 'Add a description to tell buyers about your store.'}</p>
                  <button
                    onClick={() => setIsEditingDescription(true)}
                    className="text-[#D4A017] hover:text-[#D4A017]/80 transition-colors flex-shrink-0"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Address Section */}
      <WarehouseAddressForm 
         warehouseAddress={warehouseAddress}
         setWarehouseAddress={setWarehouseAddress}
         isEditingWarehouse={isEditingWarehouse}
         setIsEditingWarehouse={setIsEditingWarehouse}
         handleWarehouseSave={handleWarehouseSave}
         isSavingProfile={isSavingProfile}
         COUNTRIES={COUNTRIES}
      />

      {/* Payment Payouts Section */}
      <div className="space-y-6">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Payment Payouts
        </h2>

        <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-8">
          {renderPaymentSection()}
        </div>
      </div>
    </div>
  )
}

export default StoreSettings
