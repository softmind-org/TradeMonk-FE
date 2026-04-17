import { Eye, UserX, UserCheck } from 'lucide-react'

const get = (row, path) => path.split('.').reduce((o, k) => o?.[k], row)

/* ── Status Badge ── */
const StatusBadge = ({ value }) => {
  const v = (value || '').toLowerCase()
  const isActive = v === 'active'

  const bg = isActive ? '#1E293B' : '#1E293B'
  const text = isActive ? '#4ADE80' : '#EF4444'
  const border = isActive ? '1px solid #22C55E1A' : '1px solid #EF44441A'

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors"
      style={{
        backgroundColor: bg,
        color: text,
        border: border
      }}
    >
      {value}
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
export const ADMIN_USERS_COLUMNS = ({ onView, onToggleStatus }) => [
  {
    key: 'userEntity',
    label: 'User Entity',
    width: '240px',
    render: (row) => {
      const idStr = row._id ? `USR-${row._id.slice(-3).toUpperCase()}` : 'USR-XXX'
      return (
        <div>
          <h3 className="text-white font-extrabold text-sm truncate">{get(row, 'fullName')}</h3>
          <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-0.5">
            {idStr}
          </p>
        </div>
      )
    },
  },
  {
    key: 'email',
    label: 'Email',
    width: '200px',
    render: (row) => (
      <span className="text-sm font-medium text-white/80">
        {get(row, 'email')}
      </span>
    ),
  },
  {
    key: 'role',
    label: 'Role',
    width: '120px',
    render: (row) => (
      <span className="text-[11px] font-bold text-white uppercase tracking-wider">
        {get(row, 'role')}
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
    key: 'joined',
    label: 'Joined',
    width: '120px',
    render: (row) => {
      const date = new Date(get(row, 'createdAt'))
      return (
        <span className="text-sm text-white/80">
          {date.toLocaleDateString('en-CA')}
        </span>
      )
    },
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
            className="hover:!text-[#4ADE80] hover:!bg-[#4ADE80]/10"
          />
          {row.role !== 'admin' && (
            <ActionBtn
              icon={StatusIcon}
              onClick={() => onToggleStatus?.(row)}
              className={isActive ? 'hover:!text-[#EF4444] hover:!bg-[#EF4444]/10' : 'hover:!text-[#4ADE80] hover:!bg-[#4ADE80]/10'}
            />
          )}
        </div>
      )
    },
  },
]
