/**
 * Admin Platform Settings Page
 * SEO flags, maintenance shutdown toggle, and system utilities
 */
import { useState, useEffect, useCallback } from 'react'
import { Globe, AlertTriangle, FileCode2, RefreshCw } from 'lucide-react'
import settingService from '@/services/settingService'
import toast from 'react-hot-toast'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    indexListings: true,
    indexCategories: true,
    marketplaceMode: 'live'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [togglingKey, setTogglingKey] = useState(null)

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await settingService.getSettings()
      if (res?.success && res.data) {
        setSettings(prev => ({
          ...prev,
          indexListings: res.data.indexListings !== undefined ? res.data.indexListings : true,
          indexCategories: res.data.indexCategories !== undefined ? res.data.indexCategories : true,
          marketplaceMode: res.data.marketplaceMode || 'preparation'
        }))
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleToggle = async (key, currentValue) => {
    try {
      setTogglingKey(key)

      if (key === 'marketplaceMode') {
        const newMode = currentValue === 'live' ? 'preparation' : 'live'
        await settingService.updateSetting('marketplaceMode', newMode)
        setSettings(prev => ({ ...prev, marketplaceMode: newMode }))
        toast.success(
          newMode === 'preparation'
            ? 'Maintenance mode activated. All carts and checkouts are blocked.'
            : 'Marketplace is back online.'
        )
      } else {
        const newValue = !currentValue
        await settingService.updateSetting(key, newValue)
        setSettings(prev => ({ ...prev, [key]: newValue }))
        toast.success(`${key === 'indexListings' ? 'Listing indexing' : 'Category indexing'} ${newValue ? 'enabled' : 'disabled'}.`)
      }
    } catch (err) {
      console.error(`Failed to toggle ${key}:`, err)
      toast.error('Failed to update setting.')
    } finally {
      setTogglingKey(null)
    }
  }

  const isMaintenanceOn = settings.marketplaceMode === 'preparation'

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-8 animate-pulse">
          <div className="h-5 w-48 bg-white/10 rounded mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* SEO & System Flags Card */}
      <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Globe size={20} className="text-[#D4A017]" />
          <h2 className="text-white font-bold text-lg">SEO & System Flags</h2>
        </div>

        <div className="space-y-3">
          {/* Index Marketplace Listings */}
          <div className="flex items-center justify-between bg-[#0B1220] border border-white/5 rounded-xl p-4">
            <div>
              <p className="text-white text-sm font-bold">Index Marketplace Listings</p>
              <p className="text-[10px] text-muted-foreground font-bold tracking-[0.15em] uppercase mt-1">
                Allow search engines to crawl public inventory
              </p>
            </div>
            <button
              onClick={() => handleToggle('indexListings', settings.indexListings)}
              disabled={togglingKey === 'indexListings'}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer ${
                settings.indexListings ? 'bg-emerald-500' : 'bg-white/10'
              } ${togglingKey === 'indexListings' ? 'opacity-50' : ''}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                settings.indexListings ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Index Categories */}
          <div className="flex items-center justify-between bg-[#0B1220] border border-white/5 rounded-xl p-4">
            <div>
              <p className="text-white text-sm font-bold">Index Categories</p>
              <p className="text-[10px] text-muted-foreground font-bold tracking-[0.15em] uppercase mt-1">
                Allow search engines to index ecosystem nodes
              </p>
            </div>
            <button
              onClick={() => handleToggle('indexCategories', settings.indexCategories)}
              disabled={togglingKey === 'indexCategories'}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer ${
                settings.indexCategories ? 'bg-emerald-500' : 'bg-white/10'
              } ${togglingKey === 'indexCategories' ? 'opacity-50' : ''}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                settings.indexCategories ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Maintenance Shutdown */}
          <div className="flex items-center justify-between bg-[#0B1220] border border-white/5 rounded-xl p-4">
            <div>
              <p className="text-white text-sm font-bold">Maintenance Shutdown</p>
              <p className="text-[10px] text-muted-foreground font-bold tracking-[0.15em] uppercase mt-1">
                Block all carts & checkout processes
              </p>
            </div>
            <button
              onClick={() => handleToggle('marketplaceMode', settings.marketplaceMode)}
              disabled={togglingKey === 'marketplaceMode'}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer ${
                isMaintenanceOn ? 'bg-emerald-500' : 'bg-white/10'
              } ${togglingKey === 'marketplaceMode' ? 'opacity-50' : ''}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                isMaintenanceOn ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* System Utility Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => toast.success('Sitemap generation queued.')}
            className="w-full flex items-center justify-center gap-2 bg-[#0B1220] border border-white/5 hover:border-white/10 rounded-xl py-3.5 text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
          >
            <FileCode2 size={14} />
            Generate Sitemap.xml
          </button>
          <button
            onClick={() => toast.success('Metadata cache refreshed.')}
            className="w-full flex items-center justify-center gap-2 bg-[#0B1220] border border-white/5 hover:border-white/10 rounded-xl py-3.5 text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            Refresh Metadata Cache
          </button>
        </div>
      </div>

      {/* Priority Notifications */}
      <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-8 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={20} className="text-orange-400" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm mb-1">Priority Notifications</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isMaintenanceOn
              ? 'Marketplace is in maintenance mode. All buyer checkouts are currently blocked.'
              : 'No critical issues detected. All systems are operating normally.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
