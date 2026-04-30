import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BarChart2, Plus } from 'lucide-react'
import { useCompareStore } from '@/store/compareStore'

export const CompareBar = () => {
  const navigate = useNavigate()
  const { items, removeItem, clearAll } = useCompareStore()

  return (
    <AnimatePresence>
      {items.length >= 1 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl"
        >
          <div
            className="glass rounded-2xl border border-[var(--border-color)] px-4 py-3 flex items-center gap-3"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
          >
            <BarChart2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs font-semibold text-[var(--text-secondary)] shrink-0 hidden sm:block">Compare:</span>

            <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {items.map(product => (
                <div
                  key={product.id}
                  className="flex items-center gap-1.5 bg-[var(--bg-hover)] rounded-xl px-2.5 py-1.5 shrink-0"
                >
                  <img src={product.images[0]} alt={product.name} className="w-7 h-7 object-contain rounded-lg" />
                  <span className="text-xs text-[var(--text-primary)] max-w-[80px] truncate font-medium">{product.name}</span>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-[var(--text-muted)] hover:text-red-400 transition-colors ml-0.5"
                    aria-label={`Remove ${product.name} from compare`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {items.length < 4 && (
                <div className="flex items-center gap-1.5 border border-dashed border-[var(--border-color)] rounded-xl px-2.5 py-1.5 shrink-0">
                  <Plus className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span className="text-xs text-[var(--text-muted)]">Add product</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={clearAll}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors hidden sm:block"
              >
                Clear
              </button>
              <button
                onClick={() => navigate('/compare')}
                disabled={items.length < 2}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Compare {items.length < 2 ? `(need ${2 - items.length} more)` : `(${items.length})`}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
