import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Grid3X3, Heart, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWishlistStore } from '@/store/wishlistStore'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/products', icon: Grid3X3, label: 'Browse' },
  { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/account', icon: User, label: 'Account' },
]

export const BottomNav = () => {
  const { pathname } = useLocation()
  const { items } = useWishlistStore()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-[var(--border-color)] pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          const hasWishlist = href === '/wishlist' && items.length > 0

          return (
            <Link
              key={href}
              to={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors relative min-w-[44px] min-h-[44px] justify-center"
              aria-label={label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-500' : 'text-[var(--text-muted)]'}`}
                />
                {hasWishlist && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-blue-500' : 'text-[var(--text-muted)]'}`}>
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-blue-500/10 rounded-xl"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
