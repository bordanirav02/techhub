import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Badge } from '@/components/ui/Badge'
import type { OrderStatus } from '@/types'

const statusVariant: Record<OrderStatus, 'blue' | 'orange' | 'green' | 'red' | 'gray' | 'violet'> = {
  Processing: 'blue',
  Confirmed: 'blue',
  Shipped: 'violet',
  'Out for Delivery': 'orange',
  Delivered: 'green',
  Cancelled: 'red',
  Returned: 'gray',
}

export default function Orders() {
  const { orders } = useAuthStore()
  const guestOrders = JSON.parse(localStorage.getItem('guest-orders') || '[]')
  const allOrders = [...orders, ...guestOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  if (allOrders.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-12 text-center">
        <Package className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No orders yet</h2>
        <p className="text-[var(--text-muted)] mb-6">Your order history will appear here</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--text-primary)]">Order History</h2>
      {allOrders.map(order => (
        <div key={order.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-mono font-bold text-blue-400">{order.id}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDate(order.createdAt)}</p>
            </div>
            <Badge variant={statusVariant[order.status as OrderStatus] || 'gray'}>{order.status}</Badge>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
            {order.items.slice(0, 4).map((item: { product: { id: string; images: string[]; name: string }; quantity: number }, i: number) => (
              <div key={i} className="relative shrink-0">
                <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 object-cover rounded-xl" />
                {item.quantity > 1 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {item.quantity}
                  </span>
                )}
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="w-14 h-14 bg-[var(--bg-hover)] rounded-xl flex items-center justify-center text-xs text-[var(--text-muted)] shrink-0">
                +{order.items.length - 4}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-[var(--text-muted)]">{order.items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0)} items · </span>
              <span className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(order.total)}</span>
            </div>
            <Link to={`/account/orders/${order.id}`}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
              View Details →
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
