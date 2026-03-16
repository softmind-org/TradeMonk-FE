import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, FileText } from 'lucide-react'
import settingService from '@/services/settingService'

const TermsPage = () => {
  const { type } = useParams() // 'buyer' or 'seller'
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const label = type === 'seller' ? 'Seller' : 'Buyer'

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true)
        const response = await settingService.getSettings()
        if (response?.success) {
          const key = type === 'seller' ? 'sellerTerms' : 'buyerTerms'
          setContent(response.data?.[key] || '')
        }
      } catch (err) {
        console.error('Failed to fetch terms:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTerms()
  }, [type])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <Loader2 size={28} className="text-[#D4A017] animate-spin" />
        <span className="ml-3 text-muted-foreground text-sm">Loading…</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1220] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FileText size={24} className="text-[#D4A017]" />
          <h1 className="text-2xl font-bold text-white">{label} Terms & Conditions</h1>
        </div>

        <div
          className="rounded-2xl p-8 border border-white/5 text-sm text-white/80 leading-relaxed whitespace-pre-wrap"
          style={{ backgroundColor: '#111C2E' }}
        >
          {content || 'Terms & Conditions have not been published yet.'}
        </div>
      </div>
    </div>
  )
}

export default TermsPage
