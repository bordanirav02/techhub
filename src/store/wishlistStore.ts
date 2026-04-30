import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistItem, Product } from '@/types'

interface WishlistStore {
  items: WishlistItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  isWishlisted: (productId: string) => boolean
  clearWishlist: () => void
  moveToCart: (productId: string) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().isWishlisted(product.id)) return
        set(state => ({
          items: [...state.items, { product, addedAt: new Date().toISOString() }],
        }))
      },

      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(i => i.product.id !== productId),
        }))
      },

      toggleItem: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },

      isWishlisted: (productId) =>
        get().items.some(i => i.product.id === productId),

      clearWishlist: () => set({ items: [] }),

      moveToCart: (productId) => {
        get().removeItem(productId)
      },
    }),
    { name: 'techhub-wishlist' }
  )
)
