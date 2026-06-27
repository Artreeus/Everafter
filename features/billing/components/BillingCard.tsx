'use client'

import { useTransition } from 'react'
import { Check, Zap }    from 'lucide-react'
import { cn }            from '@/lib/utils/cn'
import { toast }         from 'sonner'
import { createCheckoutAction } from '@/features/billing/actions/create-checkout.action'
import { manageBillingAction }  from '@/features/billing/actions/manage-billing.action'
import {
  PLUS_MONTHLY_PRICE, PLUS_YEARLY_PRICE,
  PLAN_LIMITS,
} from '@/lib/billing/plans'

const PLUS_FEATURES = [
  'Unlimited capsules',
  'Up to 10 recipients',
  'Group contributor invites',
  'Recurring delivery (monthly/annually)',
  'Priority email delivery',
]

const FREE_FEATURES = [
  `Up to ${PLAN_LIMITS.free.maxCapsules} capsules`,
  `Up to ${PLAN_LIMITS.free.maxRecipients} recipients`,
  'All 4 themes',
  'Recipient replies',
  'Beautiful opening experience',
]

interface BillingCardProps {
  plan:       'free' | 'plus'
  expiresAt:  string | null
  upgraded?:  boolean
}

export function BillingCard({ plan, expiresAt, upgraded }: BillingCardProps) {
  const [isPending, startTransition] = useTransition()
  const isPlus = plan === 'plus'

  const handleCheckout = (interval: 'monthly' | 'yearly') => {
    startTransition(async () => {
      try {
        await createCheckoutAction(interval)
      } catch {
        toast.error('Something went wrong. Please try again.')
      }
    })
  }

  const handleManage = () => {
    startTransition(async () => {
      try {
        await manageBillingAction()
      } catch {
        toast.error('Could not open billing portal.')
      }
    })
  }

  return (
    <div className="space-y-6">
      {upgraded && (
        <div className="rounded-xl border border-gold/40 bg-gold/5 px-5 py-3.5 flex items-center gap-3">
          <Zap size={15} className="text-gold flex-shrink-0" />
          <p className="text-sm text-charcoal">
            Welcome to Plus! All features are now unlocked.
          </p>
        </div>
      )}

      {/* Current plan */}
      <div className={cn(
        'rounded-xl border p-5',
        isPlus ? 'border-gold/30 bg-gold/5' : 'border-stone/50 bg-cream',
      )}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-warm-gray mb-1">Current plan</p>
            <p className="font-display text-xl font-light text-charcoal">
              {isPlus ? 'Everafter Plus' : 'Free'}
            </p>
          </div>
          {isPlus && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 text-gold px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider">
              <Zap size={9} />
              Plus
            </span>
          )}
        </div>

        <ul className="space-y-2 mb-5">
          {(isPlus ? PLUS_FEATURES : FREE_FEATURES).map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-warm-gray">
              <Check size={12} className={isPlus ? 'text-gold' : 'text-warm-gray'} />
              {f}
            </li>
          ))}
        </ul>

        {isPlus && expiresAt && (
          <p className="text-xs text-warm-gray mb-4">
            Renews {new Date(expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}

        {isPlus ? (
          <button
            type="button"
            onClick={handleManage}
            disabled={isPending}
            className="w-full rounded-xl border border-stone px-4 py-2.5 text-sm text-warm-gray hover:text-charcoal hover:border-warm-gray/50 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Opening portal…' : 'Manage subscription'}
          </button>
        ) : (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleCheckout('monthly')}
              disabled={isPending}
              className="w-full rounded-xl bg-charcoal px-4 py-2.5 text-sm font-medium text-ivory hover:bg-dark transition-colors disabled:opacity-50"
            >
              {isPending ? 'Redirecting…' : `Upgrade — $${PLUS_MONTHLY_PRICE}/month`}
            </button>
            <button
              type="button"
              onClick={() => handleCheckout('yearly')}
              disabled={isPending}
              className="w-full rounded-xl border border-stone px-4 py-2.5 text-sm text-warm-gray hover:text-charcoal hover:border-warm-gray/50 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Redirecting…' : `Annual — $${PLUS_YEARLY_PRICE}/year (save $${(PLUS_MONTHLY_PRICE * 12) - PLUS_YEARLY_PRICE})`}
            </button>
          </div>
        )}
      </div>

      {!isPlus && (
        <div className="rounded-xl border border-stone/40 bg-white p-5">
          <p className="text-xs font-medium text-charcoal mb-3 uppercase tracking-wider">Plus includes</p>
          <ul className="space-y-2">
            {PLUS_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-warm-gray">
                <Check size={12} className="text-gold flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
