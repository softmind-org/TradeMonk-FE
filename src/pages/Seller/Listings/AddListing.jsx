import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import { 
  Upload, 
  X, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronDown,
  Loader2 
} from 'lucide-react'
import { Button, Input } from '@components/ui'
import { categoryService } from '../../../services/categoryService'
import { useCreateListing } from '../../../hooks/useCreateListing'
import { useUpdateListing } from '../../../hooks/useUpdateListing'
import { formatImageUrl } from '../../../utils'
import { productValidationSchema, PRODUCT_FORM_FIELDS } from '../../../schemas/productSchema'
import toast from 'react-hot-toast'

const AddListing = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const editData = location.state?.listing || null
  const isEditMode = Boolean(editData)

  const [frontImage, setFrontImage] = useState(editData?.image ? formatImageUrl(editData.image) : null)
  const [backImage, setBackImage] = useState(editData?.backImage ? formatImageUrl(editData.backImage) : null)
  const [frontFile, setFrontFile] = useState(null)
  const [backFile, setBackFile] = useState(null)
  const [imageErrors, setImageErrors] = useState({ front: '', back: '' })
  const [categories, setCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await categoryService.getAll()
        if (response?.success) {
          // Only use enabled categories
          const activeCats = (response.data || [])
            .filter(c => c.status === 'enabled')
            .map(c => ({ label: c.name, value: c.name }))
          setCategories(activeCats)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCats()
  }, [])

  const createMutation = useCreateListing()
  const updateMutation = useUpdateListing()

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      // Validation: Type & Size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!allowedTypes.includes(file.type)) {
        setImageErrors(prev => ({ ...prev, [type]: 'Unsupported format. Use JPG, PNG, or WEBP.' }))
        return
      }

      if (file.size > maxSize) {
        setImageErrors(prev => ({ ...prev, [type]: 'File too large. Max size 5MB.' }))
        return
      }

      // Clear error on success
      setImageErrors(prev => ({ ...prev, [type]: '' }))

      const url = URL.createObjectURL(file)
      if (type === 'front') {
        setFrontImage(url)
        setFrontFile(file)
      } else {
        setBackImage(url)
        setBackFile(file)
      }
    }
  }

  const formik = useFormik({
    initialValues: {
      cardName: editData?.name || '',
      gameCategory: editData?.gameCategory || '',
      setName: editData?.setName || '',
      setNumber: editData?.setNumber || '',
      rarity: editData?.rarity || '',
      condition: editData?.condition || '',
      price: editData?.price || '',
      quantity: editData?.quantity || '1',
      description: editData?.description || '',
    },
    enableReinitialize: true,
    validationSchema: productValidationSchema,
    onSubmit: async (values) => {
      // Validate Images for new listings
      if (!isEditMode) {
        let hasImageError = false;
        if (!frontFile) {
          setImageErrors(prev => ({ ...prev, front: 'Front image is required' }));
          hasImageError = true;
        }
        if (!backFile) {
          setImageErrors(prev => ({ ...prev, back: 'Back image is required' }));
          hasImageError = true;
        }
        
        if (hasImageError) {
          toast.error('Please upload both front and back images to continue.');
          return;
        }
      }

      setIsSubmitting(true)
      try {
        const formData = new FormData()
        
        // Map frontend fields to backend API keys
        const apiPayload = {
          title: values.cardName,
          gameSystem: values.gameCategory,
          collectionName: values.setName,
          setNumber: values.setNumber,
          rarity: values.rarity,
          condition: values.condition,
          price: values.price,
          quantity: values.quantity,
          description: values.description,
          currency: 'EUR', // Standardized as per user reference
          status: 'active',
          authentication: 'Unverified'
        }

        Object.keys(apiPayload).forEach(key => {
          formData.append(key, apiPayload[key])
        })

        if (frontFile) formData.append('images', frontFile)
        if (backFile) formData.append('backImage', backFile)

        if (isEditMode) {
          await updateMutation.mutateAsync({
            productId: editData.id,
            productData: formData
          })
        } else {
          await createMutation.mutateAsync(formData)
        }

        navigate('/seller/listings')
      } catch (error) {
        console.error('Error saving listing:', error)
        toast.error(error?.response?.data?.message || error?.message || 'Failed to save listing. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  // Render Helper for Form Fields
  const renderField = (field) => {
    const commonProps = {
      name: field.name,
      value: formik.values[field.name],
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      className: "bg-[#0B1220] border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4A017]"
    }

    if (field.type === 'select') {
      return (
        <div key={field.name} className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{field.label}</label>
          <div className="relative">
            <select
              {...commonProps}
              className={`w-full bg-[#0B1220] border ${formik.touched[field.name] && formik.errors[field.name] ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-[#D4A017] transition-colors appearance-none ${formik.values[field.name] ? 'text-white' : 'text-gray-500'}`}
            >
              <option value="" className="text-gray-500">Select {field.label}</option>
              {(field.name === 'gameCategory' ? categories : field.options).map(opt => (
                <option key={opt.value} value={opt.value} className="text-white">{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white" />
          </div>
          {formik.touched[field.name] && formik.errors[field.name] && (
            <p className="text-red-500 text-xs mt-1">{formik.errors[field.name]}</p>
          )}
        </div>
      )
    }

    return (
      <div key={field.name} className={`space-y-2 ${field.gridSpan === 1 ? '' : 'w-full'}`}>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{field.label}</label>
        <Input
          {...commonProps}
          type={field.type}
          placeholder={field.placeholder}
          error={formik.touched[field.name] && formik.errors[field.name]}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">{isEditMode ? 'Edit Listing' : 'Add Listing'}</h1>
      </div>

      <div className="bg-[#111C2E] border border-white/5 rounded-2xl overflow-hidden shadow-xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D4A017]"></div>
        <div className="p-6 md:p-8 space-y-8">
          <h2 className="text-xl font-bold text-white">{isEditMode ? 'Update Listing Details' : 'Publish New Listing'}</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Left Column Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {PRODUCT_FORM_FIELDS.LEFT_COLUMN.map(field => (
                    <div key={field.name} className={field.name === 'cardName' || field.name === 'condition' ? 'col-span-2' : ''}>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {PRODUCT_FORM_FIELDS.RIGHT_COLUMN.map(field => (
                    <div key={field.name} className={field.name === 'gameCategory' || field.name === 'rarity' ? 'col-span-2' : ''}>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description / Notes</label>
              <textarea 
                name="description"
                rows="4"
                placeholder="Provide details about centering, surface wear, or packaging..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full bg-[#0B1220] border ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4A017] transition-colors resize-none`}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
              )}
            </div>

            {/* Image Upload Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {['front', 'back'].map(type => {
                const imgState = type === 'front' ? frontImage : backImage
                const setImgState = type === 'front' ? setFrontImage : setBackImage
                return (
                  <div key={type} className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Upload {type.charAt(0).toUpperCase() + type.slice(1)} Photo
                    </label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept=".jpg,.jpeg,.png,.webp" 
                        onChange={(e) => handleImageUpload(e, type)} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-colors ${imageErrors[type] ? 'border-red-500 bg-red-500/5' : imgState ? 'border-[#D4A017] bg-[#D4A017]/5' : 'border-white/10 bg-[#0B1220] group-hover:border-white/20'}`}>
                        {imgState ? (
                          <div className="relative w-full h-full p-2">
                            <img src={imgState} alt={type} className="w-full h-full object-contain rounded-lg" />
                            <button 
                              type="button" 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgState(null); }}
                              className="absolute top-4 right-4 bg-black/50 hover:bg-red-500 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors z-20"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white transition-colors">
                              <ImageIcon size={24} />
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">JPG/PNG/WEBP Photo</p>
                          </>
                        )}
                      </div>
                    </div>
                    {imageErrors[type] && (
                      <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{imageErrors[type]}</p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Submit Section */}
            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-extrabold py-4 rounded-xl uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,160,23,0.3)] hover:shadow-[0_0_30px_rgba(212,160,23,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  isEditMode ? 'Update Collectible' : 'Publish Collectible'
                )}
              </button>
              <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Listing will go live immediately on verified marketplace
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddListing
