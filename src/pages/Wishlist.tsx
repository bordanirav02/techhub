import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, Share2 } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { ProductCard } from '@/components/product/ProductCard'
import { formatCurrency } from '@/lib/formatters'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const { addItem, openDrawer } = useCartStore()

  const handleMoveToCart = (productId: string) => {
    const item = items.find(i => i.product.id === productId)
    if (item) {
      addItem(item.product)
      removeItem(productId)
      openDrawer()
      toast.success('Moved to cart!')
    }
  }

  const handleMoveAllToCart = () => {
    items.forEach(i => addItem(i.product))
    clearWishlist()
    openDrawer()
    toast.success(`${items.length} items moved to cart!`)
  }

  const handleShare = () => {
    const url = `${window.location.origin}/wishlist?ids=${items.map(i => i.product.id).join(',')}`
    navigator.clipboard.writeText(url)
    toast.success('Wishlist link copied!')
  }

  if (items.length === 0) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-16 text-center has-bottom-nav">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-[var(--bg-card)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-[var(--text-muted)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Your wishlist is empty</h1>
          <p className="text-[var(--text-muted)] mb-8">Save items you love for later by clicking the heart icon.</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
            Browse Products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main id="main-content" className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 has-bottom-nav">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Wishlist</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{items.length} saved items</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button onClick={handleMoveAllToCart} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors">
            <ShoppingCart className="w-4 h-4" /> Move All to Cart
          </button>
          <button onClick={clearWishlist} className="flex items-center gap-2 px-4 py-2 border border-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-500/5 transition-colors">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="group relative"
            >
              <ProductCard product={item.product} index={i} />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleMoveToCart(item.product.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl text-xs font-medium border border-blue-500/20 hover:border-transparent transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                </button>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  )
}
