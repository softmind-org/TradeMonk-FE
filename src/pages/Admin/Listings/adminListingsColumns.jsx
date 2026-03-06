import { Eye } from 'lucide-react'

const get = (row, path) => path.split('.').reduce((o, k) => o?.[k], row)

/* ── Status Badge ── */
const StatusBadge = ({ value }) => {
  const v = (value || '').toLowerCase()
  const map = {
    active: { color: '#4ADE80', label: 'Active' },
    sold:   { color: '#F59E0B', label: 'Sold' },
    draft:  { color: '#94A3B8', label: 'Draft' },
  }
  const info = map[v] || { color: '#94A3B8', label: value || 'Unknown' }

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
      style={{
        backgroundColor: '#1E293B',
        color: info.color,
        border: `1px solid ${info.color}1A`,
      }}
    >
      {info.label}
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
export const ADMIN_LISTINGS_COLUMNS = ({ onView }) => [
  {
    key: 'asset',
    label: 'Asset',
    width: '320px',
    render: (row) => {
      const img = row.images?.[0]
      const subtitle = [get(row, 'collectionName'), get(row, 'setNumber')]
        .filter(Boolean)
        .join(' / ')

      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-12 rounded-lg bg-[#0B1220] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {img ? (
              <img src={img} alt={row.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-muted-foreground">IMG</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-white truncate">{get(row, 'title')}</h3>
            <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-0.5 truncate">
              {subtitle || '—'}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    key: 'merchant',
    label: 'Merchant',
    width: '160px',
    render: (row) => (
      <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
        {get(row, 'seller.name') || 'Unknown'}
      </span>
    ),
  },
  {
    key: 'price',
    label: 'Current Value',
    width: '140px',
    sortable: true,
    render: (row) => (
      <span className="text-sm font-extrabold text-[#D4A017]">
        €{Number(get(row, 'price') || 0).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    width: '120px',
    render: (row) => <StatusBadge value={get(row, 'status')} />,
  },
  {
    key: 'actions',
    label: '',
    width: '60px',
    render: (row) => (
      <div className="flex items-center justify-end">
        <ActionBtn icon={Eye} onClick={() => onView?.(row)} />
      </div>
    ),
  },
]
