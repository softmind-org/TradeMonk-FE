import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Card, Button, Input, InputPassword } from '@components/ui'
import { useAuth } from '@context'
import { useLogin } from '@hooks/useLogin'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useFormik } from 'formik'
import { loginSchema } from '@/schemas/auth-schema'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: loginContext } = useAuth()
  const { mutate: login, isPending, isError, error } = useLogin()
  
  const isExpired = new URLSearchParams(location.search).get('expired') === 'true'
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      login(values, {
        onSuccess: (response) => {
          console.log('Login successful:', response)
          
          if (response.success && response.data) {
            const { accessToken, ...user } = response.data
            
            loginContext(user, accessToken)
            
            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin/dashboard')
            } else if (user.role === 'seller') {
                navigate('/seller/dashboard')
            } else {
                navigate('/')
            }
          }
        },
        onError: (error) => {
          console.error('Login error:', error)
        }
      })
    }
  })

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
          <h1 className="text-3xl font-semibold text-white mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to access your account
          </p>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Error Message */}
          {isError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error?.message || 'Login failed. Please check your credentials.'}
            </div>
          )}

          {/* Session Expired Message */}
          {isExpired && !isError && (
            <div className="bg-[#D4A017]/10 border border-[#D4A017]/30 rounded-lg p-3 text-[#D4A017] text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              Session expired. Please sign in again.
            </div>
          )}
          
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
          
          <div>
            <InputPassword
              label="Password"
              name="password"
              placeholder="Enter your password"
              icon={Lock}
              required
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
            />
            <div className="flex justify-end mt-2">
              <Link 
                to="/forgot-password" 
                className="text-sm text-secondary hover:text-secondary/80 hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          
          <Button 
            type="submit"
            className="w-full !py-3 !px-4 text-base  font-semibold text-[#0B1220] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
            variant="secondary"
            disabled={isPending}
          >
            {isPending ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link 
              to="/register" 
              className="text-secondary hover:text-secondary/80 font-medium hover:underline transition-colors"
            >
              Register
            </Link>
          </div>
        </form>
      </Card>
  )
}

export default Login
