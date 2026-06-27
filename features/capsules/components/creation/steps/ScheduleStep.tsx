'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/dates'
import type { WizardState, WizardAction, Recurrence } from '@/types/capsule.types'

const RECURRENCE_OPTIONS: { value: Recurrence; label: string; description: string }[] = [
  { value: 'once',     label: 'Once',     description: 'Delivers one time'    },
  { value: 'monthly',  label: 'Monthly',  description: 'Repeats every month'  },
  { value: 'annually', label: 'Annually', description: 'Repeats every year'   },
]

const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Istanbul',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
]

interface ScheduleStepProps {
  state:    WizardState
  dispatch: React.Dispatch<WizardAction>
  onNext:   () => void
  onBack:   () => void
}

export function ScheduleStep({ state, dispatch, onNext, onBack }: ScheduleStepProps) {
  const [error, setError] = useState('')

  const today = new Date()
  const minDate = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const update = (patch: Partial<Pick<WizardState, 'scheduledDate' | 'scheduledTime' | 'timezone'>>) => {
    dispatch({
      type: 'SET_SCHEDULE',
      payload: {
        scheduledDate: state.scheduledDate,
        scheduledTime: state.scheduledTime,
        timezone:      state.timezone,
        ...patch,
      },
    })
  }

  const handleNext = () => {
    if (!state.scheduledDate) {
      setError('Please choose a delivery date.')
      return
    }
    const chosen = new Date(`${state.scheduledDate}T${state.scheduledTime}`)
    if (chosen <= new Date()) {
      setError('Delivery date must be at least 24 hours from now.')
      return
    }
    setError('')
    onNext()
  }

  const previewDate =
    state.scheduledDate
      ? formatDate(`${state.scheduledDate}T${state.scheduledTime}`, {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        })
      : null

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">
            Delivery date
          </label>
          <input
            type="date"
            min={minDate}
            value={state.scheduledDate}
            onChange={(e) => { update({ scheduledDate: e.target.value }); setError('') }}
            className={cn(
              'block w-full rounded-lg border bg-ivory px-3.5 py-2.5 text-sm text-charcoal',
              'outline-none transition-all duration-150',
              'focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
              error ? 'border-rose' : 'border-stone hover:border-warm-gray/50',
            )}
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">
            Delivery time
          </label>
          <input
            type="time"
            value={state.scheduledTime}
            onChange={(e) => update({ scheduledTime: e.target.value })}
            className={cn(
              'block w-full rounded-lg border border-stone bg-ivory px-3.5 py-2.5 text-sm text-charcoal',
              'outline-none transition-all duration-150',
              'focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
              'hover:border-warm-gray/50',
            )}
          />
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">
          Timezone
        </label>
        <select
          value={state.timezone}
          onChange={(e) => update({ timezone: e.target.value })}
          className={cn(
            'block w-full rounded-lg border border-stone bg-ivory px-3.5 py-2.5 text-sm text-charcoal',
            'outline-none transition-all duration-150',
            'focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
            'hover:border-warm-gray/50',
          )}
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Preview */}
      {previewDate && (
        <div className="rounded-xl border border-stone/50 bg-cream p-4">
          <p className="text-xs text-warm-gray mb-1 uppercase tracking-widest">This capsule will be delivered on</p>
          <p className="font-display text-lg text-charcoal">{previewDate}</p>
          <p className="text-xs text-warm-gray mt-0.5">{state.timezone.replace(/_/g, ' ')}</p>
        </div>
      )}

      {/* Recurrence */}
      <div>
        <label className="block text-xs font-medium text-charcoal mb-3 tracking-wide">Repeat delivery</label>
        <div className="flex gap-2">
          {RECURRENCE_OPTIONS.map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              title={description}
              onClick={() => dispatch({ type: 'SET_RECURRENCE', payload: value })}
              className={cn(
                'flex-1 rounded-lg border py-2.5 text-xs font-medium transition-all duration-150',
                state.recurrence === value
                  ? 'border-charcoal bg-charcoal text-ivory'
                  : 'border-stone text-warm-gray hover:border-warm-gray/60 hover:text-charcoal',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {state.recurrence !== 'once' && (
          <p className="mt-2 text-xs text-warm-gray">
            The capsule will re-deliver automatically {state.recurrence === 'monthly' ? 'every month' : 'every year'} on this date.
          </p>
        )}
      </div>

      {error && <p className="text-xs text-rose">{error}</p>}

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
