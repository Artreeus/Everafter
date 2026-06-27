'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { WizardState, WizardAction } from '@/types/capsule.types'

const addSchema = z.object({
  name:  z.string().min(1, 'Name is required').max(100).trim(),
  email: z.string().email('Invalid email address'),
})
type AddForm = z.infer<typeof addSchema>

interface RecipientsStepProps {
  state:    WizardState
  dispatch: React.Dispatch<WizardAction>
  onNext:   () => void
  onBack:   () => void
}

export function RecipientsStep({ state, dispatch, onNext, onBack }: RecipientsStepProps) {
  const [submitError, setSubmitError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddForm>({
    resolver: zodResolver(addSchema),
  })

  const addRecipient = handleSubmit((data) => {
    const isDupe = state.recipients.some(
      (r) => r.email.toLowerCase() === data.email.toLowerCase(),
    )
    if (isDupe) {
      setSubmitError('This email is already added.')
      return
    }
    dispatch({ type: 'ADD_RECIPIENT', payload: data })
    reset()
    setSubmitError('')
  })

  const handleNext = () => {
    if (state.recipients.length === 0) {
      setSubmitError('Add at least one recipient.')
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Recipient list */}
      {state.recipients.length > 0 && (
        <ul className="space-y-2">
          {state.recipients.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-lg border border-stone bg-ivory px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-charcoal">{r.name}</p>
                <p className="text-xs text-warm-gray">{r.email}</p>
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: 'REMOVE_RECIPIENT', payload: r.id })}
                className="text-warm-gray hover:text-rose transition-colors p-1 rounded"
                aria-label={`Remove ${r.name}`}
              >
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add recipient form */}
      {state.recipients.length < 10 && (
        <form onSubmit={addRecipient} className="rounded-xl border border-dashed border-stone p-5 space-y-3">
          <p className="text-xs font-medium text-warm-gray uppercase tracking-widest">
            Add recipient
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <input
                {...register('name')}
                placeholder="Their name"
                className={cn(
                  'block w-full rounded-lg border bg-ivory px-3.5 py-2.5 text-sm text-charcoal',
                  'placeholder:text-warm-gray/50 outline-none transition-all duration-150',
                  'focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
                  errors.name ? 'border-rose' : 'border-stone',
                )}
              />
              {errors.name && <p className="mt-1 text-xs text-rose">{errors.name.message}</p>}
            </div>
            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Their email"
                className={cn(
                  'block w-full rounded-lg border bg-ivory px-3.5 py-2.5 text-sm text-charcoal',
                  'placeholder:text-warm-gray/50 outline-none transition-all duration-150',
                  'focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
                  errors.email ? 'border-rose' : 'border-stone',
                )}
              />
              {errors.email && <p className="mt-1 text-xs text-rose">{errors.email.message}</p>}
            </div>
          </div>

          {submitError && <p className="text-xs text-rose">{submitError}</p>}

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone bg-ivory px-4 py-2 text-xs font-medium text-charcoal hover:bg-stone/30 transition-colors"
          >
            <UserPlus size={13} />
            Add recipient
          </button>
        </form>
      )}

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="text-sm text-warm-gray hover:text-charcoal transition-colors">
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-charcoal px-6 py-2.5 text-sm font-medium text-ivory hover:bg-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
