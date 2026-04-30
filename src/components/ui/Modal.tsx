import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-screen-xl',
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md', showClose = true }: ModalProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      document.addEventListener('keydown', handler)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${sizes[size]} bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden`}
            role="dialog"
            aria-modal="true"
          >
            {(title || showClose) && (
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
                {title && <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="ml-auto p-1.5 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
