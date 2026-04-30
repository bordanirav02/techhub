import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Quote } from 'lucide-react'
import { HeroBanner } from '@/components/home/HeroBanner'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FlashDeals } from '@/components/home/FlashDeals'
import { TrendingProducts } from '@/components/home/TrendingProducts'
import { StatsBar } from '@/components/home/StatsBar'
import { QuickViewModal } from '@/components/product/QuickViewModal'
import { ProductCard } from '@/components/product/ProductCard'
import { useProducts } from '@/hooks/useProducts'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import type { Product } from '@/types'

const TESTIMONIALS = [
  { name: 'Sarah M.', rating: 5, text: 'Amazing products and super fast shipping! Got my MacBook Pro in 2 days.', avatar: 'S' },
  { name: 'James K.', rating: 5, text: 'Best prices I found online. The customer service was phenomenal.', avatar: 'J' },
  { name: 'Emily R.', rating: 5, text: 'Love the variety of products. Everything is exactly as described.', avatar: 'E' },
  { name: 'Mike T.', rating: 5, text: 'Super easy checkout process and excellent product quality!', avatar: 'M' },
  { name: 'Lisa P.', rating: 5, text: 'Returned an item seamlessly. 30-day policy actually works!', avatar: 'L' },
  { name: 'Tom B.', rating: 5, text: 'Great selection of brands. Already ordered twice this month.', avatar: 'T' },
]

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const { data: products } = useProducts()
  const { items: recentlyViewed } = useRecentlyViewed()

  const newArrivals = products?.filter(p => p.isNew).slice(0, 4) || []
  const bestSellers = products?.filter(p => p.isBestSeller).slice(0, 4) || []

  return (
    <main id="main-content" className="has-bottom-nav">
      <HeroBanner />
      <StatsBar />
      <CategoryGrid />
      <FlashDeals />
      <TrendingProducts onQuickView={setQuickViewProduct} />

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2 block">Just Launched</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">New Arrivals</h2>
            </div>
            <Link to="/products?filter=new" className="text-sm text-blue-400 hover:text-blue-300 hidden sm:block">
              View all →
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Brand Spotlight */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1c2e] to-[#0d0d18] border border-[var(--border-color)] p-8 md:p-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-violet-600/10" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Brand Spotlight</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Apple <span className="gradient-text">Ecosystem</span>
              </h2>
              <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                Experience seamless integration across all your devices. iPhone, MacBook, iPad, Apple Watch — all designed to work together beautifully.
              </p>
              <Link
                to="/products?brand=Apple"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Shop Apple <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {products?.filter(p => p.brand === 'Apple').slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all hover:-translate-y-1 group"
                >
                  <img src={p.images[0]} alt={p.name} className="w-full h-24 object-contain mb-2" />
                  <p className="text-xs text-white/60 truncate group-hover:text-white/80 transition-colors">{p.name}</p>
                  <p className="text-sm font-bold text-white">${p.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="bg-[var(--bg-surface)] border-y border-[var(--border-color)] py-16">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-8"
            >
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2 block">Most Popular</span>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Best Sellers</h2>
              </div>
              <Link to="/products?filter=bestseller" className="text-sm text-blue-400 hover:text-blue-300 hidden sm:block">
                View all →
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bestSellers.map((p, i) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Recently Viewed</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {recentlyViewed.slice(0, 6).map((p, i) => (
              <div key={p.id} className="w-56 shrink-0">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="bg-[var(--bg-surface)] border-t border-[var(--border-color)] py-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">What Our Customers Say</h2>
            <p className="text-[var(--text-muted)] mt-2">Trusted by 50,000+ happy customers worldwide</p>
          </motion.div>

          <div className="marquee-container">
            <div className="marquee-track gap-4 flex">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div
                  key={i}
                  className="w-72 shrink-0 p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl"
                >
                  <Quote className="w-5 h-5 text-blue-400/50 mb-3" />
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{t.name}</p>
                      <div className="flex text-amber-400 text-xs">{'★'.repeat(t.rating)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </main>
  )
}
