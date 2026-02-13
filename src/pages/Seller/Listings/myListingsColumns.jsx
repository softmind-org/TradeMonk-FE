import { Eye, Pencil, Trash2 } from 'lucide-react'

const get = (row, path) => path.split('.').reduce((o, k) => o?.[k], row)

/* ── Status Badge ── */
const StatusBadge = ({ value }) => {
  const v = (value || '').toLowerCase()
  let bg = 'bg-green-500/20'
  let text = 'text-green-400'

  if (v.includes('draft')) {
    bg = 'bg-yellow-500/20'
    text = 'text-yellow-400'
  } else if (v.includes('sold') || v.includes('inactive')) {
    bg = 'bg-red-500/20'
    text = 'text-red-400'
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${bg} ${text}`}>
      {value}
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
export const MY_LISTINGS_COLUMNS = ({ onView, onEdit, onDelete }) => [
  {
    key: 'collectible',
    label: 'Collectible',
    width: '280px',
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-12 rounded-lg bg-[#0B1220] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
          {row.image ? (
            <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-muted-foreground">IMG</span>
          )}
        </div>
        <span className="text-sm font-bold text-white truncate max-w-[180px]">{get(row, 'name')}</span>
      </div>
    ),
  },
  {
    key: 'gameSet',
    label: 'Game / Set',
    width: '200px',
    render: (row) => (
      <div>
        <p className="text-sm text-white">{get(row, 'gameCategory')}</p>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
          {get(row, 'setName')} / {get(row, 'setNumber')}
        </p>
      </div>
    ),
  },
  {
    key: 'price',
    label: 'Price',
    width: '120px',
    sortable: true,
    render: (row) => (
      <span className="text-sm font-bold text-[#D4A017]">
        €{Number(get(row, 'price')).toLocaleString()}
      </span>
    ),
  },
  {
    key: 'quantity',
    label: 'Qty',
    width: '80px',
    render: (row) => (
      <span className="text-sm text-white">{get(row, 'quantity')}</span>
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
    label: 'Actions',
    width: '140px',
    render: (row) => (
      <div className="flex items-center gap-1">
        <ActionBtn icon={Eye} onClick={() => onView?.(row)} />
        <ActionBtn icon={Pencil} onClick={() => onEdit?.(row)} />
        <ActionBtn
          icon={Trash2}
          onClick={() => onDelete?.(row)}
          className="hover:!text-red-400 hover:!bg-red-500/10"
        />
      </div>
    ),
  },
]
