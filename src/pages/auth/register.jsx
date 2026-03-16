import { Link, useNavigate } from 'react-router-dom'
import { Card, Button, Input, InputPassword } from '@components/ui'
import { useRegister } from '@hooks/useRegister'
import { Mail, User, Lock, Building2, FileDigit, Receipt, MapPin } from 'lucide-react'
import { useFormik } from 'formik'
import { registerSchema } from '@/schemas/auth-schema'

const Register = () => {
  const navigate = useNavigate()
  const { mutate: register, isPending, isError, error } = useRegister()
  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'buyer',
      acceptedTerms: false,
      sellerType: 'private',
      businessName: '',
      registrationNumber: '',
      vatNumber: '',
      businessAddress: ''
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      const payload = {
        fullName: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        acceptedTerms: values.acceptedTerms
      }

      // Add seller-specific fields
      if (values.role === 'seller') {
        payload.sellerType = values.sellerType
        if (values.sellerType === 'professional') {
          payload.businessName = values.businessName
          payload.registrationNumber = values.registrationNumber
          payload.vatNumber = values.vatNumber
          payload.businessAddress = values.businessAddress
        }
      }

      register(payload, {
        onSuccess: (data) => {
          console.log('Registration successful:', data)
          navigate('/login')
        },
        onError: (error) => {
          console.error('Registration error:', error)
        }
      })
    }
  })

  const isSeller = formik.values.role === 'seller'
  const isProfessional = formik.values.sellerType === 'professional'

  return (
      <Card className="bg-card border border-border p-8 md:p-10 relative overflow-hidden">
        {/* Top Gradient Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, rgba(0, 240, 255, 0) 0%, rgba(212, 160, 23, 0.5) 50%, rgba(0, 240, 255, 0) 100%)'
          }}
        />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm">
            Register as a <span className="text-secondary font-medium capitalize">{formik.values.role}</span>
          </p>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Error Message from API */}
          {isError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error?.message || 'Registration failed. Please try again.'}
            </div>
          )}
          
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your full name"
            icon={User}
            required
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />
          
          <InputPassword
            label="Password"
            name="password"
            placeholder="Create a strong password"
            icon={Lock}
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />
          
          {/* Role Selection */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-white mb-0.5">
              Choose Role <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-[#0B1220]/50 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none cursor-pointer"
              >
                <option value="buyer" className="bg-[#0B1220]">Buyer</option>
                <option value="seller" className="bg-[#0B1220]">Seller</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Seller Type Selection (only for sellers) */}
          {isSeller && (
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-white mb-0.5">
                Choose Seller Type <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Building2 className="w-5 h-5" />
                </div>
                <select
                  name="sellerType"
                  value={formik.values.sellerType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-[#0B1220]/50 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none cursor-pointer"
                >
                  <option value="private" className="bg-[#0B1220]">Private</option>
                  <option value="professional" className="bg-[#0B1220]">Professional</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {formik.touched.sellerType && formik.errors.sellerType && (
                <p className="text-red-400 text-xs">{formik.errors.sellerType}</p>
              )}
            </div>
          )}

          {/* Professional Seller Fields */}
          {isSeller && isProfessional && (
            <>
              <Input
                label="Business Name"
                name="businessName"
                placeholder="Enter your business name"
                icon={Building2}
                required
                value={formik.values.businessName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.businessName && formik.errors.businessName}
              />

              <Input
                label="Registration Number"
                name="registrationNumber"
                placeholder="Enter registration number"
                icon={FileDigit}
                required
                value={formik.values.registrationNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.registrationNumber && formik.errors.registrationNumber}
              />

              <Input
                label="VAT Number (if applicable)"
                name="vatNumber"
                placeholder="Enter VAT number"
                icon={Receipt}
                required
                value={formik.values.vatNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.vatNumber && formik.errors.vatNumber}
              />

              <Input
                label="Business Address"
                name="businessAddress"
                placeholder="Enter your business address"
                icon={MapPin}
                required
                value={formik.values.businessAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.businessAddress && formik.errors.businessAddress}
              />
            </>
          )}

          {/* Terms & Conditions Checkbox */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formik.values.acceptedTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-[2px] w-4 h-4 rounded border border-white/20 bg-[#0B1220]/50 accent-[#D4A017] cursor-pointer shrink-0"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{' '}
                <a
                  href={`/terms/${formik.values.role}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-secondary/80 underline font-medium"
                >
                  {formik.values.role === 'seller' ? 'Seller' : 'Buyer'} Terms & Conditions
                </a>
              </span>
            </label>
            {formik.touched.acceptedTerms && formik.errors.acceptedTerms && (
              <p className="text-red-400 text-xs ml-6">{formik.errors.acceptedTerms}</p>
            )}
          </div>
          
          <Button 
            type="submit"
            className="w-full py-6 text-base font-semibold text-[#0B1220]"
            variant="secondary"
            disabled={isPending}
          >
            {isPending ? 'Registering...' : 'Register'}
          </Button>

          
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link 
              to="/login" 
              className="text-secondary hover:text-secondary/80 font-medium hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </form>
      </Card>
  )
}

export default Register
