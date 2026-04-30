import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Trash2, Plus, Minus, Tag, X, ArrowRight, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, estimateDelivery, generateOrderId } from '@/lib/formatters'
import { Button } from '@/components/ui/Button'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard'
import toast from 'react-hot-toast'
import type { Order } from '@/types'

const CHECKOUT_STEPS = ['Shipping', 'Payment', 'Review']

export default function Cart() {
  const navigate = useNavigate()
  const {
    items, removeItem, updateQuantity, clearCart,
    couponCode, couponDiscount, applyCoupon, removeCoupon,
    getSubtotal, getShipping, getTax, getTotal,
  } = useCartStore()
  const { addOrder, isAuthenticated } = useAuthStore()
  const { data: products } = useProducts()

  const [couponInput, setCouponInput] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [shipping, setShipping] = useState({ fullName: '', street: '', city: '', state: '', zip: '', country: 'US' })
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', nameOnCard: '' })
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const subtotal = getSubtotal()
  const shippingCost = getShipping()
  const tax = getTax()
  const total = getTotal()
  const savings = couponDiscount + (subtotal >= 50 ? 0 : 0)

  const upsells = products?.filter(p => !items.some(i => i.product.id === p.id)).slice(0, 4) || []

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      toast.success('Coupon applied!')
      setCouponInput('')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    await new Promise(r => setTimeout(r, 1500))

    const orderId = generateOrderId()
    const order: Order = {
      id: orderId,
      userId: 'guest',
      items: items.map(i => ({
        product: i.product,
        quantity: i.quantity,
        selectedColor: i.selectedColor,
        selectedStorage: i.selectedStorage,
        unitPrice: i.product.price,
      })),
      subtotal,
      shipping: shippingCost,
      tax,
      discount: couponDiscount,
      total,
      couponCode: couponCode || undefined,
      status: 'Processing',
      statusHistory: [{ status: 'Processing', timestamp: new Date().toISOString(), description: 'Order placed successfully' }],
      shippingAddress: { id: 'a1', label: 'Home', isDefault: true, ...shipping },
      paymentMethod: payment.cardNumber ? `Card ending in ${payment.cardNumber.slice(-4)}` : 'Cash on Delivery',
      estimatedDelivery: estimateDelivery(3),
      createdAt: new Date().toISOString(),
    }

    if (isAuthenticated) addOrder(order)
    else {
      const orders = JSON.parse(localStorage.getItem('guest-orders') || '[]')
      orders.unshift(order)
      localStorage.setItem('guest-orders', JSON.stringify(orders))
    }

    clearCart()
    setCheckoutOpen(false)
    setIsPlacingOrder(false)
    navigate(`/order-confirmation/${orderId}`)
  }

  if (items.length === 0 && !checkoutOpen) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-16 text-center has-bottom-nav">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-[var(--bg-card)] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-[var(--text-muted)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Your cart is empty</h1>
          <p className="text-[var(--text-muted)] mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
            <ShoppingBag className="w-5 h-5" /> Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 has-bottom-nav">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-sm text-[var(--text-muted)] mb-2">
            <span>{items.reduce((s, i) => s + i.quantity, 0)} items</span>
            <button onClick={clearCart} className="text-red-400 hover:text-red-300 transition-colors">Remove all</button>
          </div>

          <AnimatePresence>
            {items.map(item => {
              const key = `${item.product.id}__${item.selectedColor?.name}__${item.selectedStorage}`
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-4 p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl"
                >
                  <Link to={`/products/${item.product.id}`}>
                    <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product.id}`} className="text-sm font-semibold text-[var(--text-primary)] hover:text-blue-400 transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.product.brand}</p>
                    {(item.selectedColor || item.selectedStorage) && (
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {item.selectedColor?.name}{item.selectedStorage ? ` · ${item.selectedStorage}` : ''}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-[var(--bg-hover)] rounded-xl p-0.5">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor?.name, item.selectedStorage)}
                          className="w-8 h-8 flex items-center justify-center hover:text-blue-400 transition-colors rounded-lg">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor?.name, item.selectedStorage)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 flex items-center justify-center hover:text-blue-400 transition-colors rounded-lg disabled:opacity-40">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[var(--text-primary)]">{formatCurrency(item.product.price * item.quantity)}</span>
                        <button
                          onClick={() => { removeItem(item.product.id, item.selectedColor?.name, item.selectedStorage); toast.success('Removed') }}
                          className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
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

          {/* Upsells */}
          {upsells.length > 0 && (
            <div className="mt-8">
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">You might also need</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {upsells.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 sticky top-20">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-4">Order Summary</h2>

            {/* Coupon */}
            {couponCode ? (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4">
                <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-emerald-400 flex-1 font-medium">{couponCode} — {formatCurrency(couponDiscount)} off</span>
                <button onClick={removeCoupon}><X className="w-4 h-4 text-[var(--text-muted)]" /></button>
              </div>
            ) : (
              <div className="flex gap-2 mb-4">
                <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Coupon code" onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                  className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none" />
                <button onClick={handleApplyCoupon} className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors">
                  Apply
                </button>
              </div>
            )}

            <div className="space-y-2 text-sm border-t border-[var(--border-color)] pt-4">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-emerald-400 font-medium' : ''}>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between font-bold text-[var(--text-primary)] text-lg border-t border-[var(--border-color)] pt-4 mt-4">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {savings > 0 && (
              <p className="text-sm text-emerald-400 text-right mt-1">You save {formatCurrency(savings + (shippingCost === 0 ? 9.99 : 0))}!</p>
            )}

            <p className="text-xs text-[var(--text-muted)] mt-1">
              Estimated delivery: <span className="text-[var(--text-primary)]">{estimateDelivery(3)}</span>
            </p>

            <Button
              fullWidth
              size="lg"
              className="mt-4"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              onClick={() => setCheckoutOpen(true)}
            >
              Proceed to Checkout
            </Button>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {['🔒 Secure', '↩️ 30-day', '✅ Verified'].map(t => (
                <div key={t} className="text-center text-xs text-[var(--text-muted)] bg-[var(--bg-hover)] rounded-lg py-1.5">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCheckoutOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Progress */}
              <div className="p-5 border-b border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-[var(--text-primary)]">Checkout</h2>
                  <button onClick={() => setCheckoutOpen(false)} className="text-[var(--text-muted)]"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex gap-1">
                  {CHECKOUT_STEPS.map((s, i) => (
                    <div key={s} className="flex-1">
                      <div className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-blue-500' : 'bg-[var(--bg-hover)]'}`} />
                      <p className={`text-xs mt-1 text-center ${i === step ? 'text-blue-400' : 'text-[var(--text-muted)]'}`}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 max-h-[60vh] overflow-y-auto">
                {step === 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[var(--text-primary)]">Shipping Address</h3>
                    {Object.keys(shipping).map(k => (
                      <input key={k} placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                        value={(shipping as Record<string, string>)[k]}
                        onChange={e => setShipping(prev => ({ ...prev, [k]: e.target.value }))}
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50" />
                    ))}
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[var(--text-primary)]">Payment</h3>
                    {[
                      { key: 'cardNumber', placeholder: 'Card Number (16 digits)' },
                      { key: 'expiry', placeholder: 'MM/YY' },
                      { key: 'cvv', placeholder: 'CVV' },
                      { key: 'nameOnCard', placeholder: 'Name on Card' },
                    ].map(({ key, placeholder }) => (
                      <input key={key} placeholder={placeholder}
                        value={(payment as Record<string, string>)[key]}
                        onChange={e => setPayment(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50" />
                    ))}
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">🔒 Your payment info is encrypted and secure. This is a demo — no real charges.</p>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[var(--text-primary)]">Review Order</h3>
                    <div className="space-y-2">
                      {items.slice(0, 3).map(i => (
                        <div key={i.product.id} className="flex gap-3 items-center">
                          <img src={i.product.images[0]} alt={i.product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--text-primary)] truncate">{i.product.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">Qty: {i.quantity}</p>
                          </div>
                          <p className="text-sm font-bold">{formatCurrency(i.product.price * i.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[var(--bg-card)] rounded-xl p-4 space-y-1.5 text-sm">
                      <div className="flex justify-between text-[var(--text-secondary)]"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                      <div className="flex justify-between text-[var(--text-secondary)]"><span>Shipping</span><span className={shippingCost === 0 ? 'text-emerald-400' : ''}>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span></div>
                      <div className="flex justify-between font-bold text-[var(--text-primary)] pt-2 border-t border-[var(--border-color)]"><span>Total</span><span>{formatCurrency(total)}</span></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-[var(--border-color)] flex gap-3">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl font-medium hover:border-[var(--border-hover)] transition-colors">
                    Back
                  </button>
                )}
                {step < 2 ? (
                  <button onClick={() => setStep(s => s + 1)} className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors">
                    Continue
                  </button>
                ) : (
                  <Button fullWidth size="lg" loading={isPlacingOrder} onClick={handlePlaceOrder}>
                    Place Order — {formatCurrency(total)}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
