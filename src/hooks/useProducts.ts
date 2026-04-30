import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/types'

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch('/products.json')
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export const useProducts = () =>
  useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })

export const useProduct = (id: string) => {
  const { data: products, ...rest } = useProducts()
  return {
    data: products?.find(p => p.id === id),
    ...rest,
  }
}

export const useProductsByCategory = (category: string) => {
  const { data: products, ...rest } = useProducts()
  return {
    data: products?.filter(p => p.category === category),
    ...rest,
  }
}
