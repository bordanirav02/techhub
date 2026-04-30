import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ArrowRight, Home, ShoppingBag, Heart, ShoppingCart,
  BarChart2, Tag, Zap, Settings, User, Package, LogOut,
  Command, Clock, TrendingUp, X
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { useProducts } from '@/hooks/useProducts'
import { useCartStore } from '@/store/cartStore'
import { CATEGORIES, TRENDING_SEARCHES } from '@/lib/constants'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: () => void
  group: string
  keywords?: string[]
}

export const CommandPalette = () => {
  const navigate = useNavigate()
  const { commandPaletteOpen, closeCommandPalette, recentSearches, addRecentSearch } = useUIStore()
  const { isAuthenticated, logout } = useAuthStore()
  const { openDrawer } = useCartStore()
  const { data: products } = useProducts()

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const staticCommands: CommandItem[] = useMemo(() => [
    { id: 'home', label: 'Go Home', icon: <Home className="w-4 h-4" />, action: () => navigate('/'), group: 'Navigation' },
    { id: 'products', label: 'All Products', icon: <ShoppingBag className="w-4 h-4" />, action: () => navigate('/products'), group: 'Navigation' },
    { id: 'deals', label: 'Flash Deals', description: 'Best deals today', icon: <Zap className="w-4 h-4 text-orange-400" />, action: () => navigate('/deals'), group: 'Navigation' },
    { id: 'cart', label: 'Open Cart', icon: <ShoppingCart className="w-4 h-4" />, action: () => { closeCommandPalette(); openDrawer() }, group: 'Navigation' },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" />, action: () => navigate('/wishlist'), group: 'Navigation' },
    { id: 'compare', label: 'Compare Products', icon: <BarChart2 className="w-4 h-4" />, action: () => navigate('/compare'), group: 'Navigation' },
    { id: 'compatibility', label: 'Compatibility Checker', icon: <Tag className="w-4 h-4" />, action: () => navigate('/compatibility'), group: 'Navigation' },
    ...CATEGORIES.map(cat => ({
      id: `cat-${cat.id}`,
      label: `${cat.label}`,
      description: 'Browse category',
      icon: <span className="text-base">{cat.icon}</span>,
      action: () => navigate(`/products?category=${cat.id}`),
      group: 'Categories',
      keywords: [cat.id],
    })),
    ...(isAuthenticated ? [
      { id: 'account', label: 'My Account', icon: <User className="w-4 h-4" />, action: () => navigate('/account'), group: 'Account' },
      { id: 'orders', label: 'Order History', icon: <Package className="w-4 h-4" />, action: () => navigate('/account/orders'), group: 'Account' },
      { id: 'analytics', label: 'Shopping Analytics', icon: <BarChart2 className="w-4 h-4" />, action: () => navigate('/account/analytics'), group: 'Account' },
      { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, action: () => navigate('/account/settings'), group: 'Account' },
      { id: 'logout', label: 'Sign Out', icon: <LogOut className="w-4 h-4 text-red-400" />, action: () => { logout(); navigate('/') }, group: 'Account' },
    ] : [
      { id: 'login', label: 'Sign In', icon: <User className="w-4 h-4" />, action: () => navigate('/login'), group: 'Account' },
      { id: 'register', label: 'Create Account', icon: <User className="w-4 h-4" />, action: () => navigate('/register'), group: 'Account' },
    ]),
  ], [navigate, isAuthenticated, logout, closeCommandPalette, openDrawer])

  const productResults = useMemo(() => {
    if (!query.trim() || query.length < 2 || !products) return []
    const q = query.toLowerCase()
    return products
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map(p => ({
        id: `product-${p.id}`,
        label: p.name,
        description: `${p.brand} · $${p.price}`,
        icon: <img src={p.images[0]} alt={p.name} className="w-8 h-8 object-contain rounded-lg" />,
        action: () => { addRecentSearch(query); navigate(`/products/${p.id}`) },
        group: 'Products',
      }))
  }, [query, products, navigate, addRecentSearch])

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return staticCommands
    const q = query.toLowerCase()
    return staticCommands.filter(cmd =>
      cmd.label.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q) ||
      cmd.keywords?.some(k => k.includes(q))
    )
  }, [query, staticCommands])

  const allResults = useMemo(() => {
    if (!query.trim()) return filteredCommands
    return [...productResults, ...filteredCommands]
  }, [query, filteredCommands, productResults])

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    allResults.forEach(item => {
      if (!groups[item.group]) groups[item.group] = []
      groups[item.group].push(item)
    })
    return groups
  }, [allResults])

  const flatList = useMemo(() => allResults, [allResults])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, flatList.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flatList[activeIndex]) {
        flatList[activeIndex].action()
        closeCommandPalette()
      } else if (query.trim()) {
        addRecentSearch(query)
        navigate(`/search?q=${encodeURIComponent(query)}`)
        closeCommandPalette()
      }
    } else if (e.key === 'Escape') {
      closeCommandPalette()
    }
  }

  const handleSelect = (item: CommandItem) => {
    item.action()
    closeCommandPalette()
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={closeCommandPalette}
          />
          <div className="fixed inset-0 z-[201] flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-xl pointer-events-auto"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-color)]">
                <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products, pages, commands..."
                  className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[var(--bg-hover)] rounded-lg text-[10px] text-[var(--text-muted)] font-mono shrink-0">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[380px] overflow-y-auto py-2">
                {/* Recent searches when empty query */}
                {!query && recentSearches.length > 0 && (
                  <div className="px-3 mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2 py-1.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Recent
                    </p>
                    {recentSearches.slice(0, 4).map(s => {
                      const idx = flatList.findIndex(i => i.id === `recent-${s}`)
                      return (
                        <button
                          key={s}
                          onClick={() => { addRecentSearch(s); navigate(`/search?q=${encodeURIComponent(s)}`); closeCommandPalette() }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors text-left"
                        >
                          <Clock className="w-3.5 h-3.5 shrink-0 opacity-50" />
                          {s}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Trending when empty query */}
                {!query && (
                  <div className="px-3 mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2 py-1.5 flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </p>
                    <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                      {TRENDING_SEARCHES.slice(0, 8).map(t => (
                        <button
                          key={t}
                          onClick={() => { addRecentSearch(t); navigate(`/search?q=${encodeURIComponent(t)}`); closeCommandPalette() }}
                          className="px-2.5 py-1 bg-[var(--bg-hover)] hover:bg-blue-500/20 hover:text-blue-400 rounded-full text-xs text-[var(--text-secondary)] transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grouped results */}
                {(() => {
                  let globalIndex = 0
                  return Object.entries(grouped).map(([group, items]) => (
                    <div key={group} className="px-3 mb-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2 py-1.5">{group}</p>
                      {items.map(item => {
                        const idx = globalIndex++
                        const isActive = idx === activeIndex
                        return (
                          <button
                            key={item.id}
                            data-index={idx}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                              isActive ? 'bg-blue-500/15 text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                            }`}
                          >
                            <span className={`shrink-0 ${isActive ? 'text-blue-400' : 'text-[var(--text-muted)]'}`}>
                              {item.icon}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block truncate font-medium text-[var(--text-primary)]">{item.label}</span>
                              {item.description && (
                                <span className="block truncate text-xs text-[var(--text-muted)]">{item.description}</span>
                              )}
                            </span>
                            {isActive && <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  ))
                })()}

                {allResults.length === 0 && query && (
                  <div className="py-10 text-center">
                    <Search className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                    <p className="text-sm text-[var(--text-muted)]">No results for "<span className="text-[var(--text-secondary)]">{query}</span>"</p>
                    <button
                      onClick={() => { addRecentSearch(query); navigate(`/search?q=${encodeURIComponent(query)}`); closeCommandPalette() }}
                      className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                    >
                      Search all products →
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-[var(--border-color)] px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--bg-hover)] rounded font-mono">↑↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--bg-hover)] rounded font-mono">↵</kbd> select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--bg-hover)] rounded font-mono">ESC</kbd> close
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                  <Command className="w-3 h-3" /> K
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
