import { Eye, UserX, UserCheck } from 'lucide-react'

const get = (row, path) => path.split('.').reduce((o, k) => o?.[k], row)

/* ── Stripe Connect Badge ── */
const StripeBadge = ({ connected }) => {
  if (connected) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-4 h-4 rounded-full border-2 border-[#4ADE80] flex items-center justify-center">
          <span className="text-[#4ADE80] text-[8px]">✓</span>
        </span>
        <span className="text-[11px] font-bold text-[#4ADE80] uppercase tracking-wider">Connected</span>
      </div>
    )
  }
  return (
    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
      Pending
    </span>
  )
}

/* ── Action Icon Button ── */
const ActionBtn = ({ icon: Icon, onClick, className = '' }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation()
      onClick?.()
    }}
    className={`p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors ${className}`}
  >
    <Icon size={16} />
  </button>
)

/* ── Column Definitions ── */
export const ADMIN_SELLERS_COLUMNS = ({ onView, onToggleStatus }) => [
  {
    key: 'merchantEntity',
    label: 'Merchant Entity',
    width: '260px',
    render: (row) => {
      const initials = row.fullName ? row.fullName.charAt(0).toUpperCase() : 'S'
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D4A017] flex items-center justify-center text-black font-bold text-xs flex-shrink-0">
            {initials}
          </div>
          <span className="text-sm font-extrabold text-white truncate">
            {get(row, 'fullName')}
          </span>
        </div>
      )
    },
  },
  {
    key: 'listings',
    label: 'Listings',
    width: '130px',
    render: (row) => (
      <span className="text-sm text-white/80">
        {row.activeListings || 0} active
      </span>
    ),
  },
  {
    key: 'totalGmv',
    label: 'Total GMV',
    width: '150px',
    sortable: true,
    render: (row) => (
      <span className="text-sm font-extrabold text-white">
        €{Number(row.totalGmv || 0).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    key: 'stripeConnect',
    label: 'Stripe Connect',
    width: '150px',
    render: (row) => <StripeBadge connected={row.stripeOnboardingComplete} />,
  },
  {
    key: 'actions',
    label: 'Actions',
    width: '100px',
    render: (row) => {
      const isActive = row.status === 'active'
      const StatusIcon = isActive ? UserX : UserCheck

      return (
        <div className="flex items-center gap-1">
          <ActionBtn
            icon={Eye}
            onClick={() => onView?.(row)}
          />
          <ActionBtn
            icon={StatusIcon}
            onClick={() => onToggleStatus?.(row)}
            className={isActive ? 'hover:!text-[#EF4444] hover:!bg-[#EF4444]/10' : 'hover:!text-[#4ADE80] hover:!bg-[#4ADE80]/10'}
          />
        </div>
      )
    },
  },
]
