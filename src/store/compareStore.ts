import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

interface CompareStore {
  items: Product[]
  addItem: (product: Product) => boolean
  removeItem: (productId: string) => void
  isComparing: (productId: string) => boolean
  clearAll: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().items.length >= 4) return false
        if (get().isComparing(product.id)) return false
        set(state => ({ items: [...state.items, product] }))
        return true
      },

      removeItem: (productId) => {
        set(state => ({ items: state.items.filter(p => p.id !== productId) }))
      },

      isComparing: (productId) => get().items.some(p => p.id === productId),

      clearAll: () => set({ items: [] }),
    }),
    { name: 'techhub-compare' }
  )
)
