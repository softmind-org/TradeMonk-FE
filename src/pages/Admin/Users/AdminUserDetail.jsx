import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, UserX, UserCheck } from 'lucide-react'
import userService from '@/services/userService'

const AdminUserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isToggling, setIsToggling] = useState(false)

  const fetchUserDetail = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userService.getById(id)
      if (response?.success) {
        setUserData(response.data.user)
        setStats(response.data.stats)
      }
    } catch (err) {
      console.error('Failed to fetch user:', err)
      setError(err.message || 'Failed to load user details.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchUserDetail()
  }, [fetchUserDetail])

  const handleToggleStatus = async () => {
    if (!userData) return
    const newStatus = userData.status === 'active' ? 'suspended' : 'active'
    
    try {
      setIsToggling(true)
      const response = await userService.toggleStatus(userData._id, newStatus)
      if (response?.success) {
        setUserData(response.data)
      }
    } catch (err) {
      console.error('Failed to toggle status:', err)
      alert(err.message || 'Failed to update user status.')
    } finally {
      setIsToggling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="text-[#D4A017] animate-spin" />
        <span className="ml-3 text-muted-foreground text-sm">Loading user details…</span>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="text-center py-20 place-content-center min-h-[50vh]">
        <p className="text-red-400 text-sm mb-4">{error || 'User not found'}</p>
        <button
          onClick={() => navigate('/admin/users')}
          className="bg-[#D4A017] text-black font-bold text-xs px-6 py-2 rounded-lg"
        >
          Back to Users
        </button>
      </div>
    )
  }

  const { fullName, email, role, _id, status } = userData
  const isActive = status === 'active'
  const idStr = _id ? `USR-${_id.slice(-3).toUpperCase()}` : 'USR-XXX'
  const initials = fullName ? fullName.charAt(0).toUpperCase() : 'U'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-white tracking-wide">User Detail</h1>
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          Back to User Management
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {/* Left Side: Profile Card */}
        <div
          className="col-span-1 rounded-2xl p-8 flex flex-col items-center border border-white/5 relative overflow-hidden"
          style={{ backgroundColor: '#111C2E' }}
        >
          {/* Gold Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#D4A017]" />
          
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black text-[#D4A017] border border-white/5 bg-[#0B1220] mb-5">
            {initials}
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight text-center">
            {fullName}
          </h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 text-center">
            {idStr}
          </p>

          <div className="flex items-center justify-center gap-3 w-full mb-8">
            <span className="bg-[#1D50AB]/10 text-blue-400 border border-blue-400/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {role}
            </span>
            <span
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border`}
              style={{
                backgroundColor: isActive ? '#1E293B' : '#1E293B',
                color: isActive ? '#4ADE80' : '#EF4444',
                borderColor: isActive ? '#22C55E1A' : '#EF44441A',
              }}
            >
              {status}
            </span>
          </div>

          <button
            onClick={handleToggleStatus}
            disabled={role === 'admin' || isToggling}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${
              role === 'admin' 
                ? 'opacity-50 cursor-not-allowed bg-white/5 text-muted-foreground' 
                : isActive
                  ? 'bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/20'
                  : 'bg-[#4ADE80]/10 hover:bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/20'
            }`}
          >
            {isToggling ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isActive ? (
              <>
                <UserX size={16} /> Suspend Account
              </>
            ) : (
              <>
                <UserCheck size={16} /> Activate Account
              </>
            )}
          </button>
        </div>

        {/* Right Side: Stats Panel */}
        {role !== 'admin' && stats && (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 flex flex-col justify-center border border-white/5" style={{ backgroundColor: '#111C2E' }}>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Total Purchases
              </p>
              <h3 className="text-3xl font-black text-white">
                {stats.totalPurchases || 0}
              </h3>
            </div>
            
            <div className="rounded-2xl p-6 flex flex-col justify-center border border-white/5" style={{ backgroundColor: '#111C2E' }}>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Total Volume
              </p>
              <h3 className="text-3xl font-black text-[#D4A017]">
                €{Number(stats.totalVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>

            <div className="rounded-2xl p-6 flex flex-col justify-center border border-white/5" style={{ backgroundColor: '#111C2E' }}>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Trust Score
              </p>
              <h3 className="text-3xl font-black text-blue-400">
                {stats.trustScore || 100}/100
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUserDetail
