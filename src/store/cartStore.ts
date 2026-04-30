import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, ProductColor } from '@/types'

interface CartStore {
  items: CartItem[]
  couponCode: string | null
  couponDiscount: number
  isDrawerOpen: boolean

  addItem: (product: Product, color?: ProductColor, storage?: string) => void
  removeItem: (productId: string, color?: string, storage?: string) => void
  updateQuantity: (productId: string, quantity: number, color?: string, storage?: string) => void
  clearCart: () => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  openDrawer: () => void
  closeDrawer: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getShipping: () => number
  getTax: () => number
  getTotal: () => number
}

const COUPONS: Record<string, { type: 'percent' | 'flat'; value: number }> = {
  SAVE10: { type: 'percent', value: 10 },
  TECH20: { type: 'percent', value: 20 },
  FLAT50: { type: 'flat', value: 50 },
  WELCOME: { type: 'percent', value: 15 },
  STUDENT: { type: 'percent', value: 25 },
}

const getItemKey = (productId: string, color?: string, storage?: string) =>
  `${productId}__${color || 'default'}__${storage || 'default'}`

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,
      isDrawerOpen: false,

      addItem: (product, color, storage) => {
        set(state => {
          const key = getItemKey(product.id, color?.name, storage)
          const existing = state.items.find(
            i => getItemKey(i.product.id, i.selectedColor?.name, i.selectedStorage) === key
          )
          if (existing) {
            return {
              items: state.items.map(i =>
                getItemKey(i.product.id, i.selectedColor?.name, i.selectedStorage) === key
                  ? { ...i, quantity: Math.min(i.quantity + 1, i.product.stock) }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { product, quantity: 1, selectedColor: color, selectedStorage: storage }],
          }
        })
      },

      removeItem: (productId, color, storage) => {
        const key = getItemKey(productId, color, storage)
        set(state => ({
          items: state.items.filter(
            i => getItemKey(i.product.id, i.selectedColor?.name, i.selectedStorage) !== key
          ),
        }))
      },

      updateQuantity: (productId, quantity, color, storage) => {
        const key = getItemKey(productId, color, storage)
        if (quantity <= 0) {
          get().removeItem(productId, color, storage)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            getItemKey(i.product.id, i.selectedColor?.name, i.selectedStorage) === key
              ? { ...i, quantity: Math.min(quantity, i.product.stock) }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

      applyCoupon: (code) => {
        const coupon = COUPONS[code.toUpperCase()]
        if (!coupon) return false
        const subtotal = get().getSubtotal()
        const discount = coupon.type === 'percent'
          ? (subtotal * coupon.value) / 100
          : Math.min(coupon.value, subtotal)
        set({ couponCode: code.toUpperCase(), couponDiscount: discount })
        return true
      },

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal >= 50 ? 0 : 9.99
      },

      getTax: () => {
        const subtotal = get().getSubtotal()
        const discount = get().couponDiscount
        return (subtotal - discount) * 0.08
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const shipping = get().getShipping()
        const tax = get().getTax()
        const discount = get().couponDiscount
        return Math.max(0, subtotal + shipping + tax - discount)
      },
    }),
    { name: 'techhub-cart' }
  )
)
