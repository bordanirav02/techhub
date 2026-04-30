import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'blue' | 'violet' | 'green' | 'orange' | 'red' | 'gray'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  violet: 'bg-violet-500/15 text-violet-400 border border-violet-500/20',
  green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  orange: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  red: 'bg-red-500/15 text-red-400 border border-red-500/20',
  gray: 'bg-white/5 text-[var(--text-secondary)] border border-[var(--border-color)]',
}

const sizes = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-1 text-xs',
}

export const Badge = ({ children, variant = 'blue', size = 'md', className = '' }: BadgeProps) => (
  <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
    {children}
  </span>
)

export const ProductBadge = ({ badge }: { badge: string }) => {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    'New': { variant: 'blue', label: 'New' },
    'Sale': { variant: 'red', label: 'Sale' },
    'Best Seller': { variant: 'orange', label: 'Best Seller' },
    'Low Stock': { variant: 'orange', label: 'Low Stock' },
    'Pre-order': { variant: 'violet', label: 'Pre-order' },
  }

  const cfg = config[badge]
  if (!cfg) return null
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}
