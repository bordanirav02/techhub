import { useLocalStorage } from './useLocalStorage'
import type { Product } from '@/types'

export const useRecentlyViewed = () => {
  const [items, setItems] = useLocalStorage<Product[]>('techhub-recently-viewed', [])

  const addItem = (product: Product) => {
    setItems(prev => [product, ...prev.filter(p => p.id !== product.id)].slice(0, 12))
  }

  const clearItems = () => setItems([])

  return { items, addItem, clearItems }
}
