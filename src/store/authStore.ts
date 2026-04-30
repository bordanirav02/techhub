import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Address, Order } from '@/types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  addresses: Address[]
  orders: Order[]

  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  addAddress: (address: Omit<Address, 'id'>) => void
  updateAddress: (id: string, data: Partial<Address>) => void
  deleteAddress: (id: string) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void
}

const hashPassword = (password: string) => btoa(password + 'techhub_salt')

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      addresses: [],
      orders: [],

      login: async (email, password) => {
        const stored = localStorage.getItem('techhub-users')
        const users: User[] = stored ? JSON.parse(stored) : []
        const user = users.find(u => u.email === email && u.passwordHash === hashPassword(password))

        if (!user) return false

        const token = btoa(`${user.id}:${Date.now() + 7 * 24 * 60 * 60 * 1000}`)
        set({ user, token, isAuthenticated: true })
        return true
      },

      register: async (name, email, password) => {
        const stored = localStorage.getItem('techhub-users')
        const users: User[] = stored ? JSON.parse(stored) : []

        if (users.some(u => u.email === email)) return false

        const user: User = {
          id: `user_${Date.now()}`,
          email,
          name,
          passwordHash: hashPassword(password),
          createdAt: new Date().toISOString(),
          notificationPrefs: {
            orderUpdates: true,
            promotions: true,
            priceDrops: true,
            newsletters: false,
          },
        }

        users.push(user)
        localStorage.setItem('techhub-users', JSON.stringify(users))

        const token = btoa(`${user.id}:${Date.now() + 7 * 24 * 60 * 60 * 1000}`)
        set({ user, token, isAuthenticated: true })
        return true
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      updateProfile: (data) => {
        const user = get().user
        if (!user) return

        const updated = { ...user, ...data }
        set({ user: updated })

        const stored = localStorage.getItem('techhub-users')
        const users: User[] = stored ? JSON.parse(stored) : []
        const idx = users.findIndex(u => u.id === user.id)
        if (idx !== -1) {
          users[idx] = updated
          localStorage.setItem('techhub-users', JSON.stringify(users))
        }
      },

      addAddress: (address) => {
        const id = `addr_${Date.now()}`
        const newAddress: Address = { ...address, id }
        set(state => {
          const addresses = address.isDefault
            ? state.addresses.map(a => ({ ...a, isDefault: false }))
            : state.addresses
          return { addresses: [...addresses, newAddress] }
        })
      },

      updateAddress: (id, data) => {
        set(state => ({
          addresses: state.addresses.map(a => {
            if (a.id !== id) {
              return data.isDefault ? { ...a, isDefault: false } : a
            }
            return { ...a, ...data }
          }),
        }))
      },

      deleteAddress: (id) => {
        set(state => ({ addresses: state.addresses.filter(a => a.id !== id) }))
      },

      addOrder: (order) => {
        set(state => ({ orders: [order, ...state.orders] }))
      },

      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  statusHistory: [
                    ...o.statusHistory,
                    { status, timestamp: new Date().toISOString(), description: `Order ${status}` },
                  ],
                }
              : o
          ),
        }))
      },
    }),
    { name: 'techhub-auth' }
  )
)
