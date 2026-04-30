import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, Notification } from '@/types'

interface UIStore {
  theme: Theme
  commandPaletteOpen: boolean
  notifications: Notification[]
  unreadCount: number
  recentSearches: string[]

  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  openCommandPalette: () => void
  closeCommandPalette: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markAllRead: () => void
  markRead: (id: string) => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Flash Deal Alert!',
    message: '30% off Sony WH-1000XM5 — ends in 2 hours!',
    type: 'deal',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    link: '/deals',
  },
  {
    id: 'n2',
    title: 'Price Drop',
    message: 'iPhone 15 Pro Max price dropped by $100 in your wishlist.',
    type: 'priceAlert',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: '/wishlist',
  },
  {
    id: 'n3',
    title: 'Order Update',
    message: 'Your order #TH-2024-001 has been shipped.',
    type: 'order',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    link: '/account/orders',
  },
]

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      commandPaletteOpen: false,
      notifications: MOCK_NOTIFICATIONS,
      unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length,
      recentSearches: [],

      setTheme: (theme) => {
        set({ theme })
        document.documentElement.className = theme
      },

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        get().setTheme(next)
      },

      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),

      addNotification: (notification) => {
        const n: Notification = {
          ...notification,
          id: `n_${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set(state => ({
          notifications: [n, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      },

      markAllRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0,
        }))
      },

      markRead: (id) => {
        set(state => {
          const notifications = state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
          )
          return {
            notifications,
            unreadCount: notifications.filter(n => !n.isRead).length,
          }
        })
      },

      addRecentSearch: (query) => {
        if (!query.trim()) return
        set(state => ({
          recentSearches: [
            query,
            ...state.recentSearches.filter(s => s !== query),
          ].slice(0, 10),
        }))
      },

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: 'techhub-ui', partialize: (s) => ({ theme: s.theme, recentSearches: s.recentSearches }) }
  )
)
