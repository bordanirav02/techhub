import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Heart, GitCompare, Share2, ChevronRight,
  Truck, Shield, RotateCcw, Star, ThumbsUp, ThumbsDown, Plus, Minus
} from 'lucide-react'
import { useProduct, useProducts } from '@/hooks/useProducts'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCompareStore } from '@/store/compareStore'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductDetailSkeleton } from '@/components/ui/Skeleton'
import { StarRating } from '@/components/ui/StarRating'
import { ProductBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, estimateDelivery } from '@/lib/formatters'
import type { ProductColor } from '@/types'
import toast from 'react-hot-toast'

const SAMPLE_REVIEWS = [
  { id: 'r1', userName: 'Alex P.', rating: 5, title: 'Absolutely incredible!', body: 'Best purchase I have made this year. The quality is exceptional and it arrived faster than expected.', helpful: 42, notHelpful: 2, isVerifiedPurchase: true, createdAt: '2024-11-15' },
  { id: 'r2', userName: 'Maria S.', rating: 4, title: 'Great product, minor issues', body: 'Overall very happy with this purchase. The performance is outstanding. Docking 1 star for the packaging which was a bit damaged.', helpful: 28, notHelpful: 4, isVerifiedPurchase: true, createdAt: '2024-11-10' },
  { id: 'r3', userName: 'John D.', rating: 5, title: 'Worth every penny', body: 'Exceeded all my expectations. The build quality feels premium and the performance is top notch.', helpful: 19, notHelpful: 1, isVerifiedPurchase: false, createdAt: '2024-10-28' },
]

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading } = useProduct(id!)
  const { data: allProducts } = useProducts()
  const { addItem, openDrawer } = useCartStore()
  const { toggleItem, isWishlisted } = useWishlistStore()
  const { addItem: addCompare, isComparing } = useCompareStore()
  const { addItem: addRecentlyViewed } = useRecentlyViewed()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>()
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>()
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0])
      setSelectedStorage(product.storage?.[0])
      addRecentlyViewed(product)
    }
  }, [product])

  if (isLoading) return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-10">
      <ProductDetailSkeleton />
    </main>
  )

  if (!product) return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-10 text-center">
      <p className="text-[var(--text-muted)]">Product not found</p>
      <Link to="/products" className="text-blue-400 mt-4 inline-block">← Back to products</Link>
    </main>
  )

  const wishlisted = isWishlisted(product.id)
  const comparing = isComparing(product.id)
  const relatedProducts = allProducts?.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) || []

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product, selectedColor, selectedStorage)
    openDrawer()
    toast.success(`${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    addItem(product, selectedColor, selectedStorage)
    toast.success('Proceed to checkout')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!')
  }

  const ratingBreakdown = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    percent: r === 5 ? 68 : r === 4 ? 20 : r === 3 ? 8 : r === 2 ? 3 : 1,
  }))

  return (
    <main id="main-content" className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 has-bottom-nav">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-blue-400 transition-colors">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/products?category=${product.category}`} className="hover:text-blue-400 transition-colors capitalize">{product.category}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--text-primary)] truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div>
          <div
            className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] cursor-zoom-in mb-3"
            onClick={() => setLightboxOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-contain p-6"
              />
            </AnimatePresence>
            {product.badge && (
              <div className="absolute top-4 left-4">
                <ProductBadge badge={product.badge} />
              </div>
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  selectedImage === i ? 'border-blue-500' : 'border-[var(--border-color)] hover:border-[var(--border-hover)]'
                }`}
              >
                <img src={img} alt={`${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-400">{product.brand}</span>
              {product.badge && <ProductBadge badge={product.badge} />}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">{product.name}</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">SKU: {product.id.toUpperCase()}</p>
          </div>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-[var(--text-muted)] line-through">{formatCurrency(product.originalPrice)}</span>
                <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-full text-sm font-medium">
                  Save {formatCurrency(product.originalPrice - product.price)} ({product.discount}% off)
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className={`flex items-center gap-2 text-sm font-medium ${
            product.stock === 0 ? 'text-red-400' : product.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${product.stock === 0 ? 'bg-red-400' : product.stock <= 5 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? `Low Stock — Only ${product.stock} left!` : `In Stock (${product.stock} units)`}
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
                Color: <span className="text-[var(--text-primary)]">{selectedColor?.name}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor?.name === c.name ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-[var(--border-color)]'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Storage */}
          {product.storage && product.storage.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Storage</p>
              <div className="flex flex-wrap gap-2">
                {product.storage.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStorage(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedStorage === s
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-blue-500/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-4 py-2.5 hover:bg-white/5 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2.5 font-medium tabular-nums min-w-[2.5rem] text-center">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                disabled={product.stock === 0}
                className="px-4 py-2.5 hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Total: <span className="text-[var(--text-primary)] font-bold">{formatCurrency(product.price * qty)}</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Button
              size="lg"
              fullWidth
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              icon={<ShoppingCart className="w-5 h-5" />}
            >
              Add to Cart
            </Button>
            <Button
              variant="secondary"
              size="lg"
              disabled={product.stock === 0}
              onClick={handleBuyNow}
              className="whitespace-nowrap"
            >
              Buy Now
            </Button>
          </div>

          {/* Secondary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleItem(product)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
                wishlisted
                  ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-pink-500/50'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              {wishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
            <button
              onClick={() => addCompare(product)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
                comparing
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-blue-500/50'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              Compare
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Delivery info */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 space-y-3">
            {[
              { icon: Truck, text: `Free delivery by ${estimateDelivery(2)}`, sub: 'On orders over $50' },
              { icon: Shield, text: '1-Year Manufacturer Warranty', sub: 'Includes free support' },
              { icon: RotateCcw, text: '30-Day Free Returns', sub: 'No questions asked' },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{text}</p>
                  <p className="text-xs text-[var(--text-muted)]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex gap-1 border-b border-[var(--border-color)] mb-8 overflow-x-auto scrollbar-hide">
          {['description', 'specifications', 'reviews', 'qa'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab === 'qa' ? 'Q&A' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'reviews' && (
                <span className="ml-1.5 text-xs text-[var(--text-muted)]">({product.reviewCount})</span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'description' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-6">{product.description}</p>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Key Features</h3>
                  <ul className="space-y-2.5">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 self-start">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full text-xs text-[var(--text-secondary)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-2xl">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <div
                      key={key}
                      className={`grid grid-cols-2 gap-4 px-5 py-3.5 text-sm ${
                        i % 2 === 0 ? 'bg-white/2' : ''
                      } ${i < Object.keys(product.specs).length - 1 ? 'border-b border-[var(--border-color)]' : ''}`}
                    >
                      <span className="font-medium text-[var(--text-secondary)]">{key}</span>
                      <span className="text-[var(--text-primary)]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 text-center">
                    <div className="text-5xl font-bold text-[var(--text-primary)]">{product.rating}</div>
                    <div className="flex justify-center my-2">
                      <StarRating rating={product.rating} showCount={false} size="md" />
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">{product.reviewCount.toLocaleString()} reviews</p>
                    <div className="mt-4 space-y-1.5">
                      {ratingBreakdown.map(({ stars, percent }) => (
                        <div key={stars} className="flex items-center gap-2 text-xs">
                          <span className="w-3 text-right text-[var(--text-muted)]">{stars}</span>
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <div className="flex-1 bg-[var(--bg-hover)] rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="w-8 text-[var(--text-muted)]">{percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews list */}
                <div className="lg:col-span-2 space-y-4">
                  {SAMPLE_REVIEWS.map(review => (
                    <div key={review.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                            {review.userName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{review.userName}</p>
                            <div className="flex items-center gap-2">
                              <StarRating rating={review.rating} showCount={false} size="sm" />
                              {review.isVerifiedPurchase && (
                                <span className="text-xs text-emerald-400 font-medium">Verified Purchase</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{review.title}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">{review.body}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-[var(--text-muted)]">Helpful?</span>
                        <button className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-emerald-400 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" /> {review.helpful}
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors">
                          <ThumbsDown className="w-3.5 h-3.5" /> {review.notHelpful}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="max-w-2xl">
                <p className="text-[var(--text-muted)] text-sm mb-6">Have a question? Browse frequently asked questions or ask your own.</p>
                <div className="space-y-4">
                  {[
                    { q: 'Does this come with a warranty?', a: 'Yes, this product includes a 1-year manufacturer warranty covering defects in materials and workmanship.' },
                    { q: 'Is international shipping available?', a: 'Yes, we ship to 50+ countries worldwide. International shipping rates vary by destination.' },
                    { q: 'Can I return this if I am not satisfied?', a: 'Absolutely! We offer a 30-day hassle-free return policy. Simply contact support to initiate a return.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
                      <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Q: {item.q}</p>
                      <p className="text-sm text-[var(--text-secondary)]">A: {item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Related Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Image lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <img src={product.images[selectedImage]} alt={product.name} className="max-w-2xl max-h-full w-full object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
