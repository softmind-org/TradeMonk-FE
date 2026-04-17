import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@components/ui'

/**
 * CategoryModal — Add / Edit category
 * Rendered inside the global <Modal> via useModal().openModal(<CategoryModal />)
 *
 * Props:
 *   category  – null for "Add", object for "Edit"
 *   onSave    – (formData) => void
 *   onClose   – () => void  (called to close the modal)
 */
const CategoryModal = ({ category = null, onSave, onClose }) => {
  const isEdit = Boolean(category)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-fill when editing
  useEffect(() => {
    if (category) {
      setName(category.name || '')
      setSlug(category.slug || '')
      setDescription(category.description || '')
    }
  }, [category])

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEdit) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      )
    }
  }, [name, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await onSave({
        id: category?._id || category?.id,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
      })
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
          <h2 className="text-white font-extrabold text-xl">
            {isEdit ? 'Edit Category' : 'Add Category'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Game Name */}
          <div>
            <label className="text-sm font-bold text-muted-foreground block mb-2">
              Game Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pokémon"
              className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#D4A017] transition-colors"
              required
            />
          </div>

          {/* Category Slug */}
          <div>
            <label className="text-sm font-bold text-muted-foreground block mb-2">
              Category Slug (Auto-filled)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="pokemon"
              className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-white/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#D4A017] transition-colors"
              readOnly={!isEdit}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-bold text-muted-foreground block mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="The world-renowned trading card game featuring Pocket Monsters."
              rows={4}
              className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#D4A017] transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full !bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-bold text-sm py-3 uppercase tracking-wide"
          >
            {isSubmitting
              ? 'Saving...'
              : isEdit
              ? 'Save Category'
              : 'Save Category'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CategoryModal
