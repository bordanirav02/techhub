import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Heart, Search, User, Menu, X, ChevronDown,
  Bell, Command, Sun, Moon, Package, LogOut, Settings, BarChart2
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { CATEGORIES } from '@/lib/constants'
import { useDebounce } from '@/hooks/useDebounce'
import { useProducts } from '@/hooks/useProducts'

export const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { getItemCount, openDrawer } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const { theme, toggleTheme, openCommandPalette, notifications, unreadCount, markAllRead } = useUIStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { data: products } = useProducts()

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 200)
  const searchRef = useRef<HTMLDivElement>(null)

  const cartCount = getItemCount()
  const wishlistCount = wishlistItems.length

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setMegaMenuOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const searchResults = debouncedSearch.length > 1
    ? products?.filter(p =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(debouncedSearch.toLowerCase())
      ).slice(0, 6) || []
    : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchFocused(false)
    }
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 text-white text-xs py-2 overflow-hidden">
        <div className="marquee-track">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="flex items-center gap-6 px-4">
              <span>🚀 Free shipping on orders over $50</span>
              <span>⚡ Flash Sale — Up to 40% OFF</span>
              <span>🎁 Use code TECH20 for 20% off</span>
              <span>✅ 30-day free returns</span>
              <span>💳 EMI available on all orders over $200</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main navbar */}
      <motion.header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-[var(--border-color)] shadow-lg'
            : 'bg-transparent'
        }`}
        initial={false}
      >
        <nav className="max-w-[1400px] mx-auto px-4 lg:px-6 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 mr-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-bold hidden sm:block" style={{ fontFamily: 'Inter' }}>
              Tech<span className="text-blue-500">Hub</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-white/5 transition-colors">
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-white/5 transition-colors">
                Products <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-[600px] glass rounded-2xl p-6 border border-[var(--border-color)] shadow-2xl"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {CATEGORIES.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/products?category=${cat.id}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                            {cat.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                      <Link
                        to="/products"
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        View all products →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/deals" className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-white/5 transition-colors">
              Deals
            </Link>
            <Link to="/compatibility" className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-white/5 transition-colors">
              Compatibility
            </Link>
          </div>

          {/* Search */}
          <div ref={searchRef} className="flex-1 max-w-xl hidden md:block relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--border-hover)] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-9 pr-24 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <kbd
                    onClick={openCommandPalette}
                    className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] border border-[var(--border-color)] rounded-md cursor-pointer hover:border-[var(--border-hover)] transition-colors"
                  >
                    <Command className="w-2.5 h-2.5" /> K
                  </kbd>
                </div>
              </div>
            </form>

            {/* Search autocomplete */}
            <AnimatePresence>
              {searchFocused && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute top-full mt-2 w-full glass rounded-xl border border-[var(--border-color)] overflow-hidden shadow-2xl z-50"
                >
                  {searchResults.map(p => (
                    <Link
                      key={p.id}
                      to={`/products/${p.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                      onClick={() => { setSearchQuery(''); setSearchFocused(false) }}
                    >
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--text-primary)] truncate">{p.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{p.brand}</p>
                      </div>
                      <p className="text-sm font-semibold text-blue-400">${p.price}</p>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors hidden md:flex"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl border border-[var(--border-color)] shadow-2xl overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                      <h3 className="font-semibold text-sm text-[var(--text-primary)]">Notifications</h3>
                      <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300">
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(n => (
                        <Link
                          key={n.id}
                          to={n.link || '#'}
                          onClick={() => setNotifOpen(false)}
                          className={`flex gap-3 p-4 hover:bg-white/5 transition-colors border-b border-[var(--border-color)] last:border-0 ${!n.isRead ? 'bg-blue-500/5' : ''}`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--text-primary)]">{n.title}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors relative hidden sm:flex"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5" />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold"
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart */}
            <button
              onClick={openDrawer}
              className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors relative"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user?.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      : user?.name?.[0]?.toUpperCase() || 'U'
                    }
                  </div>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl border border-[var(--border-color)] shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-[var(--border-color)]">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors">
                          <User className="w-4 h-4" /> My Account
                        </Link>
                        <Link to="/account/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors">
                          <Package className="w-4 h-4" /> Orders
                        </Link>
                        <Link to="/account/analytics" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors">
                          <BarChart2 className="w-4 h-4" /> Analytics
                        </Link>
                        <Link to="/account/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors">
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-[var(--border-color)] bg-[var(--bg-surface)]"
            >
              <div className="p-4 space-y-1">
                {/* Mobile search */}
                <form onSubmit={handleSearch} className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                    />
                  </div>
                </form>
                <Link to="/" className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-xl transition-colors">Home</Link>
                <Link to="/products" className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-xl transition-colors">Products</Link>
                <Link to="/deals" className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-xl transition-colors">Deals</Link>
                <Link to="/compatibility" className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-xl transition-colors">Compatibility</Link>
                <Link to="/wishlist" className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 rounded-xl transition-colors">Wishlist</Link>
                <div className="pt-2 flex items-center gap-2">
                  <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-white/5 rounded-xl transition-colors">
                    {theme === 'dark' ? <><Sun className="w-4 h-4" /> Light Mode</> : <><Moon className="w-4 h-4" /> Dark Mode</>}
                  </button>
                </div>
                {!isAuthenticated && (
                  <div className="pt-2 flex gap-2">
                    <Link to="/login" className="flex-1 text-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors">Sign In</Link>
                    <Link to="/register" className="flex-1 text-center px-4 py-2.5 border border-[var(--border-color)] hover:border-blue-500/50 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Register</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
