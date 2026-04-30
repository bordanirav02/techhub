import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types'

interface TrendingProductsProps {
  onQuickView: (product: Product) => void
}

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'smartphones', label: 'Phones' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'headphones', label: 'Audio' },
  { id: 'smartwatches', label: 'Watches' },
]

export const TrendingProducts = ({ onQuickView }: TrendingProductsProps) => {
  const { data: products, isLoading } = useProducts()
  const [activeTab, setActiveTab] = useState('all')

  const trending = products
    ? [...products]
        .filter(p => activeTab === 'all' || p.category === activeTab)
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 8)
    : []

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Trending Now</h2>
            <p className="text-sm text-[var(--text-muted)]">Most popular this week</p>
          </div>
        </div>
        <Link to="/products" className="text-sm text-blue-400 hover:text-blue-300 hidden sm:block">
          View all →
        </Link>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-glow-blue'
                : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-blue-500/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : trending.map((p, i) => (
              <ProductCard key={p.id} product={p} onQuickView={onQuickView} index={i} />
            ))
        }
      </div>
    </section>
  )
}
