import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, updateProfile, logout } = useAuthStore()
  const { theme, toggleTheme } = useUIStore()
  const navigate = useNavigate()
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [notifPrefs, setNotifPrefs] = useState(user?.notificationPrefs || {
    orderUpdates: true, promotions: true, priceDrops: true, newsletters: false
  })

  const handleToggleNotif = (key: keyof typeof notifPrefs) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] }
    setNotifPrefs(updated)
    updateProfile({ notificationPrefs: updated })
    toast.success('Preferences saved')
  }

  const handleDeleteAccount = () => {
    logout()
    toast.success('Account deleted')
    navigate('/')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[var(--text-primary)]">Settings</h2>

      {/* Appearance */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Theme</p>
            <p className="text-xs text-[var(--text-muted)]">Currently using {theme} mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] hover:border-blue-500/50 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Notifications</h3>
        <div className="space-y-4">
          {([
            { key: 'orderUpdates', label: 'Order Updates', desc: 'Shipment tracking, delivery confirmations' },
            { key: 'promotions', label: 'Promotions', desc: 'Flash sales, exclusive offers' },
            { key: 'priceDrops', label: 'Price Drop Alerts', desc: 'When wishlist items go on sale' },
            { key: 'newsletters', label: 'Newsletter', desc: 'Weekly tech news and product picks' },
          ] as const).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
                <p className="text-xs text-[var(--text-muted)]">{desc}</p>
              </div>
              <button
                onClick={() => handleToggleNotif(key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifPrefs[key] ? 'bg-blue-500' : 'bg-[var(--bg-hover)]'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifPrefs[key] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-[var(--bg-card)] border border-red-500/20 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-red-400 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Delete Account</p>
            <p className="text-xs text-[var(--text-muted)]">Permanently delete your account and all data</p>
          </div>
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/5 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Delete Account" size="sm">
        <div className="p-5">
          <p className="text-sm text-[var(--text-secondary)] mb-5">
            Are you sure you want to delete your account? This action is irreversible.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteConfirmOpen(false)} className="flex-1 py-2.5 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl text-sm font-medium transition-colors hover:border-[var(--border-hover)]">
              Cancel
            </button>
            <Button variant="danger" fullWidth onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
