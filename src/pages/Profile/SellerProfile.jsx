import { useState, useEffect } from 'react'
import { useAuth } from '@/context'
import { useLogout } from '@/hooks/useLogout'
import userService from '@/services/userService'
import { 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  Heart, 
  LayoutDashboard,
  ChevronRight,
  LogOut,
  Star,
  TrendingUp,
  Package,
  Users
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatImageUrl } from '@/utils/imageUtils'

const SellerProfile = () => {
  const { user } = useAuth()
  const { mutate: logout } = useLogout()
  const [statsData, setStatsData] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await userService.getMyStats()
        if (response?.data) {
          setStatsData(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch seller profile stats:', error)
      }
    }
    fetchStats()
  }, [])

  const formatStatsValue = (val) => {
    if (!val) return '0'
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`
    return val.toString()
  }

  const stats = [
    {
      label: 'TOTAL SALES',
      value: `€${formatStatsValue(statsData?.totalSalesNet)}` || '€0',
      icon: <span className="text-[#10B981]">€</span>,
      iconBg: 'bg-[#10B9811A]'
    },
    {
      label: 'ACTIVE LISTINGS',
      value: statsData?.activeListings?.toString() || '0',
      icon: <Package className="w-5 h-5 text-[#3B82F6]" />,
      iconBg: 'bg-[#3B82F61A]'
    },
    {
      label: 'ORDERS',
      value: (statsData?.totalPurchases || 0).toString(), // Assuming this represents history
      icon: <TrendingUp className="w-5 h-5 text-[#A855F7]" />,
      iconBg: 'bg-[#A855F71A]'
    },
    {
      label: 'FOLLOWERS',
      value: statsData?.followers?.toString() || '0',
      icon: <Users className="w-5 h-5 text-[#F59E0B]" />,
      iconBg: 'bg-[#F59E0B1A]'
    }
  ]

  const sections = [
    {
      title: 'ACCOUNT & SECURITY',
      items: [
        {
          icon: User,
          title: 'Personal Information',
          description: 'Manage your name and data',
          link: '#'
        },
        {
          icon: Shield,
          title: 'Privacy & Security',
          description: '2FA and login sessions',
          link: '#'
        },
        {
          icon: CreditCard,
          title: 'Payment Methods',
          description: 'Saved Stripe cards',
          link: '#'
        },
        {
          icon: Bell,
          title: 'Notification Settings',
          description: 'Price drops and arrivals',
          link: '#'
        }
      ]
    },
    {
      title: 'MARKETPLACE TOOLS',
      items: [
        {
          icon: Heart,
          title: 'Wishlist Gallery',
          description: '12 cards saved for later',
          link: '#'
        },
        {
          icon: LayoutDashboard,
          title: 'Buyer Dashboard',
          description: 'Convert to buying account',
          link: '/'
        }
      ]
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Profile Header Card */}
      <div className="bg-[#161F2E] border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="w-32 h-32 rounded-3xl bg-[#D4A01733] border border-[#D4A01766] flex items-center justify-center relative z-10 shrink-0 overflow-hidden">
            {user?.storeLogo ? (
              <img src={formatImageUrl(user.storeLogo)} alt="Seller Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#D4A017] text-4xl font-black">
                {(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 text-center md:text-left relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{user?.fullName || 'User'}</h1>
              <div className="inline-flex self-center md:self-auto items-center gap-1.5 bg-[#D4A0171A] border border-[#D4A01733] rounded-full px-3 py-1">
                <Star className="w-3 h-3 text-[#D4A017] fill-[#D4A017]" />
                <span className="text-[#D4A017] text-[10px] font-bold tracking-wider uppercase">
                  {user?.sellerType === 'professional' ? 'Professional' : 'Private'}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm md:text-base mb-6">
              Merchant since {new Date(user?.createdAt || Date.now()).getFullYear()} • Top Rated Seller
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="inline-flex items-center gap-2 bg-[#10B9811A] border border-[#10B98133] rounded-full px-4 py-1.5">
                <Shield className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#10B981] text-[10px] font-bold tracking-wider uppercase">Identity Verified</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-[#F59E0B1A] border border-[#F59E0B33] rounded-full px-4 py-1.5">
                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-[#F59E0B] text-[10px] font-bold tracking-wider uppercase">4.9 Rating</span>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <Link to="/seller/settings" className="bg-[#1E293B] hover:bg-[#2A374A] text-white text-[10px] font-bold tracking-[0.1em] px-8 py-4 rounded-xl border border-white/5 transition-colors uppercase">
              Manage Store
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#161F2E] border border-white/5 rounded-2xl p-6 text-center">
              <div className={`w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-xl ${stat.iconBg}`}>
                {stat.icon}
              </div>
              <p className="text-[#94A3B8] text-[9px] font-bold tracking-widest uppercase mb-1">{stat.label}</p>
              <p className="text-white text-xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h2 className="text-[#94A3B8] text-[10px] font-bold tracking-widest uppercase pl-2">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <a
                    key={itemIdx}
                    href={item.link}
                    className="flex items-center gap-5 p-5 bg-[#161F2E] border border-white/5 rounded-2xl hover:bg-white/[0.03] hover:border-white/10 transition-all group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.03] text-[#94A3B8] group-hover:text-white transition-colors">
                      <item.icon size={22} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                      <p className="text-[#94A3B8] text-xs">{item.description}</p>
                    </div>
                    <ChevronRight size={18} className="text-[#94A3B8] group-hover:text-white transition-colors" />
                  </a>
                ))}

                {idx === 1 && (
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-5 p-5 bg-[#FF5D5D05] border border-[#FF5D5D1A] rounded-2xl hover:bg-[#FF5D5D10] hover:border-[#FF5D5D40] transition-all group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#FF5D5D10] text-[#FF5D5D]">
                      <LogOut size={22} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-[#FF5D5D] font-bold text-sm tracking-wider uppercase">Sign Out from Session</h3>
                    </div>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}

export default SellerProfile
