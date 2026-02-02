/**
 * Login Page
 */
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@layouts'
import { Card, Button, Input, InputPassword } from '@components/ui'
import { useAuth } from '@context'
import { useLogin } from '@hooks/useLogin'
import { Mail, Lock } from 'lucide-react'
import { useFormik } from 'formik'
import { loginSchema } from '@/schemas/auth-schema'

const Login = () => {
  const navigate = useNavigate()
  const { login: loginContext } = useAuth()
  const { mutate: login, isPending, isError, error } = useLogin()
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      // Call the login mutation
      login(values, {
        onSuccess: (response) => {
          console.log('Login successful:', response)
          
          if (response.success && response.data) {
            const { accessToken, ...user } = response.data
            
            // Update AuthContext with user data and token
            loginContext(user, accessToken)
            
            // Redirect to home page
            navigate('/')
          }
        },
        onError: (error) => {
          console.error('Login error:', error)
        }
      })
    }
  })

  return (
    <AuthLayout>
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
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error?.message || 'Login failed. Please check your credentials.'}
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
            className="w-full py-6 text-base font-semibold text-[#0B1220]"
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
    </AuthLayout>
  )
}

export default Login
