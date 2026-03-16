import { useAuth } from '@/context'
import { useLogout } from '@/hooks/useLogout'
import { 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  Heart, 
  LayoutDashboard,
  ChevronRight,
  LogOut
} from 'lucide-react'

const BuyerProfile = () => {
  const { user } = useAuth()
  const { mutate: logout } = useLogout()

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
          title: 'Seller Dashboard',
          description: 'Convert to selling account',
          link: '/seller/dashboard'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#0B1220] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Profile Header Card */}
        <div className="bg-[#161F2E] border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="w-32 h-32 rounded-3xl bg-[#D4A01733] border border-[#D4A01766] flex items-center justify-center relative z-10 shrink-0">
            <span className="text-[#D4A017] text-4xl font-black">
              {(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 text-center md:text-left relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user?.fullName || 'User'}</h1>
            <p className="text-muted-foreground text-sm md:text-base mb-4">
              Collector since {new Date(user?.createdAt || Date.now()).getFullYear()} • Verified Elite Member
            </p>
            <div className="inline-flex items-center gap-2 bg-[#10B9811A] border border-[#10B98133] rounded-full px-4 py-1.5">
              <Shield className="w-4 h-4 text-[#10B981]" />
              <span className="text-[#10B981] text-[10px] font-bold tracking-wider uppercase">Identity Verified</span>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
    </div>
  )
}

export default BuyerProfile
