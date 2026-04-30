import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, Zap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 1200))
    setSubmittedEmail(data.email)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-[var(--text-primary)] tracking-tight">TechHub</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8"
        >
          {!submitted ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Reset your password</h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button type="submit" fullWidth loading={isSubmitting} className="mt-2">
                  Send Reset Link
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-400" />
              </motion.div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Check your email</h2>
              <p className="text-sm text-[var(--text-muted)] mb-1">
                We've sent a password reset link to
              </p>
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-6">{submittedEmail}</p>
              <p className="text-xs text-[var(--text-muted)] mb-6">
                Didn't receive the email? Check your spam folder, or{' '}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  try again
                </button>
                .
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </motion.div>
          )}
        </motion.div>

        <p className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to TechHub
          </Link>
        </p>
      </div>
    </div>
  )
}
