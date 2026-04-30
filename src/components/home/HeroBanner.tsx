import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowRight, Zap, Shield, Truck, ChevronLeft, ChevronRight, Star, Battery, Cpu, Camera } from 'lucide-react'

const HERO_SLIDES = [
  {
    title: 'Next-Gen Tech,',
    highlight: 'Extraordinary Prices.',
    subtitle: 'Discover the latest smartphones, laptops, headphones & more from top brands worldwide.',
    badge: '⚡ Flash Sale — Up to 40% OFF',
    cta: { label: 'Shop Now', href: '/products' },
    cta2: { label: 'Explore Deals', href: '/deals' },
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=700&q=90',
    accent: '#3b82f6',
    accentAlt: '#8b5cf6',
    tag: 'UP TO 40% OFF',
    floatBadges: [
      { icon: Cpu, label: 'A17 Pro Chip', value: '6-Core GPU', x: '-20%', y: '20%' },
      { icon: Camera, label: '48MP Camera', value: '5x Zoom', x: '85%', y: '30%' },
      { icon: Battery, label: 'Battery', value: '29 hrs', x: '80%', y: '70%' },
    ],
  },
  {
    title: 'MacBook Pro M3,',
    highlight: 'Unleash Your Potential.',
    subtitle: 'The most powerful MacBook ever. Up to 22 hours battery life and stunning Liquid Retina XDR display.',
    badge: '🆕 Just Launched',
    cta: { label: 'Shop MacBook', href: '/products?category=laptops' },
    cta2: { label: 'Learn More', href: '/products/p004' },
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=90',
    accent: '#8b5cf6',
    accentAlt: '#ec4899',
    tag: 'NEW LAUNCH',
    floatBadges: [
      { icon: Cpu, label: 'M3 Max Chip', value: '40-Core GPU', x: '-20%', y: '25%' },
      { icon: Battery, label: 'Battery Life', value: '22 Hours', x: '85%', y: '65%' },
      { icon: Star, label: 'Rating', value: '4.9 / 5.0', x: '82%', y: '28%' },
    ],
  },
  {
    title: 'Premium Sound,',
    highlight: 'Zero Compromise.',
    subtitle: 'Sony WH-1000XM5 — Industry-leading noise cancellation. 30-hour battery. Multipoint connection.',
    badge: '🔥 Best Seller',
    cta: { label: 'Shop Headphones', href: '/products?category=headphones' },
    cta2: { label: 'Quick View', href: '/products/p006' },
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=90',
    accent: '#10b981',
    accentAlt: '#3b82f6',
    tag: 'BEST SELLER',
    floatBadges: [
      { icon: Battery, label: 'Battery', value: '30 Hours', x: '-18%', y: '30%' },
      { icon: Zap, label: 'Noise Cancel', value: 'Industry #1', x: '83%', y: '25%' },
      { icon: Star, label: 'Rating', value: '4.8 / 5.0', x: '80%', y: '68%' },
    ],
  },
  {
    title: 'Apple Watch Ultra 2,',
    highlight: 'Built For Extremes.',
    subtitle: 'The most rugged and capable Apple Watch. Largest display, longest battery, precision dual-frequency GPS.',
    badge: '⌚ Just In',
    cta: { label: 'Shop Watches', href: '/products?category=smartwatches' },
    cta2: { label: 'View Details', href: '/products/p011' },
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=700&q=90',
    accent: '#f97316',
    accentAlt: '#ef4444',
    tag: 'NEW ARRIVAL',
    floatBadges: [
      { icon: Zap, label: 'Titanium Case', value: '49mm', x: '-20%', y: '22%' },
      { icon: Battery, label: 'Battery Life', value: '60 Hours', x: '83%', y: '30%' },
      { icon: Star, label: 'Rating', value: '4.9 / 5.0', x: '80%', y: '68%' },
    ],
  },
]

// Floating particle dots
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: `${10 + (i * 7.5) % 85}%`,
  y: `${60 + (i * 11) % 35}%`,
  size: 2 + (i % 3),
  duration: 5 + (i % 5),
  delay: i * 0.4,
}))

export const HeroBanner = () => {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [countdown, setCountdown] = useState({ h: 5, m: 47, s: 23 })
  const heroRef = useRef<HTMLElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 })
  const floatX = useTransform(smoothX, [0, 1], [-12, 12])
  const floatY = useTransform(smoothY, [0, 1], [-8, 8])

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent(c => (c + 1) % HERO_SLIDES.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c.s > 0) return { ...c, s: c.s - 1 }
        if (c.m > 0) return { h: c.h, m: c.m - 1, s: 59 }
        if (c.h > 0) return { h: c.h - 1, m: 59, s: 59 }
        return { h: 5, m: 47, s: 23 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const navigate = (dir: number) => {
    setDirection(dir)
    setCurrent(c => (c + dir + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  const slide = HERO_SLIDES[current]

  return (
    <section
      ref={heroRef}
      onMouseMove={e => {
        const rect = heroRef.current?.getBoundingClientRect()
        if (rect) {
          mouseX.set((e.clientX - rect.left) / rect.width)
          mouseY.set((e.clientY - rect.top) / rect.height)
        }
      }}
      className="relative overflow-hidden min-h-[90vh] flex items-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Mesh grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Dynamic accent blobs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`blobs-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{ width: 700, height: 700, left: '-15%', top: '-30%', background: `${slide.accent}14` }}
            animate={{ scale: [1, 1.08, 1], x: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{ width: 400, height: 400, right: '5%', bottom: '-10%', background: `${slide.accentAlt}10` }}
            animate={{ scale: [1, 1.12, 1], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{ width: 250, height: 250, right: '35%', top: '10%', background: `${slide.accent}08` }}
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size, left: p.x, top: p.y, background: slide.accent + '60' }}
            animate={{ y: [0, -80, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Spinning rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[200, 320, 440].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              right: `${-size / 4 + 150}px`,
              top: `calc(50% - ${size / 2}px)`,
              border: `1px solid ${slide.accent}12`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 18 + i * 6, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-16 lg:py-20 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── TEXT SIDE ── */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`text-${current}`}
              custom={direction}
              initial={{ opacity: 0, x: direction * -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * 60 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ background: `${slide.accent}18`, border: `1px solid ${slide.accent}35`, color: slide.accent }}
              >
                {slide.badge}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] font-black leading-[1.08] text-[var(--text-primary)] mb-1"
              >
                {slide.title}
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] font-black leading-[1.08] mb-5"
                style={{ background: `linear-gradient(135deg, ${slide.accent} 0%, ${slide.accentAlt} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                {slide.highlight}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                className="text-base md:text-lg text-[var(--text-secondary)] max-w-md mb-7 leading-relaxed"
              >
                {slide.subtitle}
              </motion.p>

              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex items-center gap-2.5 mb-7"
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)]">Sale Ends:</span>
                {[{ v: countdown.h, l: 'HRS' }, { v: countdown.m, l: 'MIN' }, { v: countdown.s, l: 'SEC' }].map(({ v, l }, i) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div
                      className="w-12 h-14 rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={v}
                          initial={{ y: -14, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 14, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="text-xl font-black tabular-nums leading-none text-[var(--text-primary)]"
                        >
                          {String(v).padStart(2, '0')}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-[9px] text-[var(--text-muted)] font-semibold mt-0.5">{l}</span>
                    </div>
                    {i < 2 && <span className="text-[var(--text-muted)] text-lg font-bold">:</span>}
                  </div>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="flex flex-wrap items-center gap-3 mb-8"
              >
                <Link
                  to={slide.cta.href}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm md:text-base text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${slide.accent} 0%, ${slide.accentAlt} 100%)`,
                    boxShadow: `0 8px 32px ${slide.accent}40`,
                  }}
                >
                  {slide.cta.label}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to={slide.cta2.href}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm md:text-base transition-all duration-300 hover:bg-[var(--bg-hover)]"
                  style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  {slide.cta2.label}
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-5"
              >
                {[{ icon: Truck, t: 'Free Shipping $50+' }, { icon: Shield, t: '30-Day Returns' }, { icon: Zap, t: '2-Day Delivery' }].map(({ icon: Icon, t }) => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <Icon className="w-3.5 h-3.5" style={{ color: slide.accent }} />
                    {t}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* ── PRODUCT SHOWCASE ── */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-[500px] h-[500px]">

              {/* Outer glow rings */}
              {[1, 0.6, 0.3].map((opacity, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full"
                  style={{ border: `1px solid ${slide.accent}`, opacity: opacity * 0.08, margin: `${i * 20}px` }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }}
                />
              ))}

              {/* Central glow */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`glow-${current}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-16 rounded-full blur-3xl"
                  style={{ background: `radial-gradient(circle, ${slide.accent}30 0%, ${slide.accentAlt}10 60%, transparent 100%)` }}
                />
              </AnimatePresence>

              {/* Product image — transparent float */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`img-${current}`}
                  custom={direction}
                  initial={{ opacity: 0, scale: 0.82, rotateY: direction * -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.82, rotateY: direction * 20 }}
                  transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ perspective: '1000px' }}
                >
                  <motion.img
                    src={slide.image}
                    alt="Featured product"
                    className="w-full h-full"
                    style={{
                      objectFit: 'contain',
                      x: floatX,
                      y: floatY,
                      filter: `drop-shadow(0 30px 70px ${slide.accent}55) drop-shadow(0 -5px 30px ${slide.accentAlt}25)`,
                      // Key technique: mask-image creates soft transparent edges → floating effect
                      WebkitMaskImage: 'radial-gradient(ellipse 85% 90% at 50% 50%, black 45%, transparent 100%)',
                      maskImage: 'radial-gradient(ellipse 85% 90% at 50% 50%, black 45%, transparent 100%)',
                    }}
                    animate={{ y: [0, -14, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Ground reflection */}
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 blur-2xl rounded-full"
                style={{ background: slide.accent }}
                animate={{ opacity: [0.2, 0.35, 0.2], scaleX: [1, 1.1, 1] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Floating spec badges */}
              <AnimatePresence mode="wait">
                {slide.floatBadges.map((badge, i) => (
                  <motion.div
                    key={`${current}-badge-${i}`}
                    initial={{ opacity: 0, scale: 0.7, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.4 }}
                    className="absolute z-20 flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md"
                    style={{
                      left: badge.x,
                      top: badge.y,
                      background: 'rgba(10,10,15,0.75)',
                      border: `1px solid ${slide.accent}30`,
                      boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${slide.accent}15`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${slide.accent}20` }}
                    >
                      <badge.icon className="w-3.5 h-3.5" style={{ color: slide.accent }} />
                    </div>
                    <div>
                      <p className="text-[9px] text-[var(--text-muted)] leading-none mb-0.5">{badge.label}</p>
                      <p className="text-xs font-bold text-[var(--text-primary)] leading-none">{badge.value}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Top right promo tag */}
              <motion.div
                className="absolute -top-2 right-6 z-30 px-3 py-1.5 rounded-xl text-xs font-black text-white"
                style={{ background: `linear-gradient(135deg, ${slide.accent}, ${slide.accentAlt})`, boxShadow: `0 4px 20px ${slide.accent}50` }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                {slide.tag}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── SLIDE CONTROLS ── */}
        <div className="flex items-center gap-4 mt-10">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                className="transition-all duration-300 rounded-full overflow-hidden"
                style={{
                  width: i === current ? 32 : 10,
                  height: 10,
                  background: i === current ? slide.accent : 'var(--border-color)',
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <span className="text-xs text-[var(--text-muted)] font-mono ml-1">
            {String(current + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-2 ml-auto">
            {[{ dir: -1, Icon: ChevronLeft }, { dir: 1, Icon: ChevronRight }].map(({ dir, Icon }) => (
              <button
                key={dir}
                onClick={() => navigate(dir)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
