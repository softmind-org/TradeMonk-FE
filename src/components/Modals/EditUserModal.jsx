import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@components/ui'

/**
 * EditUserModal — Admin edit for User Name and Email
 * Rendered inside the global <Modal> via useModal().openModal(<EditUserModal />)
 */
const EditUserModal = ({ user, onSave, onClose }) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) return

    setError(null)
    setIsSubmitting(true)
    try {
      await onSave({
        fullName: fullName.trim(),
        email: email.trim(),
      })
    } catch (err) {
      setError(err.message || 'Failed to update user')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: '#1E293BCC' }}
    >
      {/* Gold top border */}
      <div
        className="w-full"
        style={{
          height: '6px',
          backgroundColor: '#D4A017',
          borderRadius: '24px 24px 0 0',
        }}
      />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-white font-extrabold text-xl">Edit User Information</h2>
            <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-0.5">
              USR-{user?._id?.slice(-6).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="text-sm font-bold text-muted-foreground block mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#D4A017] transition-colors"
              required
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="text-sm font-bold text-muted-foreground block mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#D4A017] transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || !fullName.trim() || !email.trim()}
            className="w-full !bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-bold text-sm py-3 uppercase tracking-wide"
          >
            {isSubmitting ? 'Updating...' : 'Update User Account'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default EditUserModal
