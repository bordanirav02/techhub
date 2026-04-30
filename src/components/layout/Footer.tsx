import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, ArrowUp, Twitter, Github, Instagram, Linkedin } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { CATEGORIES } from '@/lib/constants'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const Footer = () => {
  const { theme, toggleTheme } = useUIStore()
  const [email, setEmail] = useState('')

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast.success('Thanks for subscribing!')
      setEmail('')
    }
  }

  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-color)] mt-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'Inter' }}>
                Tech<span className="text-blue-500">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs mb-6">
              Your destination for the latest tech gadgets. Premium products, unbeatable prices, and exceptional service.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/50 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-blue-500/50 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.id}`} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Account</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/account', label: 'My Profile' },
                { href: '/account/orders', label: 'Orders' },
                { href: '/wishlist', label: 'Wishlist' },
                { href: '/account/addresses', label: 'Addresses' },
                { href: '/account/analytics', label: 'Analytics' },
                { href: '/account/settings', label: 'Settings' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Support</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/deals', label: 'Deals' },
                { href: '/compatibility', label: 'Compatibility' },
                { href: '/compare', label: 'Compare' },
                { href: '#', label: 'FAQ' },
                { href: '#', label: 'Contact Us' },
                { href: '#', label: 'Return Policy' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link to={href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} TechHub. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" /> Back to top
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
