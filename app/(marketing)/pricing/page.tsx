import type { Metadata }        from 'next'
import Link                      from 'next/link'
import { Check, X, Zap }        from 'lucide-react'
import { getSession }            from '@/lib/auth/session'
import { PLUS_MONTHLY_PRICE, PLUS_YEARLY_PRICE } from '@/lib/billing/plans'
import { PricingCTAs }           from '@/features/billing/components/PricingCTAs'
import { routes }                from '@/config/routes.config'
import { cn }                    from '@/lib/utils/cn'

export const metadata: Metadata = {
  title:       'Pricing — Everafter',
  description: 'Start for free. Upgrade to Plus for unlimited capsules, premium themes, and more.',
}

const FEATURES: { label: string; free: boolean | string; plus: boolean | string }[] = [
  { label: 'Time capsules',               free: 'Up to 3',       plus: 'Unlimited'        },
  { label: 'Recipients per capsule',      free: 'Up to 3',       plus: 'Up to 10'         },
  { label: 'Letters, photos, voice, memories', free: true,       plus: true               },
  { label: 'Wax seal & delivery experience',   free: true,       plus: true               },
  { label: 'Recipient replies',           free: true,            plus: true               },
  { label: 'Premium themes',              free: false,           plus: '8 themes'         },
  { label: 'Recurring delivery',          free: false,           plus: 'Monthly / Annually'},
  { label: 'Group capsules (contributors)', free: false,         plus: true               },
  { label: 'Priority support',            free: false,           plus: true               },
]

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === false)  return <X size={15} className="text-stone mx-auto" strokeWidth={2} />
  if (value === true)   return <Check size={15} className="text-gold mx-auto" strokeWidth={2.5} />
  return <span className="text-xs text-charcoal font-medium">{value}</span>
}

export default async function PricingPage() {
  const session = await getSession()
  const plan    = (session?.user as { plan?: string } | undefined)?.plan ?? null

  return (
    <div className="min-h-screen bg-ivory">

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-warm-gray mb-5">Pricing</p>
        <h1
          className="font-display font-light text-charcoal leading-tight mb-5"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
        >
          Simple, honest pricing.
        </h1>
        <p className="text-warm-gray font-sans leading-relaxed mx-auto" style={{ maxWidth: '28rem', fontSize: '1.05rem' }}>
          Start free, no credit card required.
          Upgrade when you need more.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-5">

          {/* Free */}
          <div className="rounded-2xl border border-stone/60 bg-white p-8 flex flex-col">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-warm-gray mb-3">Free</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-light text-charcoal">$0</span>
                <span className="text-sm text-warm-gray">/ forever</span>
              </div>
              <p className="text-xs text-warm-gray mt-2">No credit card required.</p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {FEATURES.map((f) => (
                <li key={f.label} className="flex items-center gap-3">
                  <span className="w-5 flex-shrink-0 flex justify-center">
                    <FeatureValue value={f.free} />
                  </span>
                  <span className={cn('text-sm', f.free === false ? 'text-warm-gray/50' : 'text-charcoal')}>
                    {f.free === false
                      ? f.label
                      : typeof f.free === 'string'
                        ? <><span className="font-medium">{f.free}</span> {f.label.toLowerCase()}</>
                        : f.label}
                  </span>
                </li>
              ))}
            </ul>

            <PricingCTAs plan={plan} tier="free" />
          </div>

          {/* Plus */}
          <div className="rounded-2xl border-2 border-charcoal bg-charcoal p-8 flex flex-col relative overflow-hidden">
            {/* Subtle glow */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,165,90,0.10) 0%, transparent 70%)' }}
            />

            <div className="relative mb-6">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs uppercase tracking-[0.18em] text-ivory/60">Plus</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5">
                  <Zap size={9} className="text-gold" />
                  <span className="text-[9px] font-medium text-gold uppercase tracking-wide">Popular</span>
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-light text-ivory">${PLUS_MONTHLY_PRICE}</span>
                <span className="text-sm text-ivory/50">/ month</span>
              </div>
              <p className="text-xs text-ivory/40 mt-1.5">
                or ${PLUS_YEARLY_PRICE}/year{' '}
                <span className="text-gold">— save {Math.round((1 - PLUS_YEARLY_PRICE / (PLUS_MONTHLY_PRICE * 12)) * 100)}%</span>
              </p>
            </div>

            <ul className="relative space-y-3 flex-1 mb-8">
              {FEATURES.map((f) => (
                <li key={f.label} className="flex items-center gap-3">
                  <span className="w-5 flex-shrink-0 flex justify-center">
                    {f.plus === false
                      ? <X size={15} className="text-ivory/20 mx-auto" strokeWidth={2} />
                      : f.plus === true
                        ? <Check size={15} className="text-gold mx-auto" strokeWidth={2.5} />
                        : null}
                    {typeof f.plus === 'string' && (
                      <Check size={15} className="text-gold mx-auto" strokeWidth={2.5} />
                    )}
                  </span>
                  <span className={cn('text-sm', f.plus === false ? 'text-ivory/25' : 'text-ivory/80')}>
                    {typeof f.plus === 'string'
                      ? <><span className="font-medium text-ivory">{f.plus}</span>{' '}{f.label.toLowerCase()}</>
                      : f.label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="relative">
              <PricingCTAs plan={plan} tier="plus" />
            </div>
          </div>
        </div>
      </div>

      {/* Guarantee */}
      <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="flex items-center gap-4 justify-center mb-5">
          <div className="h-px flex-1 bg-stone/40 max-w-24" />
          <span className="text-xs text-warm-gray/50 font-sans">
            Cancel any time &middot; No long-term contracts &middot; Data export always available
          </span>
          <div className="h-px flex-1 bg-stone/40 max-w-24" />
        </div>
      </div>
    </div>
  )
}
