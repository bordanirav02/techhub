import { useState } from 'react'
import { Plus, Edit2, Trash2, MapPin, Check } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
import type { Address } from '@/types'

const emptyAddress: Omit<Address, 'id'> = {
  label: '', fullName: '', street: '', city: '', state: '', zip: '', country: 'US', isDefault: false
}

export default function Addresses() {
  const { addresses, addAddress, updateAddress, deleteAddress } = useAuthStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Address | null>(null)
  const [form, setForm] = useState<Omit<Address, 'id'>>(emptyAddress)

  const openAdd = () => {
    setEditing(null)
    setForm(emptyAddress)
    setModalOpen(true)
  }

  const openEdit = (address: Address) => {
    setEditing(address)
    const { id, ...rest } = address
    setForm(rest)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.fullName || !form.street || !form.city) {
      toast.error('Please fill in required fields')
      return
    }
    if (editing) {
      updateAddress(editing.id, form)
      toast.success('Address updated!')
    } else {
      addAddress(form)
      toast.success('Address added!')
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Saved Addresses</h2>
        <Button onClick={openAdd} size="sm" icon={<Plus className="w-4 h-4" />}>Add Address</Button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-12 text-center">
          <MapPin className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-primary)] font-medium mb-1">No addresses saved</p>
          <p className="text-sm text-[var(--text-muted)]">Add an address for faster checkout</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className={`bg-[var(--bg-card)] border rounded-2xl p-5 ${addr.isDefault ? 'border-blue-500/40' : 'border-[var(--border-color)]'}`}>
              {addr.isDefault && (
                <span className="flex items-center gap-1 text-xs text-blue-400 font-medium mb-2">
                  <Check className="w-3 h-3" /> Default
                </span>
              )}
              <p className="font-semibold text-[var(--text-primary)] mb-1">{addr.label}</p>
              <p className="text-sm text-[var(--text-secondary)]">{addr.fullName}</p>
              <p className="text-sm text-[var(--text-secondary)]">{addr.street}</p>
              <p className="text-sm text-[var(--text-secondary)]">{addr.city}, {addr.state} {addr.zip}</p>
              <p className="text-sm text-[var(--text-secondary)]">{addr.country}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(addr)} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => { deleteAddress(addr.id); toast.success('Address deleted') }}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors ml-2">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Address' : 'Add Address'} size="md">
        <div className="p-5 space-y-3">
          {Object.keys(emptyAddress).map(key => key !== 'isDefault' && (
            <div key={key}>
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                value={String((form as Record<string, unknown>)[key] ?? '')}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-blue-500/50"
              />
            </div>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={e => setForm(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="w-4 h-4 rounded text-blue-500" />
            <span className="text-sm text-[var(--text-secondary)]">Set as default</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl text-sm font-medium">
              Cancel
            </button>
            <Button onClick={handleSave} fullWidth>Save Address</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
