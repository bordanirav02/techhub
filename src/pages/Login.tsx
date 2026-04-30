import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { loginSchema, type LoginForm } from '@/lib/validators'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

// zodResolver requires the package - install dynamically
let zodResolver_: typeof zodResolver
try { zodResolver_ = zodResolver } catch { zodResolver_ = ((s: unknown) => s) as typeof zodResolver }

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const from = (location.state as { from?: string })?.from || '/account'

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const ok = await login(data.email, data.password)
    setIsLoading(false)

    if (ok) {
      toast.success('Welcome back!')
      navigate(from)
    } else {
      toast.error('Invalid email or password')
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    // Register demo user first if not exists
    const { register: registerUser } = useAuthStore.getState()
    await registerUser('Demo User', 'demo@techhub.com', 'Demo1234!')
    const ok = await login('demo@techhub.com', 'Demo1234!')
    setIsLoading(false)
    if (ok) {
      toast.success('Logged in as Demo User!')
      navigate(from)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-hero py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-bold">Tech<span className="text-blue-500">Hub</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome back</h1>
          <p className="text-[var(--text-muted)] mt-1">Sign in to your account</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-[var(--border-color)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" fullWidth size="lg" loading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[var(--bg-surface)] px-3 text-[var(--text-muted)]">or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 border border-[var(--border-color)] hover:border-blue-500/40 text-[var(--text-secondary)] rounded-xl text-sm font-medium transition-colors"
          >
            🧪 Try Demo Account
          </button>

          <p className="text-center text-sm text-[var(--text-muted)] mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
