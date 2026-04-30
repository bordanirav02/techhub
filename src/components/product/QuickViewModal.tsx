import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, ExternalLink } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/StarRating'
import { ProductBadge } from '@/components/ui/Badge'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatCurrency } from '@/lib/formatters'
import type { Product, ProductColor } from '@/types'
import toast from 'react-hot-toast'

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
}

export const QuickViewModal = ({ product, onClose }: QuickViewModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(product?.colors?.[0])
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>(product?.storage?.[0])
  const [qty, setQty] = useState(1)

  const { addItem, openDrawer } = useCartStore()
  const { toggleItem, isWishlisted } = useWishlistStore()

  if (!product) return null

  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product, selectedColor, selectedStorage)
    openDrawer()
    toast.success(`${product.name} added to cart!`)
    onClose()
  }

  return (
    <Modal isOpen={!!product} onClose={onClose} size="lg">
      <div className="p-0 sm:p-2 grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[85vh] overflow-y-auto">
        {/* Images */}
        <div className="p-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-[var(--bg-hover)] mb-3">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          {product.badge && <ProductBadge badge={product.badge} />}
          <div>
            <p className="text-sm text-[var(--text-muted)] font-medium">{product.brand}</p>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mt-1">{product.name}</h2>
          </div>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-[var(--text-muted)] line-through">{formatCurrency(product.originalPrice)}</span>
                <span className="text-sm font-medium text-emerald-400">-{product.discount}%</span>
              </>
            )}
          </div>

          <p className="text-sm text-[var(--text-secondary)] line-clamp-3">{product.description}</p>

          {/* Colors */}
          {product.colors && (
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Color: {selectedColor?.name}</p>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      selectedColor?.name === c.name ? 'border-blue-500 scale-110' : 'border-[var(--border-color)]'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Storage */}
          {product.storage && (
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Storage</p>
              <div className="flex flex-wrap gap-2">
                {product.storage.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStorage(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
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
            <div className="flex items-center gap-2 bg-[var(--bg-card)] rounded-xl p-1">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center hover:text-blue-400 transition-colors">−</button>
              <span className="w-8 text-center font-medium tabular-nums">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-8 h-8 flex items-center justify-center hover:text-blue-400 transition-colors">+</button>
            </div>
            <span className={`text-sm ${product.stock > 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left!` : 'In stock'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              fullWidth
              icon={<ShoppingCart className="w-4 h-4" />}
            >
              Add to Cart
            </Button>
            <button
              onClick={() => toggleItem(product)}
              className={`p-3 rounded-xl border transition-all ${
                wishlisted
                  ? 'bg-pink-500 border-pink-500 text-white'
                  : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-pink-500/50 hover:text-pink-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <Link
            to={`/products/${product.id}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View full details <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Modal>
  )
}
