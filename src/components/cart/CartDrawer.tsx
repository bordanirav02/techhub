import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Minus, Plus, Trash2, Tag, X, ShoppingBag } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/formatters'
import toast from 'react-hot-toast'

export const CartDrawer = () => {
  const {
    items, isDrawerOpen, closeDrawer, removeItem, updateQuantity,
    couponCode, couponDiscount, applyCoupon, removeCoupon,
    getSubtotal, getShipping, getTax, getTotal,
  } = useCartStore()

  const [couponInput, setCouponInput] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      toast.success('Coupon applied!')
    } else {
      toast.error('Invalid coupon code')
    }
    setCouponInput('')
  }

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const tax = getTax()
  const total = getTotal()
  const savings = (subtotal - total) + shipping

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title={`Cart (${items.reduce((s, i) => s + i.quantity, 0)} items)`}
      width="w-full max-w-[420px]"
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
          <div className="w-20 h-20 bg-[var(--bg-card)] rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Your cart is empty</h3>
          <p className="text-sm text-[var(--text-muted)] mb-6">Add products to start shopping</p>
          <Button onClick={closeDrawer} fullWidth icon={<ShoppingBag className="w-4 h-4" />}>
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence initial={false}>
              {items.map(item => {
                const key = `${item.product.id}__${item.selectedColor?.name}__${item.selectedStorage}`
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-3 p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]"
                  >
                    <Link to={`/products/${item.product.id}`} onClick={closeDrawer}>
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-18 h-18 object-cover rounded-lg shrink-0"
                        style={{ width: '72px', height: '72px' }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product.id}`}
                        onClick={closeDrawer}
                        className="text-sm font-medium text-[var(--text-primary)] hover:text-blue-400 transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      {(item.selectedColor || item.selectedStorage) && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {item.selectedColor?.name} {item.selectedStorage && `· ${item.selectedStorage}`}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 bg-[var(--bg-hover)] rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor?.name, item.selectedStorage)}
                            className="w-6 h-6 flex items-center justify-center hover:text-blue-400 transition-colors rounded"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor?.name, item.selectedStorage)}
                            className="w-6 h-6 flex items-center justify-center hover:text-blue-400 transition-colors rounded"
                            disabled={item.quantity >= item.product.stock}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[var(--text-primary)]">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => {
                              removeItem(item.product.id, item.selectedColor?.name, item.selectedStorage)
                              toast.success('Removed from cart')
                            }}
                            className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Bottom summary */}
          <div className="border-t border-[var(--border-color)] p-4 space-y-3 shrink-0">
            {/* Coupon */}
            {couponCode ? (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-emerald-400 font-medium flex-1">{couponCode} — {formatCurrency(couponDiscount)} off</span>
                <button onClick={removeCoupon} className="text-[var(--text-muted)] hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50 transition-colors"
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-blue-500/50 text-sm text-[var(--text-secondary)] hover:text-blue-400 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-400' : ''}>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-[var(--text-primary)] pt-2 border-t border-[var(--border-color)] text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              {savings > 0.01 && (
                <p className="text-xs text-emerald-400 text-right">You save {formatCurrency(savings)}!</p>
              )}
            </div>

            {/* CTAs */}
            <Link
              to="/cart"
              onClick={closeDrawer}
              className="block w-full text-center py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
            >
              Checkout — {formatCurrency(total)}
            </Link>
            <Link
              to="/cart"
              onClick={closeDrawer}
              className="block w-full text-center py-2.5 border border-[var(--border-color)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl text-sm transition-colors"
            >
              View full cart
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  )
}
