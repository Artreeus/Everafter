'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ThemeSelector } from '../ThemeSelector'
import { cn } from '@/lib/utils/cn'
import type { WizardState, WizardAction, CapsuleTheme } from '@/types/capsule.types'

const schema = z.object({
  title:   z.string().min(1, 'Give your capsule a title').max(120).trim(),
  message: z.string().max(600).optional(),
})
type FormValues = z.infer<typeof schema>

interface BasicsStepProps {
  state:    WizardState
  dispatch: React.Dispatch<WizardAction>
  onNext:   () => void
  userPlan?: 'free' | 'plus'
}

export function BasicsStep({ state, dispatch, onNext, userPlan }: BasicsStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: state.title, message: state.message },
  })

  const onSubmit = handleSubmit((data) => {
    const payload: Pick<WizardState, 'title' | 'theme' | 'message'> = {
      title:   data.title,
      theme:   state.theme,
      message: data.message ?? '',
    }
    dispatch({ type: 'SET_BASICS', payload })
    onNext()
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">
          Capsule title
        </label>
        <input
          {...register('title')}
          placeholder="e.g. To my daughter on her wedding day"
          className={cn(
            'block w-full rounded-lg border bg-ivory px-3.5 py-2.5 text-sm text-charcoal',
            'placeholder:text-warm-gray/50 transition-all duration-150 outline-none',
            'focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
            errors.title ? 'border-rose' : 'border-stone hover:border-warm-gray/50',
          )}
        />
        {errors.title && <p className="mt-1 text-xs text-rose">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-charcoal mb-3 tracking-wide">
          Theme
        </label>
        <ThemeSelector
          value={state.theme}
          userPlan={userPlan}
          onChange={(newTheme: CapsuleTheme) => {
            const payload: Pick<WizardState, 'title' | 'theme' | 'message'> = {
              title:   state.title,
              theme:   newTheme,
              message: state.message,
            }
            dispatch({ type: 'SET_BASICS', payload })
          }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">
          Cover message <span className="text-warm-gray font-normal">(optional)</span>
        </label>
        <textarea
          {...register('message')}
          rows={3}
          placeholder="A short note shown before the capsule opens..."
          className={cn(
            'block w-full rounded-lg border bg-ivory px-3.5 py-2.5 text-sm text-charcoal resize-none',
            'placeholder:text-warm-gray/50 transition-all duration-150 outline-none leading-relaxed',
            'focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
            'border-stone hover:border-warm-gray/50',
          )}
        />
        {errors.message && <p className="mt-1 text-xs text-rose">{errors.message.message}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="rounded-lg bg-charcoal px-6 py-2.5 text-sm font-medium text-ivory hover:bg-dark transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Continue
        </button>
      </div>
    </form>
  )
}
