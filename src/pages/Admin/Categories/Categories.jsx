import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Loader2 } from 'lucide-react'
import { Button } from '@components/ui'
import { useModal } from '@/context/modal'
import CategoryModal from '@/components/Modals/CategoryModal'
import categoryService from '@/services/categoryService'

const Categories = () => {
  const { openModal, closeModal } = useModal()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── FETCH ──
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await categoryService.getAll()
      if (response?.success) {
        setCategories(response.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      setError('Failed to load categories.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // ── ADD ──
  const handleAddCategory = () => {
    openModal(
      <CategoryModal
        onSave={async (formData) => {
          const response = await categoryService.create({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
          })
          if (response?.success) {
            setCategories((prev) => [...prev, response.data])
            closeModal()
          }
        }}
        onClose={closeModal}
      />,
      670
    )
  }

  // ── EDIT ──
  const handleEditCategory = (category) => {
    openModal(
      <CategoryModal
        category={category}
        onSave={async (formData) => {
          const response = await categoryService.update(category._id, {
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
          })
          if (response?.success) {
            setCategories((prev) =>
              prev.map((c) => (c._id === category._id ? response.data : c))
            )
            closeModal()
          }
        }}
        onClose={closeModal}
      />,
      670
    )
  }

  // ── TOGGLE STATUS ──
  const handleToggleStatus = async (category) => {
    const newStatus = category.status === 'enabled' ? 'disabled' : 'enabled'
    try {
      const response = await categoryService.toggleStatus(category._id, newStatus)
      if (response?.success) {
        setCategories((prev) =>
          prev.map((c) => (c._id === category._id ? response.data : c))
        )
      }
    } catch (err) {
      console.error('Failed to toggle status:', err)
    }
  }

  // Dot colors based on index for visual variety
  const dotColors = ['#EF4444', '#F59E0B', '#10B981', '#6366F1', '#EC4899', '#14B8A6']

  // ── RENDER ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="text-[#D4A017] animate-spin" />
        <span className="ml-3 text-muted-foreground text-sm">Loading categories…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <Button onClick={fetchCategories} className="bg-[#D4A017] text-black font-bold text-xs px-6 py-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-white font-extrabold text-lg tracking-wide">
          Ecosystem Node Management
        </h2>
        <Button
          onClick={handleAddCategory}
          className="border bg-[#111C2E]  border-white/10 text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 flex items-center gap-2"
        >
          <Plus size={14} />
          Add Category
        </Button>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {categories.map((category, idx) => {
          const isEnabled = category.status === 'enabled'

          return (
            <div
              key={category._id}
              className="flex items-center justify-between p-5 rounded-xl transition-colors"
              style={{
                backgroundColor: '#111C2E',
                border: '1px solid #D4A0174D',
              }}
            >
              {/* Left — Name & Meta */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-extrabold text-base truncate">
                      {category.name}
                    </h3>
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: dotColors[idx % dotColors.length] }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-1">
                    Slug: {category.slug} • Status: {isEnabled ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              {/* Right — Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Edit */}
                <button
                  onClick={() => handleEditCategory(category)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                  aria-label={`Edit ${category.name}`}
                >
                  <Pencil size={16} />
                </button>

                {/* Enable/Disable Toggle */}
                <button
                  onClick={() => handleToggleStatus(category)}
                  className="px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors"
                  style={
                    isEnabled
                      ? {
                          color: '#4ADE80',
                          border: '1px solid #22C55E1A',
                          backgroundColor: '#1E293B',
                        }
                      : {
                          color: '#EF4444',
                          border: '1px solid #EF44441A',
                          backgroundColor: '#1E293B',
                        }
                  }
                >
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          )
        })}

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No categories yet. Click "Add Category" to create one.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories
