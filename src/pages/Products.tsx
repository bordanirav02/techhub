import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Grid2X2, Grid3X3, List, X, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard'
import { QuickViewModal } from '@/components/product/QuickViewModal'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { Drawer } from '@/components/ui/Drawer'
import { CATEGORIES, BRANDS, SORT_OPTIONS } from '@/lib/constants'
import type { Product, SortOption, ViewMode } from '@/types'
import { useDebounce } from '@/hooks/useDebounce'

interface Filters {
  categories: string[]
  brands: string[]
  minPrice: number
  maxPrice: number
  minRating: number
  inStock: boolean
  onSale: boolean
  isNew: boolean
}

const DEFAULT_FILTERS: Filters = {
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 5000,
  minRating: 0,
  inStock: false,
  onSale: false,
  isNew: false,
}

const FilterSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[var(--border-color)] pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm font-semibold text-[var(--text-primary)] mb-3"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FilterPanel = ({ filters, onChange, onReset }: {
  filters: Filters
  onChange: (f: Partial<Filters>) => void
  onReset: () => void
}) => {
  const toggle = (key: 'categories' | 'brands', value: string) => {
    const current = filters[key]
    onChange({ [key]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] })
  }

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-[var(--text-primary)]">Filters</span>
        <button onClick={onReset} className="text-xs text-blue-400 hover:text-blue-300">Reset all</button>
      </div>

      <FilterSection title="Category">
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.id)}
                onChange={() => toggle('categories', cat.id)}
                className="w-4 h-4 rounded border-[var(--border-color)] text-blue-500 bg-[var(--bg-card)] focus:ring-blue-500/30"
              />
              <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{cat.label}</span>
              <span className="ml-auto text-xs text-[var(--text-muted)]">{cat.icon}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brand" defaultOpen={false}>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggle('brands', brand)}
                className="w-4 h-4 rounded border-[var(--border-color)] text-blue-500 bg-[var(--bg-card)] focus:ring-blue-500/30"
              />
              <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.minPrice}
              onChange={e => onChange({ minPrice: Number(e.target.value) })}
              placeholder="Min"
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] outline-none"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={e => onChange({ maxPrice: Number(e.target.value) })}
              placeholder="Max"
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] outline-none"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="space-y-2">
          {[4, 3, 2].map(r => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => onChange({ minRating: filters.minRating === r ? 0 : r })}
                className="w-4 h-4 text-blue-500"
              />
              <span className="text-amber-400">{'★'.repeat(r)}</span>
              <span className="text-[var(--text-secondary)] text-xs">& up</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability" defaultOpen={false}>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={filters.inStock} onChange={e => onChange({ inStock: e.target.checked })}
              className="w-4 h-4 rounded text-blue-500" />
            <span className="text-[var(--text-secondary)]">In Stock Only</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={filters.onSale} onChange={e => onChange({ onSale: e.target.checked })}
              className="w-4 h-4 rounded text-blue-500" />
            <span className="text-[var(--text-secondary)]">On Sale</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={filters.isNew} onChange={e => onChange({ isNew: e.target.checked })}
              className="w-4 h-4 rounded text-blue-500" />
            <span className="text-[var(--text-secondary)]">New Arrivals</span>
          </label>
        </div>
      </FilterSection>
    </div>
  )
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: products, isLoading } = useProducts()
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    brands: searchParams.get('brand') ? [searchParams.get('brand')!] : [],
  })
  const [sort, setSort] = useState<SortOption>('relevance')
  const [viewMode, setViewMode] = useState<ViewMode>('grid-3')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

  const debouncedSearch = useDebounce(searchQuery, 300)

  const updateFilters = useCallback((partial: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...partial }))
  }, [])

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  const filtered = useMemo(() => {
    if (!products) return []
    let result = [...products]

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    }

    if (filters.categories.length > 0) result = result.filter(p => filters.categories.includes(p.category))
    if (filters.brands.length > 0) result = result.filter(p => filters.brands.includes(p.brand))
    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice)
    if (filters.minRating > 0) result = result.filter(p => p.rating >= filters.minRating)
    if (filters.inStock) result = result.filter(p => p.stock > 0)
    if (filters.onSale) result = result.filter(p => p.discount && p.discount > 0)
    if (filters.isNew) result = result.filter(p => p.isNew)

    switch (sort) {
      case 'price-asc': return result.sort((a, b) => a.price - b.price)
      case 'price-desc': return result.sort((a, b) => b.price - a.price)
      case 'rating': return result.sort((a, b) => b.rating - a.rating)
      case 'newest': return result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      case 'best-seller': return result.sort((a, b) => b.reviewCount - a.reviewCount)
      default: return result
    }
  }, [products, debouncedSearch, filters, sort])

  const activeFilterCount = [
    ...filters.categories,
    ...filters.brands,
    filters.minRating > 0 ? 'rating' : null,
    filters.inStock ? 'inStock' : null,
    filters.onSale ? 'onSale' : null,
    filters.isNew ? 'isNew' : null,
  ].filter(Boolean).length

  const gridCols = {
    'grid-2': 'grid-cols-1 sm:grid-cols-2',
    'grid-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    'grid-4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    'list': 'grid-cols-1',
  }

  return (
    <main id="main-content" className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 has-bottom-nav">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">All Products</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">{filtered.length} products</p>
      </div>

      {/* Mobile search + filter toggle */}
      <div className="flex gap-2 mb-4 lg:hidden">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
          />
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)]"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.categories.map(c => (
            <span key={c} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400">
              {CATEGORIES.find(cat => cat.id === c)?.label}
              <button onClick={() => updateFilters({ categories: filters.categories.filter(x => x !== c) })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.brands.map(b => (
            <span key={b} className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs text-violet-400">
              {b}
              <button onClick={() => updateFilters({ brands: filters.brands.filter(x => x !== b) })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.inStock && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400">
              In Stock <button onClick={() => updateFilters({ inStock: false })}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button onClick={resetFilters} className="text-xs text-[var(--text-muted)] hover:text-red-400 underline transition-colors">
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide">
            {/* Desktop search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
              />
            </div>
            <FilterPanel filters={filters} onChange={updateFilters} onReset={resetFilters} />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort + view controls */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm text-[var(--text-muted)] hidden sm:block">
              Showing {filtered.length} results
            </span>
            <div className="ml-auto flex items-center gap-2">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] outline-none focus:border-blue-500/50"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <div className="hidden sm:flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1">
                {[
                  { mode: 'grid-2', icon: <Grid2X2 className="w-4 h-4" /> },
                  { mode: 'grid-3', icon: <Grid3X3 className="w-4 h-4" /> },
                  { mode: 'list', icon: <List className="w-4 h-4" /> },
                ].map(({ mode, icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as ViewMode)}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === mode ? 'bg-blue-500 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product grid */}
          {isLoading ? (
            <div className={`grid ${gridCols['grid-3']} gap-4`}>
              {Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No products found</h3>
              <p className="text-[var(--text-muted)] mb-6">Try adjusting your filters or search terms</p>
              <button onClick={resetFilters} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={`grid ${gridCols[viewMode]} gap-4`}>
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Drawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filters"
        side="bottom"
      >
        <div className="p-5">
          <FilterPanel filters={filters} onChange={updateFilters} onReset={resetFilters} />
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="w-full mt-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
          >
            Show {filtered.length} Results
          </button>
        </div>
      </Drawer>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </main>
  )
}
