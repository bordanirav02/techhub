import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Save } from 'lucide-react'
import { profileSchema, type ProfileForm } from '@/lib/validators'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' },
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateProfile({ avatar: reader.result as string })
    reader.readAsDataURL(file)
    toast.success('Avatar updated!')
  }

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 500))
    updateProfile(data)
    setIsLoading(false)
    toast.success('Profile updated!')
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">My Profile</h2>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : user?.name?.[0]?.toUpperCase()
            }
          </div>
          <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
            <Camera className="w-3.5 h-3.5 text-white" />
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>
        <div>
          <p className="font-semibold text-[var(--text-primary)]">{user?.name}</p>
          <p className="text-sm text-[var(--text-muted)]">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Full Name</label>
            <input {...register('name')}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-blue-500/50" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Email</label>
            <input value={user?.email} disabled
              className="w-full bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-muted)] cursor-not-allowed" />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Phone</label>
            <input {...register('phone')} placeholder="+1 (555) 000-0000"
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-blue-500/50" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">Bio</label>
          <textarea {...register('bio')} rows={3} placeholder="Tell us a bit about yourself"
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-blue-500/50 resize-none" />
          {errors.bio && <p className="text-xs text-red-400 mt-1">{errors.bio.message}</p>}
        </div>

        <Button type="submit" loading={isLoading} icon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </form>
    </div>
  )
}
