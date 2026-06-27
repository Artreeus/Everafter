'use client'

import { useState, useTransition }  from 'react'
import { useForm }                   from 'react-hook-form'
import { zodResolver }               from '@hookform/resolvers/zod'
import { z }                         from 'zod'
import { Trash2, UserPlus }          from 'lucide-react'
import { toast }                     from 'sonner'
import { cn }                        from '@/lib/utils/cn'
import { addRecipientAction }        from '@/features/capsules/actions/add-recipient.action'
import { removeRecipientAction }     from '@/features/capsules/actions/remove-recipient.action'

const schema = z.object({
  name:  z.string().min(1, 'Name is required').max(100).trim(),
  email: z.string().email('Invalid email').toLowerCase(),
})
type FormValues = z.infer<typeof schema>

interface Recipient {
  id:    string
  name:  string
  email: string
}

interface EditRecipientsSectionProps {
  capsuleId:  string
  recipients: Recipient[]
}

export function EditRecipientsSection({
  capsuleId,
  recipients: initial,
}: EditRecipientsSectionProps) {
  const [recipients, setRecipients] = useState<Recipient[]>(initial)
  const [pending, startTransition]  = useTransition()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  function onAdd(data: FormValues) {
    startTransition(async () => {
      const result = await addRecipientAction(capsuleId, data)
      if (result.success) {
        setRecipients((prev) => [...prev, result.recipient])
        reset()
        toast.success(`${result.recipient.name} added.`)
      } else {
        toast.error(result.error)
      }
    })
  }

  function onRemove(id: string, name: string) {
    startTransition(async () => {
      const result = await removeRecipientAction(capsuleId, id)
      if (result.success) {
        setRecipients((prev) => prev.filter((r) => r.id !== id))
        toast.success(`${name} removed.`)
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Existing recipients */}
      {recipients.length > 0 ? (
        <ul className="space-y-2">
          {recipients.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-xl border border-stone/50 bg-ivory px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{r.name}</p>
                <p className="text-xs text-warm-gray truncate">{r.email}</p>
              </div>
              <button
                onClick={() => onRemove(r.id, r.name)}
                disabled={pending || recipients.length <= 1}
                className="ml-3 p-1.5 text-warm-gray hover:text-rose transition-colors disabled:opacity-30
                           disabled:pointer-events-none rounded-lg flex-shrink-0"
                title={recipients.length <= 1 ? 'At least one recipient required' : 'Remove'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-warm-gray italic">No recipients yet.</p>
      )}

      {/* Add form */}
      {recipients.length < 10 && (
        <form
          onSubmit={handleSubmit(onAdd)}
          className="rounded-xl border border-dashed border-stone p-4 space-y-3"
        >
          <p className="text-xs font-medium text-warm-gray uppercase tracking-widest">Add recipient</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <input
                {...register('name')}
                placeholder="Name"
                className={cn(
                  'block w-full rounded-xl border bg-ivory px-3.5 py-2.5 text-sm text-charcoal',
                  'outline-none transition-all duration-150 focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
                  errors.name ? 'border-rose' : 'border-stone hover:border-warm-gray/50',
                )}
              />
              {errors.name && <p className="mt-1 text-xs text-rose">{errors.name.message}</p>}
            </div>
            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Email"
                className={cn(
                  'block w-full rounded-xl border bg-ivory px-3.5 py-2.5 text-sm text-charcoal',
                  'outline-none transition-all duration-150 focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
                  errors.email ? 'border-rose' : 'border-stone hover:border-warm-gray/50',
                )}
              />
              {errors.email && <p className="mt-1 text-xs text-rose">{errors.email.message}</p>}
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone bg-ivory px-4 py-2
                       text-xs font-medium text-charcoal hover:bg-stone/30 transition-colors disabled:opacity-50"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add recipient
          </button>
        </form>
      )}
    </div>
  )
}
