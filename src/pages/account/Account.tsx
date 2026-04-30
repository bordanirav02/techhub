import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { User, Package, MapPin, Heart, BarChart2, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/account/profile', icon: User, label: 'Profile' },
  { to: '/account/orders', icon: Package, label: 'Orders' },
  { to: '/account/addresses', icon: MapPin, label: 'Addresses' },
  { to: '/account/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/account/settings', icon: Settings, label: 'Settings' },
]

export default function Account() {
  const { isAuthenticated, user, logout } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/account' }} replace />

  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 has-bottom-nav">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[var(--border-color)]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold overflow-hidden">
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : user?.name?.[0]?.toUpperCase()
                }
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[var(--text-primary)] truncate">{user?.name}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
              </div>
            </div>
            <nav className="space-y-0.5">
              {NAV.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-500/10 text-blue-400 font-medium'
                        : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                    }`
                  }>
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </NavLink>
              ))}
              <NavLink to="/wishlist"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-colors">
                <Heart className="w-4 h-4 shrink-0" /> Wishlist
              </NavLink>
              <button
                onClick={() => { logout(); toast.success('Logged out') }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/5 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" /> Log Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </main>
  )
}
