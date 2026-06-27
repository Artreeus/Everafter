'use client'

import { useState, useTransition } from 'react'
import { updateProfileAction }     from '@/features/user/actions/update-profile.action'
import { toast }                   from 'sonner'
import { cn }                      from '@/lib/utils/cn'

interface ProfileFormProps {
  name:               string
  emailNotifications: boolean
}

export function ProfileForm({ name: initialName, emailNotifications: initialNotify }: ProfileFormProps) {
  const [name,    setName]    = useState(initialName)
  const [notify,  setNotify]  = useState(initialNotify)
  const [isPending, start]    = useTransition()
  const dirty = name !== initialName || notify !== initialNotify

  const handleSave = () => {
    start(async () => {
      const result = await updateProfileAction({ name, emailNotifications: notify })
      if (result.success) {
        toast.success('Profile updated.')
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">
          Display name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full max-w-sm rounded-lg border border-stone bg-ivory px-3.5 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/40 outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-all"
        />
      </div>

      {/* Email notifications */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <button
            type="button"
            role="switch"
            aria-checked={notify}
            onClick={() => setNotify(!notify)}
            className={cn(
              'relative h-5 w-9 rounded-full transition-colors duration-200 flex-shrink-0',
              notify ? 'bg-charcoal' : 'bg-stone',
            )}
          >
            <span className={cn(
              'absolute top-0.5 h-4 w-4 rounded-full bg-ivory shadow-soft transition-transform duration-200',
              notify ? 'translate-x-4' : 'translate-x-0.5',
            )} />
          </button>
          <div>
            <p className="text-sm font-medium text-charcoal">Email notifications</p>
            <p className="text-xs text-warm-gray">Get notified when a recipient opens your capsule.</p>
          </div>
        </label>
      </div>

      {/* Save */}
      <div>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || isPending}
          className={cn(
            'rounded-lg bg-charcoal px-5 py-2.5 text-sm font-medium text-ivory',
            'hover:bg-dark transition-colors',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
        >
          {isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
