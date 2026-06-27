'use client'

import Link                      from 'next/link'
import { useTransition }         from 'react'
import { ArrowRight, Zap, Check } from 'lucide-react'
import { createCheckoutAction }  from '@/features/billing/actions/create-checkout.action'
import { routes }                from '@/config/routes.config'
import { cn }                    from '@/lib/utils/cn'

interface PricingCTAsProps {
  plan: string | null   // null = not logged in; 'free' | 'plus'
  tier: 'free' | 'plus'
}

export function PricingCTAs({ plan, tier }: PricingCTAsProps) {
  const [pending, startTransition] = useTransition()

  const isCurrentPlan = (tier === 'free' && plan === 'free') || (tier === 'plus' && plan === 'plus')

  if (isCurrentPlan) {
    return (
      <div className={cn(
        'flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-medium border',
        tier === 'plus'
          ? 'border-ivory/20 text-ivory/50'
          : 'border-stone/60 text-warm-gray',
      )}>
        <Check size={13} />
        Your current plan
      </div>
    )
  }

  // Guest or logged-out
  if (!plan) {
    if (tier === 'free') {
      return (
        <Link
          href={routes.register}
          className="flex items-center justify-center gap-2 w-full rounded-xl border border-stone/60 py-3 text-sm font-medium text-charcoal hover:border-warm-gray/50 transition-colors"
        >
          Start for free
          <ArrowRight size={13} />
        </Link>
      )
    }
    return (
      <Link
        href={routes.register}
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-gold py-3 text-sm font-semibold text-charcoal hover:bg-gold/90 transition-colors"
      >
        <Zap size={13} />
        Get Plus
      </Link>
    )
  }

  // Free user looking at Plus
  if (tier === 'plus' && plan === 'free') {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => createCheckoutAction('monthly'))}
          className={cn(
            'flex items-center justify-center gap-2 w-full rounded-xl bg-gold py-3 text-sm font-semibold text-charcoal transition-colors',
            pending ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gold/90',
          )}
        >
          <Zap size={13} />
          {pending ? 'Redirecting…' : 'Upgrade to Plus — $8/mo'}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => createCheckoutAction('yearly'))}
          className="w-full text-xs text-ivory/50 hover:text-ivory/70 transition-colors py-1"
        >
          or $60/year (save 37%)
        </button>
      </div>
    )
  }

  // Plus user looking at Free — nothing to do
  return (
    <Link
      href={routes.dashboard}
      className="flex items-center justify-center gap-2 w-full rounded-xl border border-stone/60 py-3 text-sm font-medium text-warm-gray hover:text-charcoal transition-colors"
    >
      Go to dashboard
    </Link>
  )
}
