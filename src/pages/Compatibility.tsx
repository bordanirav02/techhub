import { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/product/ProductCard'
import { CATEGORIES } from '@/lib/constants'

export default function Compatibility() {
  const { data: products } = useProducts()
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const deviceProducts = products?.filter(p =>
    ['smartphones', 'laptops', 'tablets'].includes(p.category)
  ) || []

  const selectedProduct = products?.find(p => p.id === selectedDevice)

  const compatibleItems = selectedProduct
    ? (products?.filter(p =>
        (selectedProduct.compatibleWith?.includes(p.id) ||
         p.compatibleWith?.includes(selectedDevice)) &&
        p.id !== selectedDevice &&
        (filterCategory === 'all' || p.category === filterCategory)
      ) || [])
    : []

  return (
    <main id="main-content" className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 has-bottom-nav">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Compatibility Checker</h1>
        <p className="text-[var(--text-muted)]">Select your device to find compatible accessories and products.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Select Your Device</h2>
            <select
              value={selectedDevice}
              onChange={e => setSelectedDevice(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-blue-500/50"
            >
              <option value="">— Choose a device —</option>
              {deviceProducts.map(p => (
                <option key={p.id} value={p.id}>{p.brand} {p.name}</option>
              ))}
            </select>

            {selectedProduct && (
              <div className="mt-4 p-3 bg-[var(--bg-surface)] rounded-xl">
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-32 object-contain mb-2" />
                <p className="text-sm font-medium text-[var(--text-primary)]">{selectedProduct.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{selectedProduct.brand}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selectedDevice ? (
            <div className="h-full flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-12 text-center">
              <div>
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Select a device to start</h2>
                <p className="text-[var(--text-muted)]">We'll show you all compatible products</p>
              </div>
            </div>
          ) : compatibleItems.length === 0 ? (
            <div className="h-full flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-12 text-center">
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No compatible items found</h2>
                <p className="text-[var(--text-muted)]">Try a different device or category filter</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                {['all', ...CATEGORIES.map(c => c.id)].map(c => (
                  <button
                    key={c}
                    onClick={() => setFilterCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      filterCategory === c ? 'bg-blue-500 text-white' : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {c === 'all' ? 'All' : CATEGORIES.find(cat => cat.id === c)?.label || c}
                  </button>
                ))}
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-4">{compatibleItems.length} compatible items found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {compatibleItems.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
