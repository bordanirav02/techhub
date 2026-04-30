import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25',
  secondary: 'bg-violet-500 hover:bg-violet-600 text-white shadow-lg shadow-violet-500/25',
  ghost: 'bg-transparent hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
  outline: 'border border-[var(--border-color)] hover:border-blue-500/50 bg-transparent text-[var(--text-primary)] hover:bg-blue-500/5',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
  xl: 'px-8 py-4 text-lg gap-3',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, iconPosition = 'left', fullWidth, className = '', children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center rounded-lg font-medium
          transition-all duration-200 cursor-pointer select-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...(props as Parameters<typeof motion.button>[0])}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
