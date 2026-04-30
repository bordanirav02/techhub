import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle, Clock, Truck, Home, RotateCcw } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import type { Order, OrderStatus } from '@/types'

const statusVariant: Record<OrderStatus, 'blue' | 'orange' | 'green' | 'red' | 'gray' | 'violet'> = {
  Processing: 'blue',
  Confirmed: 'blue',
  Shipped: 'violet',
  'Out for Delivery': 'orange',
  Delivered: 'green',
  Cancelled: 'red',
  Returned: 'gray',
}

const STATUS_STEPS: OrderStatus[] = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered']

const stepIcon = (status: OrderStatus) => {
  const icons: Record<string, React.ReactNode> = {
    Processing: <Clock className="w-4 h-4" />,
    Confirmed: <CheckCircle className="w-4 h-4" />,
    Shipped: <Package className="w-4 h-4" />,
    'Out for Delivery': <Truck className="w-4 h-4" />,
    Delivered: <Home className="w-4 h-4" />,
  }
  return icons[status] || <CheckCircle className="w-4 h-4" />
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { orders } = useAuthStore()
  const guestOrders: Order[] = JSON.parse(localStorage.getItem('guest-orders') || '[]')
  const allOrders: Order[] = [...orders, ...guestOrders]

  const order = allOrders.find(o => o.id === id)
  if (!order) return <Navigate to="/account/orders" replace />

  const currentStep = STATUS_STEPS.indexOf(order.status as OrderStatus)
  const isCancelled = order.status === 'Cancelled' || order.status === 'Returned'

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          to="/account/orders"
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Orders
        </Link>
        <span className="text-[var(--text-muted)]">/</span>
        <span className="text-sm font-mono text-blue-400">{order.id}</span>
      </div>

      {/* Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Order ID</p>
            <p className="font-mono font-bold text-blue-400 text-lg">{order.id}</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <Badge variant={statusVariant[order.status as OrderStatus] || 'gray'} className="text-sm px-3 py-1">
            {order.status}
          </Badge>
        </div>
      </div>

      {/* Order timeline */}
      {!isCancelled && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5">Order Progress</h3>
          <div className="relative">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-[var(--border-color)]" />
            <div
              className="absolute top-5 left-5 h-0.5 bg-blue-500 transition-all duration-700"
              style={{ width: currentStep >= 0 ? `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` : '0%', right: 'auto' }}
            />
            <div className="relative flex justify-between">
              {STATUS_STEPS.map((step, i) => {
                const done = currentStep >= i
                const active = currentStep === i
                return (
                  <div key={step} className="flex flex-col items-center gap-2 flex-1 first:items-start last:items-end">
                    <motion.div
                      initial={false}
                      animate={{ scale: active ? 1.15 : 1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        done ? 'bg-blue-500 text-white' : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
                      } ${active ? 'ring-4 ring-blue-500/30' : ''}`}
                    >
                      {stepIcon(step)}
                    </motion.div>
                    <span className={`text-[10px] font-medium text-center leading-tight hidden sm:block ${
                      done ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                    }`}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[var(--border-color)] space-y-2">
              {[...order.statusHistory].reverse().map((event, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">{event.status}</span>
                    {event.description && <span className="text-[var(--text-muted)] ml-2">— {event.description}</span>}
                    <p className="text-xs text-[var(--text-muted)]">{formatDate(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-400">Order {order.status}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">This order was {order.status.toLowerCase()}.</p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Package className="w-4 h-4" />
          {order.items.length} Item{order.items.length !== 1 ? 's' : ''}
        </h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <Link to={`/products/${item.product.id}`}>
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-contain bg-[var(--bg-hover)] rounded-xl shrink-0"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product.id}`} className="block">
                  <p className="text-sm font-medium text-[var(--text-primary)] hover:text-blue-400 transition-colors truncate">
                    {item.product.name}
                  </p>
                </Link>
                <p className="text-xs text-[var(--text-muted)]">{item.product.brand}</p>
                {item.selectedColor && (
                  <p className="text-xs text-[var(--text-muted)]">Color: {item.selectedColor.name}</p>
                )}
                {item.selectedStorage && (
                  <p className="text-xs text-[var(--text-muted)]">Storage: {item.selectedStorage}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(item.unitPrice * item.quantity)}</p>
                <p className="text-xs text-[var(--text-muted)]">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Address + Payment side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {order.shippingAddress && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Shipping Address
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-[var(--text-muted)]">{order.shippingAddress.street}</p>
            <p className="text-sm text-[var(--text-muted)]">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <p className="text-sm text-[var(--text-muted)]">{order.shippingAddress.country}</p>
          </div>
        )}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Order Summary
          </h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Subtotal</span>
              <span className="text-[var(--text-secondary)]">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span>−{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Shipping</span>
              <span className="text-[var(--text-secondary)]">
                {order.shipping === 0 ? <span className="text-green-400">Free</span> : formatCurrency(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Tax</span>
              <span className="text-[var(--text-secondary)]">{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[var(--border-color)] font-bold">
              <span className="text-[var(--text-primary)]">Total</span>
              <span className="text-[var(--text-primary)]">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/products"
          className="px-5 py-2.5 border border-[var(--border-color)] text-sm font-medium text-[var(--text-secondary)] rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
        >
          Continue Shopping
        </Link>
        {order.status === 'Delivered' && (
          <Link
            to={`/products/${order.items[0]?.product.id}`}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white rounded-xl transition-colors"
          >
            Write a Review
          </Link>
        )}
      </div>
    </div>
  )
}
