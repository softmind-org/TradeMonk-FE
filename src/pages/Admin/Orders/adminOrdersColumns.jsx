import { Clock } from 'lucide-react'

const get = (row, path) => path.split('.').reduce((o, k) => o?.[k], row)

/* ── Status Badge ── */
const StatusBadge = ({ value }) => {
  const v = (value || '').toLowerCase()
  const map = {
    processing: { color: '#F59E0B', label: 'Processing' },
    confirmed:  { color: '#3B82F6', label: 'Confirmed' },
    shipped:    { color: '#6366F1', label: 'Shipped' },
    delivered:  { color: '#10B981', label: 'Completed' },
    cancelled:  { color: '#EF4444', label: 'Cancelled' },
    disputed:   { color: '#EF4444', label: 'Disputed' },
    pending:    { color: '#94A3B8', label: 'Pending' },
  }

  const info = map[v] || map.pending

  return (
    <span
      className="text-[11px] font-bold uppercase tracking-wider"
      style={{ color: info.color }}
    >
      {info.label}
    </span>
  )
}

/* ── Action Icon Button ── */
const ActionBtn = ({ icon: Icon, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors ${className}`}
  >
    <Icon size={16} />
  </button>
)

/* ── Column Definitions ── */
export const ADMIN_ORDERS_COLUMNS = ({ onView }) => [
  {
    key: 'orderNumber',
    label: 'Order ID',
    width: '180px',
    render: (row) => (
      <span className="text-sm font-extrabold text-white">
        #{get(row, 'orderNumber')}
      </span>
    ),
  },
  {
    key: 'identityMatch',
    label: 'Identity Match',
    width: '280px',
    render: (row) => {
      const buyer = row.userId?.fullName || row.shippingAddress?.fullName || 'Unknown'
      const seller = row.sellerId?.fullName || 'Unknown'

      return (
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-bold tracking-wider uppercase">
          <span>B: {buyer}</span>
          <span>S: {seller}</span>
        </div>
      )
    },
  },
  {
    key: 'totalAmount',
    label: 'Asset Value',
    width: '150px',
    sortable: true,
    render: (row) => {
      const amount = get(row, 'totalAmount')
      return (
        <span className="text-sm font-extrabold text-[#D4A017]">
          €{Number(amount || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      )
    },
  },
  {
    key: 'orderStatus',
    label: 'Fulfillment',
    width: '140px',
    render: (row) => <StatusBadge value={get(row, 'orderStatus')} />,
  },
  {
    key: 'actions',
    label: '',
    width: '60px',
    render: (row) => (
      <div className="flex items-center justify-end">
        <ActionBtn icon={Clock} onClick={() => onView?.(row)} />
      </div>
    ),
  },
]
