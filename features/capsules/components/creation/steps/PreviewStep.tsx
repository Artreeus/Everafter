'use client'

import { PenLine, Image, Mic, BookOpen, Users, Calendar, Palette } from 'lucide-react'
import { formatDate } from '@/lib/utils/dates'
import { cn } from '@/lib/utils/cn'
import type { WizardState, WizardAction, ItemType } from '@/types/capsule.types'

const THEME_LABELS = {
  classic: 'Classic', floral: 'Floral', midnight: 'Midnight', golden: 'Golden',
  sakura: 'Sakura', ocean: 'Ocean', ember: 'Ember', velvet: 'Velvet',
}
const ITEM_ICONS: Record<ItemType, typeof PenLine> = {
  letter: PenLine, photo: Image, voice: Mic, memory: BookOpen,
}

interface PreviewStepProps {
  state:       WizardState
  dispatch:    React.Dispatch<WizardAction>
  onBack:      () => void
  onSubmit:    () => void
  isSubmitting: boolean
}

export function PreviewStep({ state, dispatch, onBack, onSubmit, isSubmitting }: PreviewStepProps) {
  const deliveryDateStr = state.scheduledDate
    ? formatDate(`${state.scheduledDate}T${state.scheduledTime}`, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—'

  const itemCounts = state.items.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-stone/50 bg-cream overflow-hidden">
        {/* Capsule header */}
        <div className="px-5 py-4 border-b border-stone/40">
          <p className="text-xs text-warm-gray uppercase tracking-widest mb-1">Capsule</p>
          <h2 className="font-display text-xl text-charcoal font-light">{state.title || 'Untitled'}</h2>
          {state.message && (
            <p className="text-sm text-warm-gray mt-2 leading-relaxed italic">&ldquo;{state.message}&rdquo;</p>
          )}
        </div>

        {/* Details grid */}
        <div className="divide-y divide-stone/30">
          <DetailRow icon={<Users size={14} />} label="Recipients">
            <div className="space-y-0.5">
              {state.recipients.map((r) => (
                <p key={r.id} className="text-sm text-charcoal">
                  {r.name} <span className="text-warm-gray">· {r.email}</span>
                </p>
              ))}
              {state.recipients.length === 0 && (
                <p className="text-sm text-rose">No recipients added</p>
              )}
            </div>
          </DetailRow>

          <DetailRow icon={<Calendar size={14} />} label="Delivery date">
            <p className="text-sm text-charcoal">{deliveryDateStr}</p>
            <p className="text-xs text-warm-gray">{state.timezone.replace(/_/g, ' ')}</p>
            {state.recurrence !== 'once' && (
              <p className="text-xs text-warm-gray mt-0.5">Repeats {state.recurrence}</p>
            )}
          </DetailRow>

          <DetailRow icon={<Palette size={14} />} label="Theme">
            <p className="text-sm text-charcoal">{THEME_LABELS[state.theme]}</p>
          </DetailRow>

          <DetailRow icon={<PenLine size={14} />} label="Contents">
            {state.items.length === 0 ? (
              <p className="text-sm text-warm-gray">No items added yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.entries(itemCounts).map(([type, count]) => {
                  const Icon = ITEM_ICONS[type as ItemType]
                  return (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1 rounded-full bg-ivory border border-stone px-2.5 py-1 text-xs text-charcoal"
                    >
                      <Icon size={11} />
                      {count} {type}{count > 1 ? 's' : ''}
                    </span>
                  )
                })}
              </div>
            )}
          </DetailRow>
        </div>
      </div>

      {/* Settings toggles */}
      <div className="space-y-3">
        <SettingToggle
          checked={state.notifyOnOpen}
          onChange={(v) => dispatch({ type: 'SET_NOTIFY', payload: v })}
          label="Notify me when it's opened"
          description="You'll receive an email when the recipient opens your capsule."
        />
        <SettingToggle
          checked={state.allowReply}
          onChange={(v) => dispatch({ type: 'SET_ALLOW_REPLY', payload: v })}
          label="Allow recipient replies"
          description="Recipients can send you a short reply after opening."
        />
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="text-sm text-warm-gray hover:text-charcoal transition-colors">
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || state.recipients.length === 0 || !state.scheduledDate}
          className={cn(
            'rounded-lg bg-charcoal px-6 py-2.5 text-sm font-medium text-ivory',
            'hover:bg-dark transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isSubmitting ? 'Saving…' : 'Save draft'}
        </button>
      </div>
    </div>
  )
}

function SettingToggle({
  checked, onChange, label, description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description: string
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors duration-200 flex-shrink-0',
          checked ? 'bg-charcoal' : 'bg-stone',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-ivory shadow-soft transition-transform duration-200',
            checked ? 'translate-x-4' : 'translate-x-0.5',
          )}
        />
      </button>
      <div>
        <p className="text-sm font-medium text-charcoal">{label}</p>
        <p className="text-xs text-warm-gray">{description}</p>
      </div>
    </label>
  )
}

function DetailRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 px-5 py-3.5">
      <div className="flex items-start gap-2 w-28 flex-shrink-0 pt-0.5">
        <span className="text-warm-gray mt-0.5">{icon}</span>
        <span className="text-xs text-warm-gray uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
