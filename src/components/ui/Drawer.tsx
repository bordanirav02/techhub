import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'right' | 'left' | 'bottom'
  width?: string
}

export const Drawer = ({ isOpen, onClose, title, children, side = 'right', width = 'w-full max-w-md' }: DrawerProps) => {
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

  const variants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      className: `right-0 top-0 h-full ${width}`,
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
      className: `left-0 top-0 h-full ${width}`,
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      className: 'bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl',
    },
  }

  const v = variants[side]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`absolute ${v.className} bg-[var(--bg-surface)] border-l border-[var(--border-color)] flex flex-col shadow-2xl overflow-hidden`}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] shrink-0">
              {title && <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>}
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
