import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { TRENDING_SEARCHES } from '@/lib/constants'
import { useUIStore } from '@/store/uiStore'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { data: products, isLoading } = useProducts()
  const { recentSearches } = useUIStore()

  const results = useMemo(() => {
    if (!products || !query) return []
    const q = query.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }, [products, query])

  return (
    <main id="main-content" className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 has-bottom-nav">
      {query ? (
        <>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">
            {results.length} results for &ldquo;{query}&rdquo;
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">Showing all matching products</p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <SearchIcon className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No results found</h2>
              <p className="text-[var(--text-muted)] mb-6">Try a different search term</p>
              <div className="flex flex-wrap justify-center gap-2">
                {TRENDING_SEARCHES.map(s => (
                  <a key={s} href={`/search?q=${encodeURIComponent(s)}`}
                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full text-sm text-[var(--text-secondary)] hover:border-blue-500/50 transition-colors">
                    {s}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </>
      ) : (
        <div>
          {recentSearches.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(s => (
                  <a key={s} href={`/search?q=${encodeURIComponent(s)}`}
                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full text-sm text-[var(--text-secondary)] hover:border-blue-500/50 transition-colors">
                    🕑 {s}
                  </a>
                ))}
              </div>
            </div>
          )}
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">Trending Searches</h2>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((s, i) => (
              <a key={s} href={`/search?q=${encodeURIComponent(s)}`}
                className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full text-sm text-[var(--text-secondary)] hover:border-blue-500/50 transition-colors">
                {['🔥', '⚡', '💻', '🎧', '🖥️', '📱', '⌚', '📸'][i % 8]} {s}
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
