import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, estimateDelivery } from '@/lib/formatters'

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>()
  const { orders } = useAuthStore()

  const order = orders.find(o => o.id === id) ||
    JSON.parse(localStorage.getItem('guest-orders') || '[]').find((o: { id: string }) => o.id === id)

  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-16 text-center has-bottom-nav">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Order Placed!</h1>
          <p className="text-[var(--text-muted)] mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[var(--text-muted)]">Order ID</span>
              <span className="text-sm font-mono font-bold text-blue-400">{id}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[var(--text-muted)]">Estimated Delivery</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{estimateDelivery(3)}</span>
            </div>
            {order && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[var(--text-muted)]">Items</span>
                  <span className="text-sm text-[var(--text-primary)]">{order.items.length} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">Total</span>
                  <span className="text-sm font-bold text-blue-400">{formatCurrency(order.total)}</span>
                </div>
              </>
            )}
          </div>

          {order && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Order Status</h3>
              {order.statusHistory.map((s: { status: string; description: string }, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <p className="text-sm text-[var(--text-secondary)]">{s.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/account/orders"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
            >
              <Package className="w-5 h-5" /> Track Order
            </Link>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-[var(--border-color)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl font-medium transition-colors"
            >
              <Home className="w-5 h-5" /> Continue Shopping
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}
