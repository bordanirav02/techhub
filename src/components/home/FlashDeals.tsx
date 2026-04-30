import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'

export const FlashDeals = () => {
  const { data: products, isLoading } = useProducts()
  const [countdown, setCountdown] = useState({ h: 3, m: 25, s: 44 })
  const scrollRef = useRef<HTMLDivElement>(null)

  const deals = products?.filter(p => p.discount && p.discount >= 15).slice(0, 8) || []

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c.s > 0) return { ...c, s: c.s - 1 }
        if (c.m > 0) return { h: c.h, m: c.m - 1, s: 59 }
        if (c.h > 0) return { h: c.h - 1, m: 59, s: 59 }
        return { h: 3, m: 25, s: 44 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  return (
    <section className="bg-[var(--bg-surface)] border-y border-[var(--border-color)] py-14">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Flash Deals</h2>
                <p className="text-xs text-[var(--text-muted)]">Limited-time offers</p>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">Ends in</span>
              {[
                { v: countdown.h, l: 'H' },
                { v: countdown.m, l: 'M' },
                { v: countdown.s, l: 'S' },
              ].map(({ v, l }, i) => (
                <div key={l} className="flex items-center gap-1">
                  <div className="w-9 h-9 bg-[var(--bg-card)] border border-red-500/20 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-sm font-bold tabular-nums text-red-400 leading-none">
                      {String(v).padStart(2, '0')}
                    </span>
                    <span className="text-[8px] text-[var(--text-muted)]">{l}</span>
                  </div>
                  {i < 2 && <span className="text-red-400 font-bold text-sm">:</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] hover:border-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] hover:border-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link to="/deals" className="text-sm text-blue-400 hover:text-blue-300 font-medium">View all</Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-64 shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))
            : deals.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="w-64 shrink-0"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={p} index={i} />
                </motion.div>
              ))
          }
        </div>
      </div>
    </section>
  )
}
