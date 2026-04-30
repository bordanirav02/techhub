import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Heart, ShoppingCart, Eye, GitCompare, Check, Zap } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCompareStore } from '@/store/compareStore'
import { ProductBadge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { formatCurrency } from '@/lib/formatters'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
  index?: number
}

export const ProductCard = ({ product, onQuickView, index = 0 }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { addItem, openDrawer } = useCartStore()
  const { toggleItem, isWishlisted } = useWishlistStore()
  const { addItem: addCompare, isComparing } = useCompareStore()

  const wishlisted = isWishlisted(product.id)
  const comparing = isComparing(product.id)
  const outOfStock = product.stock === 0

  // 3D tilt motion values
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 })
  const glareX = useTransform(rotateY, [-12, 12], ['0%', '100%'])
  const glareOpacity = useTransform([springRotateX, springRotateY] as const, ([rx, ry]) => Math.abs(Number(rx)) / 80 + Math.abs(Number(ry)) / 80)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rotateX.set(y * -12)
    rotateY.set(x * 12)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (product.images.length > 1) setImageIndex(1)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    rotateX.set(0)
    rotateY.set(0)
    setImageIndex(0)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return
    addItem(product)
    setAddedToCart(true)
    openDrawer()
    toast.success(`${product.name} added to cart!`)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', { icon: wishlisted ? '💔' : '❤️' })
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!comparing) {
      const added = addCompare(product)
      if (!added) toast.error('Max 4 products can be compared')
      else toast.success('Added to comparison')
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.45, ease: 'easeOut' }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer"
    >
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-300"
        style={{
          background: 'var(--bg-card)',
          border: `1px solid ${isHovered ? 'rgba(59,130,246,0.4)' : 'var(--border-color)'}`,
          boxShadow: isHovered
            ? '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(59,130,246,0.1)'
            : '0 2px 12px rgba(0,0,0,0.1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 3D glare overlay */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none rounded-2xl overflow-hidden"
          style={{ opacity: glareOpacity }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${glareX} 30%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
            }}
          />
        </motion.div>

        <Link to={`/products/${product.id}`} className="block">
          {/* Image */}
          <div className="relative overflow-hidden bg-[var(--bg-hover)] aspect-[4/3]">
            <motion.img
              key={imageIndex}
              src={product.images[imageIndex]}
              alt={product.name}
              loading="lazy"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover"
            />

            {/* Dark gradient overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Top action buttons */}
            <motion.div
              className="absolute top-2 right-2 flex flex-col gap-1.5"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleWishlist}
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all ${
                  wishlisted ? 'bg-pink-500 text-white' : 'bg-black/40 text-white hover:bg-pink-500'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleCompare}
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all ${
                  comparing ? 'bg-blue-500 text-white' : 'bg-black/40 text-white hover:bg-blue-500'
                }`}
                aria-label="Compare"
              >
                <GitCompare className="w-3.5 h-3.5" />
              </motion.button>
              {onQuickView && (
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleQuickView}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-white/20 flex items-center justify-center shadow-lg transition-all"
                  aria-label="Quick view"
                >
                  <Eye className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </motion.div>

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-2 left-2 z-10">
                <ProductBadge badge={product.badge} />
              </div>
            )}

            {/* Savings chip on hover */}
            {savings > 0 && (
              <motion.div
                className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
                transition={{ duration: 0.2 }}
              >
                <Zap className="w-2.5 h-2.5" />
                Save {formatCurrency(savings)}
              </motion.div>
            )}

            {/* Out of stock */}
            {outOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <span className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white text-sm font-medium">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Low stock */}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="absolute bottom-2 right-2">
                <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-[10px] font-medium">
                  Only {product.stock} left!
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4" style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
            <p className="text-xs text-[var(--text-muted)] font-semibold tracking-wide uppercase mb-1">{product.brand}</p>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors duration-200">
              {product.name}
            </h3>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />

            {/* Color swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                {product.colors.slice(0, 5).map(c => (
                  <div
                    key={c.name}
                    title={c.name}
                    className="w-3.5 h-3.5 rounded-full ring-1 ring-[var(--border-color)] ring-offset-1 ring-offset-[var(--bg-card)]"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {product.colors.length > 5 && (
                  <span className="text-[10px] text-[var(--text-muted)]">+{product.colors.length - 5}</span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-2 mt-3">
              <span className="text-lg font-black text-[var(--text-primary)]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xs text-[var(--text-muted)] line-through pb-0.5">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 pb-0.5">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Add to cart */}
        <div className="px-4 pb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              addedToCart
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : outOfStock
                ? 'bg-[var(--bg-hover)] text-[var(--text-muted)] cursor-not-allowed'
                : 'bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/20 hover:border-transparent hover:shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Added to Cart!
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
