'use client'

import { useForm }          from 'react-hook-form'
import { zodResolver }      from '@hookform/resolvers/zod'
import { z }                from 'zod'
import { useTransition }    from 'react'
import { toast }            from 'sonner'
import { cn }               from '@/lib/utils/cn'
import { ThemeSelector }    from '@/features/capsules/components/creation/ThemeSelector'
import { updateCapsuleAction } from '@/features/capsules/actions/update-capsule.action'
import type { Recurrence }  from '@/types/capsule.types'

const RECURRENCE_OPTIONS: { value: Recurrence; label: string }[] = [
  { value: 'once',     label: 'Once'     },
  { value: 'monthly',  label: 'Monthly'  },
  { value: 'annually', label: 'Annually' },
]

const COMMON_TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Toronto', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Istanbul',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Dhaka', 'Asia/Singapore', 'Asia/Tokyo',
  'Australia/Sydney', 'Pacific/Auckland',
]

const schema = z.object({
  title:         z.string().min(1, 'Title is required').max(120).trim(),
  theme:         z.enum(['classic', 'floral', 'midnight', 'golden', 'sakura', 'ocean', 'ember', 'velvet']),
  message:       z.string().max(600).optional(),
  scheduledDate: z.string().min(1, 'Date is required'),
  scheduledTime: z.string(),
  timezone:      z.string(),
  notifyOnOpen:  z.boolean(),
  allowReply:    z.boolean(),
  recurrence:    z.enum(['once', 'monthly', 'annually']),
})

type FormValues = z.infer<typeof schema>

interface EditBasicsFormProps {
  capsuleId:    string
  title:        string
  theme:        string
  message:      string | null
  scheduledDate: string
  scheduledTime: string
  timezone:     string
  notifyOnOpen: boolean
  allowReply:   boolean
  recurrence:   Recurrence
  userPlan?:    'free' | 'plus'
}

export function EditBasicsForm({
  capsuleId, title, theme, message, scheduledDate, scheduledTime, timezone, notifyOnOpen, allowReply, recurrence, userPlan,
}: EditBasicsFormProps) {
  const [pending, startTransition] = useTransition()

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title, theme: theme as FormValues['theme'], message: message ?? '', scheduledDate, scheduledTime, timezone, notifyOnOpen, allowReply, recurrence },
  })

  const currentTheme      = watch('theme')
  const currentNotify     = watch('notifyOnOpen')
  const currentReply      = watch('allowReply')
  const currentRecurrence = watch('recurrence')
  const minDate       = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = await updateCapsuleAction(capsuleId, data)
      if (result.success) {
        toast.success('Capsule updated.')
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">Title</label>
        <input
          {...register('title')}
          className={cn(
            'block w-full rounded-xl border bg-ivory px-4 py-2.5 text-sm text-charcoal',
            'outline-none transition-all duration-150 focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
            errors.title ? 'border-rose' : 'border-stone hover:border-warm-gray/50',
          )}
          placeholder="To my daughter on her wedding day"
        />
        {errors.title && <p className="mt-1 text-xs text-rose">{errors.title.message}</p>}
      </div>

      {/* Theme */}
      <div>
        <label className="block text-xs font-medium text-charcoal mb-3 tracking-wide">Theme</label>
        <ThemeSelector
          value={currentTheme}
          onChange={(t) => setValue('theme', t, { shouldDirty: true })}
          userPlan={userPlan}
        />
      </div>

      {/* Cover message */}
      <div>
        <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">
          Cover message <span className="text-warm-gray font-normal">(optional)</span>
        </label>
        <textarea
          {...register('message')}
          rows={3}
          className={cn(
            'block w-full rounded-xl border border-stone bg-ivory px-4 py-2.5 text-sm text-charcoal',
            'outline-none transition-all duration-150 resize-none',
            'focus:ring-2 focus:ring-gold/40 focus:border-gold/60 hover:border-warm-gray/50',
          )}
          placeholder="A few words before they open it…"
        />
      </div>

      {/* Date + time */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">Delivery date</label>
          <input
            type="date"
            min={minDate}
            {...register('scheduledDate')}
            className={cn(
              'block w-full rounded-xl border bg-ivory px-4 py-2.5 text-sm text-charcoal',
              'outline-none transition-all duration-150 focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
              errors.scheduledDate ? 'border-rose' : 'border-stone hover:border-warm-gray/50',
            )}
          />
          {errors.scheduledDate && <p className="mt-1 text-xs text-rose">{errors.scheduledDate.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">Delivery time</label>
          <input
            type="time"
            {...register('scheduledTime')}
            className={cn(
              'block w-full rounded-xl border border-stone bg-ivory px-4 py-2.5 text-sm text-charcoal',
              'outline-none transition-all duration-150 focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
              'hover:border-warm-gray/50',
            )}
          />
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">Timezone</label>
        <select
          {...register('timezone')}
          className={cn(
            'block w-full rounded-xl border border-stone bg-ivory px-4 py-2.5 text-sm text-charcoal',
            'outline-none transition-all duration-150 focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
            'hover:border-warm-gray/50',
          )}
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Recurrence */}
      <div>
        <label className="block text-xs font-medium text-charcoal mb-3 tracking-wide">Repeat delivery</label>
        <div className="flex gap-2">
          {RECURRENCE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('recurrence', value, { shouldDirty: true })}
              className={cn(
                'flex-1 rounded-lg border py-2.5 text-xs font-medium transition-all duration-150',
                currentRecurrence === value
                  ? 'border-charcoal bg-charcoal text-ivory'
                  : 'border-stone text-warm-gray hover:border-warm-gray/60 hover:text-charcoal',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings toggles */}
      <div className="space-y-3">
        <SettingsToggle
          checked={currentNotify}
          onChange={(v) => setValue('notifyOnOpen', v, { shouldDirty: true })}
          label="Notify me when opened"
          description="Get an email when a recipient opens this capsule"
        />
        <SettingsToggle
          checked={currentReply}
          onChange={(v) => setValue('allowReply', v, { shouldDirty: true })}
          label="Allow recipient replies"
          description="Recipients can send you a short reply after opening"
        />
      </div>

      <button
        type="submit"
        disabled={!isDirty || pending}
        className={cn(
          'px-6 py-2.5 rounded-xl text-sm font-medium transition-colors',
          isDirty && !pending
            ? 'bg-charcoal text-ivory hover:bg-charcoal/90'
            : 'bg-stone/40 text-warm-gray cursor-not-allowed',
        )}
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}

function SettingsToggle({
  checked, onChange, label, description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description: string
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-stone/50 bg-cream">
      <div>
        <p className="text-sm font-medium text-charcoal">{label}</p>
        <p className="text-xs text-warm-gray mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0',
          checked ? 'bg-charcoal' : 'bg-stone',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  )
}
