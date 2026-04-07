/**
 * NotificationDropdown
 * Shared component used in Buyer Header, Seller Header, and Admin Header.
 * Polls every 30 seconds. Matches the design in the provided screenshot.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, Clock, Store, Package, TrendingUp, ShieldAlert, CheckCircle2, ShoppingBag } from 'lucide-react'
import notificationService from '@/services/notificationService'

const POLL_INTERVAL_MS = 30000 // 30 seconds

const TYPE_CONFIG = {
  // Buyer
  order_placed:    { icon: ShoppingBag,  color: 'text-blue-400',    bg: 'bg-blue-500/10' },
  order_confirmed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  order_shipped:   { icon: Package,      color: 'text-[#D4A017]',   bg: 'bg-[#D4A017]/10' },
  order_delivered: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  // Seller
  new_sale:        { icon: ShoppingBag,  color: 'text-[#D4A017]',   bg: 'bg-[#D4A017]/10' },
  payout_processed:{ icon: TrendingUp,   color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  // Admin
  new_seller:      { icon: Store,        color: 'text-blue-400',    bg: 'bg-blue-500/10' },
  new_order:       { icon: Package,      color: 'text-purple-400',  bg: 'bg-purple-500/10' },
  payout_failed:   { icon: ShieldAlert,  color: 'text-red-400',     bg: 'bg-red-500/10' },
}

const getTimeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef(null)
  const intervalRef = useRef(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationService.getMyNotifications()
      if (res?.success) {
        setNotifications(res.data || [])
        setUnreadCount(res.unreadCount || 0)
      }
    } catch (err) {
      // Silently fail — notifications are non-critical
    }
  }, [])

  // Initial fetch + polling
  useEffect(() => {
    fetchNotifications()
    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL_MS)
    return () => clearInterval(intervalRef.current)
  }, [fetchNotifications])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpen = () => {
    setIsOpen(prev => !prev)
  }

  const handleMarkAllRead = async () => {
    try {
      setIsLoading(true)
      await notificationService.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Mark all read failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkOneRead = async (id) => {
    try {
      await notificationService.markOneRead(id)
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      // silent
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative text-muted-foreground hover:text-white transition-colors p-1"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-black">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-3 w-80 rounded-2xl overflow-hidden z-50 shadow-2xl border border-white/5"
          style={{ backgroundColor: '#0F1929' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <span className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase">
              Priority Alerts
            </span>
            <button
              onClick={handleMarkAllRead}
              disabled={isLoading || unreadCount === 0}
              className="text-[10px] text-[#D4A017] font-black tracking-[0.15em] uppercase hover:opacity-80 transition-opacity disabled:opacity-40 cursor-pointer"
            >
              Mark All Read
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={24} className="text-white/10 mx-auto mb-2" />
                <p className="text-muted-foreground text-xs">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const config = TYPE_CONFIG[notif.type] || {
                  icon: Bell,
                  color: 'text-muted-foreground',
                  bg: 'bg-white/5'
                }
                const Icon = config.icon
                return (
                  <div
                    key={notif._id}
                    onClick={() => !notif.isRead && handleMarkOneRead(notif._id)}
                    className={`flex items-start gap-4 px-5 py-4 border-b border-white/5 last:border-0 cursor-pointer transition-colors hover:bg-white/5 ${!notif.isRead ? 'bg-white/[0.02]' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                      <Icon size={18} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-bold leading-tight ${notif.isRead ? 'text-muted-foreground' : 'text-white'}`}>
                          {notif.title}
                        </p>
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock size={10} className="text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                          {getTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-white/5">
            <p className="text-[9px] text-muted-foreground font-black tracking-[0.25em] uppercase text-center">
              Notification Center
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
