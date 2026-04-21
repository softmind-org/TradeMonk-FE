import { useMemo, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import TableLayout from '@layouts/TableLayout'
import { ADMIN_USERS_COLUMNS } from './adminUsersColumns'
import userService from '@/services/userService'
import { useModal } from '@/context/modal'
import EditUserModal from '@/components/Modals/EditUserModal'

/* ── Admin Users Page ── */
const AdminUsers = () => {
  const navigate = useNavigate()
  const { openModal, closeModal } = useModal()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userService.getAll()
      if (response?.success) {
        setUsers(response.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setError(err.message || 'Failed to load users.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleView = (user) => {
    navigate(`/admin/users/${user._id}`)
  }

  const handleEdit = (user) => {
    openModal(
      <EditUserModal
        user={user}
        onClose={closeModal}
        onSave={(data) => handleUpdateUser(user._id, data)}
      />
    )
  }

  const handleUpdateUser = async (userId, data) => {
    try {
      const response = await userService.updateUser(userId, data)
      if (response?.success) {
        // Option 1: Update local state for instant feedback
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...response.data } : u))
        )
        closeModal()
      }
    } catch (err) {
      console.error('Update failed:', err)
      throw err // Let the modal handle the error display
    }
  }

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    try {
      const response = await userService.toggleStatus(user._id, newStatus)
      if (response?.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? response.data : u))
        )
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err)
      alert(err.message || 'Failed to change user status.')
    }
  }

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users
    const query = searchTerm.toLowerCase()
    return users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    )
  }, [users, searchTerm])

  const columns = useMemo(
    () =>
      ADMIN_USERS_COLUMNS({
        onView: handleView,
        onToggleStatus: handleToggleStatus, // Pass existing status toggle
        onEdit: handleEdit
      }),
    [handleView, handleToggleStatus]
  )

  return (
    <div className="space-y-4">
      {/* Table */}
      <TableLayout
        title="Users View"
        data={filteredUsers}
        columns={columns}
        loading={isLoading}
        showSearch={true}
        onSearch={setSearchTerm}
        showCategories={false}
        dark
      />
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          Error loading users: {error}
        </div>
      )}
    </div>
  )
}

export default AdminUsers
