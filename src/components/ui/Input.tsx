import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
  rightElement?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-[var(--text-muted)] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full bg-[var(--bg-card)] border rounded-lg px-3 py-2.5 text-sm
              text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
              ${error ? 'border-red-500/50' : 'border-[var(--border-color)] hover:border-[var(--border-hover)]'}
              ${icon ? 'pl-10' : ''}
              ${rightElement ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 text-[var(--text-muted)]">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
