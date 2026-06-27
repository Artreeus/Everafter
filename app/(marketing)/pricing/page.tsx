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

const FAQS: { q: string; a: string }[] = [
  { q: 'What happens when I cancel Plus?',        a: 'You keep Plus features until the end of your billing period, then move to the free plan. Your existing capsules and their delivery dates are never affected.' },
  { q: 'Can a capsule be opened before its date?', a: 'No. Once sealed, a capsule is locked until the date you chose — it cannot be read early, not even by you. That is the whole point.' },
  { q: 'Do I need a credit card to start?',        a: 'No. The free plan lets you create and deliver capsules without any payment details. You only add a card if you choose to upgrade to Plus.' },
  { q: 'What do premium themes include?',          a: 'Plus unlocks four additional hand-crafted themes — Sakura, Ocean, Ember, and Velvet — on top of the four themes available to everyone.' },
  { q: 'Is my content private?',                   a: 'Always. We never read, sell, or share the contents of your capsules. They are delivered only to the recipients you choose, on the date you set.' },
  { q: 'Can I change my plan later?',              a: 'Yes. You can upgrade, downgrade, or cancel at any time from your billing settings. Changes take effect at the start of your next billing period.' },
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

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <span className="text-[10px] text-warm-gray uppercase tracking-[0.22em] font-sans">Questions</span>
          <h2 className="mt-3 font-display font-light text-charcoal" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
            Good to know
          </h2>
        </div>

        <div className="divide-y divide-stone/60 border-y border-stone/60">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                <span className="font-sans text-[15px] font-medium text-charcoal">{faq.q}</span>
                <span className="flex-shrink-0 text-warm-gray transition-transform duration-200 group-open:rotate-45">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <line x1="8" y1="3" x2="8" y2="13" />
                    <line x1="3" y1="8" x2="13" y2="8" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 pr-8 font-sans text-sm text-charcoal/60 leading-[1.7]">{faq.a}</p>
            </details>
          ))}
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
