import { Link } from 'react-router-dom'
import { X, Plus, ShoppingCart } from 'lucide-react'
import { useCompareStore } from '@/store/compareStore'
import { useCartStore } from '@/store/cartStore'
import { StarRating } from '@/components/ui/StarRating'
import { formatCurrency } from '@/lib/formatters'
import toast from 'react-hot-toast'

export default function Compare() {
  const { items, removeItem, clearAll } = useCompareStore()
  const { addItem, openDrawer } = useCartStore()

  if (items.length === 0) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-16 text-center has-bottom-nav">
        <div className="text-5xl mb-4">⚖️</div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">No products to compare</h1>
        <p className="text-[var(--text-muted)] mb-6">Add up to 4 products to compare side by side</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
          Browse Products
        </Link>
      </main>
    )
  }

  const allSpecs = [...new Set(items.flatMap(p => Object.keys(p.specs)))]

  return (
    <main id="main-content" className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 has-bottom-nav overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Compare Products ({items.length})</h1>
        <button onClick={clearAll} className="text-sm text-red-400 hover:text-red-300 transition-colors">Clear all</button>
      </div>

      <div className="min-w-[600px]">
        <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr) ${items.length < 4 ? 'minmax(160px,1fr)' : ''}` }}>
          {/* Header */}
          <div />
          {items.map(p => (
            <div key={p.id} className="relative bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 text-center">
              <button onClick={() => removeItem(p.id)} className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
              <Link to={`/products/${p.id}`}>
                <img src={p.images[0]} alt={p.name} className="w-full h-32 object-contain mb-3" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2">{p.name}</h3>
              </Link>
            </div>
          ))}
          {items.length < 4 && (
            <Link to="/products" className="flex flex-col items-center justify-center bg-[var(--bg-card)] border-2 border-dashed border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-muted)] hover:border-blue-500/40 hover:text-blue-400 transition-colors min-h-[200px]">
              <Plus className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Add Product</span>
            </Link>
          )}

          {/* Price row */}
          <div className="flex items-center text-sm font-semibold text-[var(--text-secondary)] py-3 border-b border-[var(--border-color)]">Price</div>
          {items.map(p => (
            <div key={p.id} className="flex items-center justify-center py-3 border-b border-[var(--border-color)]">
              <span className="text-lg font-bold text-[var(--text-primary)]">{formatCurrency(p.price)}</span>
            </div>
          ))}
          {items.length < 4 && <div />}

          {/* Rating */}
          <div className="flex items-center text-sm font-semibold text-[var(--text-secondary)] py-3 border-b border-[var(--border-color)]">Rating</div>
          {items.map(p => (
            <div key={p.id} className="flex items-center justify-center py-3 border-b border-[var(--border-color)]">
              <StarRating rating={p.rating} reviewCount={p.reviewCount} size="sm" />
            </div>
          ))}
          {items.length < 4 && <div />}

          {/* Specs */}
          {allSpecs.map(spec => {
            const values = items.map(p => p.specs[spec])
            return (
              <>
                <div key={`label-${spec}`} className="flex items-center text-xs text-[var(--text-secondary)] py-2.5 border-b border-[var(--border-color)]">{spec}</div>
                {items.map((p, i) => (
                  <div key={`${p.id}-${spec}`} className="flex items-center justify-center text-xs text-center py-2.5 border-b border-[var(--border-color)] px-2 text-[var(--text-primary)]">
                    {p.specs[spec] || '—'}
                  </div>
                ))}
                {items.length < 4 && <div key={`empty-${spec}`} className="border-b border-[var(--border-color)]" />}
              </>
            )
          })}

          {/* Add to cart row */}
          <div />
          {items.map(p => (
            <div key={p.id} className="pt-4">
              <button
                onClick={() => { addItem(p); openDrawer(); toast.success('Added to cart!') }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-medium transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
