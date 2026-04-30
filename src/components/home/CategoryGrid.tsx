import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useProducts } from '@/hooks/useProducts'
import { CATEGORIES } from '@/lib/constants'

const Category3DCard = ({ cat, count, index }: { cat: typeof CATEGORIES[number]; count: number; index: number }) => {
  const [hovered, setHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 250, damping: 22 })
  const springY = useSpring(y, { stiffness: 250, damping: 22 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8])

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
      style={{ perspective: 800, transformStyle: 'preserve-3d' }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        <Link
          to={`/products?category=${cat.id}`}
          className="relative group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 overflow-hidden block"
          style={{
            background: hovered ? `${cat.color}10` : 'var(--bg-card)',
            border: `1px solid ${hovered ? `${cat.color}50` : 'var(--border-color)'}`,
            boxShadow: hovered ? `0 12px 40px ${cat.color}25, 0 0 0 1px ${cat.color}15` : '0 2px 8px rgba(0,0,0,0.1)',
            transformStyle: 'preserve-3d',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Glare */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.06) 0%, transparent 60%)' }}
          />

          {/* Icon container */}
          <motion.div
            className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300"
            style={{
              backgroundColor: `${cat.color}18`,
              transform: hovered ? 'translateZ(20px)' : 'translateZ(0)',
              boxShadow: hovered ? `0 8px 24px ${cat.color}30` : 'none',
            }}
            animate={{ scale: hovered ? 1.12 : 1 }}
            transition={{ duration: 0.25 }}
          >
            {cat.icon}

            {/* Icon glow ring on hover */}
            {hovered && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ border: `1px solid ${cat.color}40` }}
              />
            )}
          </motion.div>

          {/* Text */}
          <div className="text-center" style={{ transform: hovered ? 'translateZ(12px)' : 'translateZ(0)', transition: 'transform 0.25s' }}>
            <p
              className="text-sm font-semibold transition-colors duration-200"
              style={{ color: hovered ? cat.color : 'var(--text-primary)' }}
            >
              {cat.label}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{count} items</p>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
            style={{ background: cat.color }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </Link>
      </motion.div>
    </motion.div>
  )
}

export const CategoryGrid = () => {
  const { data: products } = useProducts()
  const getCategoryCount = (id: string) => products?.filter(p => p.category === id).length || 0

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-16 relative">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-8 relative z-10"
      >
        <div>
          <p className="text-xs font-semibold text-blue-400 tracking-widest uppercase mb-2">Browse</p>
          <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">Shop by Category</h2>
          <p className="text-[var(--text-secondary)] mt-1">Browse our curated selection of tech categories</p>
        </div>
        <Link to="/products" className="text-sm text-blue-400 hover:text-blue-300 hidden sm:flex items-center gap-1 transition-colors">
          View all <span className="ml-1">→</span>
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 relative z-10">
        {CATEGORIES.map((cat, i) => (
          <Category3DCard key={cat.id} cat={cat} count={getCategoryCount(cat.id)} index={i} />
        ))}
      </div>
    </section>
  )
}
