import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import { registerSchema, type RegisterForm } from '@/lib/validators'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

const getPasswordStrength = (p: string): { level: number; label: string; color: string } => {
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const levels = [
    { label: 'Weak', color: 'bg-red-500' },
    { label: 'Fair', color: 'bg-amber-500' },
    { label: 'Good', color: 'bg-blue-500' },
    { label: 'Strong', color: 'bg-emerald-500' },
  ]
  return { level: score, ...levels[Math.max(0, score - 1)] }
}

export default function Register() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const watchedPassword = watch('password', '')
  const strength = getPasswordStrength(watchedPassword)

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const ok = await registerUser(data.name, data.email, data.password)
    setIsLoading(false)

    if (ok) {
      toast.success('Account created successfully!')
      navigate('/account')
    } else {
      toast.error('Email already registered')
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
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create account</h1>
          <p className="text-[var(--text-muted)] mt-1">Join TechHub today</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-[var(--border-color)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input {...register('name')} type="text" placeholder="John Doe"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50" />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input {...register('email')} type="email" placeholder="you@example.com"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50" />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {watchedPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(l => (
                      <div key={l} className={`flex-1 h-1 rounded-full transition-all ${l <= strength.level ? strength.color : 'bg-[var(--bg-hover)]'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">Password strength: <span className="font-medium text-[var(--text-primary)]">{strength.label}</span></p>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input {...register('confirmPassword')} type="password" placeholder="••••••••"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50" />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-2.5">
              <input {...register('terms')} type="checkbox" id="terms"
                className="w-4 h-4 rounded border-[var(--border-color)] text-blue-500 mt-0.5" />
              <label htmlFor="terms" className="text-xs text-[var(--text-secondary)]">
                I agree to the{' '}
                <Link to="#" className="text-blue-400 hover:text-blue-300">Terms of Service</Link>
                {' '}and{' '}
                <Link to="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-red-400 -mt-2">{errors.terms.message}</p>}

            <Button type="submit" fullWidth size="lg" loading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
