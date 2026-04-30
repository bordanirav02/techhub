import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { CompareBar } from '@/components/product/CompareBar'
import { useUIStore } from '@/store/uiStore'
import { Skeleton } from '@/components/ui/Skeleton'

const Home = lazy(() => import('@/pages/Home'))
const Products = lazy(() => import('@/pages/Products'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Cart = lazy(() => import('@/pages/Cart'))
const Wishlist = lazy(() => import('@/pages/Wishlist'))
const Compare = lazy(() => import('@/pages/Compare'))
const Search = lazy(() => import('@/pages/Search'))
const Deals = lazy(() => import('@/pages/Deals'))
const Compatibility = lazy(() => import('@/pages/Compatibility'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'))
const Account = lazy(() => import('@/pages/account/Account'))
const Profile = lazy(() => import('@/pages/account/Profile'))
const Orders = lazy(() => import('@/pages/account/Orders'))
const OrderDetail = lazy(() => import('@/pages/account/OrderDetail'))
const Addresses = lazy(() => import('@/pages/account/Addresses'))
const Analytics = lazy(() => import('@/pages/account/Analytics'))
const Settings = lazy(() => import('@/pages/account/Settings'))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
    },
  },
})

const PageLoader = () => (
  <div className="max-w-[1400px] mx-auto px-4 py-10 space-y-4">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  </div>
)

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

const ThemeSync = () => {
  const { theme } = useUIStore()
  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  useEffect(() => {
    const handler = () => document.body.classList.add('using-mouse')
    const keyHandler = () => document.body.classList.remove('using-mouse')
    window.addEventListener('mousedown', handler)
    window.addEventListener('keydown', keyHandler)
    return () => {
      window.removeEventListener('mousedown', handler)
      window.removeEventListener('keydown', keyHandler)
    }
  }, [])
  return null
}

function AppInner() {
  const location = useLocation()
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        useUIStore.getState().openCommandPalette()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeSync />
      {!isAuthPage && <Navbar />}
      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/search" element={<Search />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/compatibility" element={<Compatibility />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
              <Route path="/account" element={<Account />}>
                <Route index element={<Profile />} />
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={
                <div className="max-w-[1400px] mx-auto px-4 py-20 text-center has-bottom-nav">
                  <div className="text-7xl mb-4 gradient-text font-black">404</div>
                  <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Page not found</h1>
                  <p className="text-[var(--text-muted)] mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
                    ← Go Home
                  </a>
                </div>
              } />
            </Routes>
          </PageTransition>
        </Suspense>
      </div>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNav />}
      <CartDrawer />
      <CommandPalette />
      {!isAuthPage && <CompareBar />}
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInner />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif',
            },
            success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
