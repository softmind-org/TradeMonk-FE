import { useState, useEffect, useCallback } from 'react'
import { Loader2, Save, FileText } from 'lucide-react'
import settingService from '@/services/settingService'

const TermsSettings = () => {
  const [buyerTerms, setBuyerTerms] = useState('')
  const [sellerTerms, setSellerTerms] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  const fetchTerms = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await settingService.getSettings()
      if (response?.success) {
        setBuyerTerms(response.data?.buyerTerms || '')
        setSellerTerms(response.data?.sellerTerms || '')
      }
    } catch (err) {
      console.error('Failed to fetch terms:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTerms()
  }, [fetchTerms])

  const handleSave = async (type) => {
    try {
      setIsSaving(true)
      setSaveMessage(null)

      const key = type === 'buyer' ? 'buyerTerms' : 'sellerTerms'
      const value = type === 'buyer' ? buyerTerms : sellerTerms

      const response = await settingService.updateSetting(key, value)
      if (response?.success) {
        setSaveMessage({ type: 'success', text: `${type === 'buyer' ? 'Buyer' : 'Seller'} Terms saved successfully.` })
      }
    } catch (err) {
      console.error('Failed to save terms:', err)
      setSaveMessage({ type: 'error', text: 'Failed to save. Please try again.' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="text-[#D4A017] animate-spin" />
        <span className="ml-3 text-muted-foreground text-sm">Loading Terms & Conditions…</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <FileText size={20} className="text-[#D4A017]" />
        <h1 className="text-xl font-bold text-white tracking-wide">Terms & Conditions</h1>
      </div>
      <p className="text-xs text-muted-foreground">
        Manage Terms & Conditions for Buyer and Seller accounts. These will be shown during registration.
      </p>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          saveMessage.type === 'success' 
            ? 'bg-[#4ADE80]/10 border border-[#4ADE80]/20 text-[#4ADE80]' 
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {saveMessage.text}
        </div>
      )}

      {/* Buyer Terms */}
      <div className="rounded-2xl p-6 border border-white/5" style={{ backgroundColor: '#111C2E' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Buyer Terms & Conditions</h2>
          <button
            onClick={() => handleSave('buyer')}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#D4A017] hover:bg-[#b58812] text-black font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Buyer Terms
          </button>
        </div>
        <textarea
          value={buyerTerms}
          onChange={(e) => setBuyerTerms(e.target.value)}
          placeholder="Enter Terms & Conditions for Buyers..."
          rows={12}
          className="w-full bg-[#0B1220]/50 border border-white/10 rounded-lg p-4 text-sm text-white focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] placeholder:text-white/20 resize-y"
        />
      </div>

      {/* Seller Terms */}
      <div className="rounded-2xl p-6 border border-white/5" style={{ backgroundColor: '#111C2E' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Seller Terms & Conditions</h2>
          <button
            onClick={() => handleSave('seller')}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#D4A017] hover:bg-[#b58812] text-black font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Seller Terms
          </button>
        </div>
        <textarea
          value={sellerTerms}
          onChange={(e) => setSellerTerms(e.target.value)}
          placeholder="Enter Terms & Conditions for Sellers..."
          rows={12}
          className="w-full bg-[#0B1220]/50 border border-white/10 rounded-lg p-4 text-sm text-white focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] placeholder:text-white/20 resize-y"
        />
      </div>
    </div>
  )
}

export default TermsSettings
