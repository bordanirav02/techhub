import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Package } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { formatCurrency } from '@/lib/formatters'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

const BUNDLES = [
  {
    id: 'b1',
    name: 'Work From Home Setup',
    description: 'Everything you need for the ultimate home office',
    productIds: ['p005', 'p014', 'p015', 'p046'],
    originalTotal: 2256,
    bundlePrice: 1799,
  },
  {
    id: 'b2',
    name: 'Apple Ecosystem Starter',
    description: 'iPhone + AirPods Pro + MagSafe',
    productIds: ['p001', 'p007', 'p021'],
    originalTotal: 1447,
    bundlePrice: 1199,
  },
]

export default function Deals() {
  const { data: products, isLoading } = useProducts()
  const { addItem, openDrawer } = useCartStore()
  const [countdown, setCountdown] = useState({ h: 4, m: 12, s: 37 })

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        if (c.s > 0) return { ...c, s: c.s - 1 }
        if (c.m > 0) return { h: c.h, m: c.m - 1, s: 59 }
        if (c.h > 0) return { h: c.h - 1, m: 59, s: 59 }
        return { h: 4, m: 12, s: 37 }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const flashDeals = products?.filter(p => p.discount && p.discount >= 20).slice(0, 8) || []
  const clearance = products?.filter(p => p.discount && p.discount >= 20) || []

  return (
    <main id="main-content" className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 has-bottom-nav">
      {/* Flash Deals */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Flash Deals</h1>
              <p className="text-xs text-[var(--text-muted)]">Lightning-fast savings</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-sm text-[var(--text-muted)]">Ends in:</span>
            {[countdown.h, countdown.m, countdown.s].map((v, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-10 h-10 bg-[var(--bg-card)] border border-red-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold tabular-nums text-red-400">{String(v).padStart(2, '0')}</span>
                </div>
                {i < 2 && <span className="text-red-400 font-bold">:</span>}
              </div>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {flashDeals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>

      {/* Bundle Deals */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-6 h-6 text-violet-400" />
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Bundle Deals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUNDLES.map(bundle => {
            const bundleProducts = products?.filter(p => bundle.productIds.includes(p.id)) || []
            const savings = bundle.originalTotal - bundle.bundlePrice
            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-violet-500/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)]">{bundle.name}</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">{bundle.description}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-violet-500/15 text-violet-400 border border-violet-500/20 rounded-full text-xs font-medium">
                    Save {formatCurrency(savings)}
                  </span>
                </div>

                <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                  {bundleProducts.map(p => (
                    <div key={p.id} className="shrink-0 w-16 text-center">
                      <img src={p.images[0]} alt={p.name} className="w-16 h-16 object-cover rounded-xl mb-1" />
                      <p className="text-[9px] text-[var(--text-muted)] line-clamp-2">{p.name}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-[var(--text-primary)]">{formatCurrency(bundle.bundlePrice)}</span>
                    <span className="text-sm text-[var(--text-muted)] line-through ml-2">{formatCurrency(bundle.originalTotal)}</span>
                  </div>
                  <button
                    onClick={() => {
                      bundleProducts.forEach(p => addItem(p))
                      openDrawer()
                      toast.success('Bundle added to cart!')
                    }}
                    className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Add Bundle
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Clearance */}
      <section>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">🏷️ Clearance Sale</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {clearance.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </main>
  )
}
