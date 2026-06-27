import type { Metadata } from 'next'
import { PageHero }         from '@/features/marketing/components/PageHero'
import { HowItWorksSection } from '@/features/marketing/components/HowItWorksSection'
import { FeaturesSection }  from '@/features/marketing/components/FeaturesSection'
import { ClosingSection }   from '@/features/marketing/components/ClosingSection'
import { Clock, Shield, Bell, Users } from 'lucide-react'

export const metadata: Metadata = {
  title:       'How it works — Everafter',
  description: 'From the first word to the day it opens — see how Everafter seals and delivers your time capsules.',
}

const DETAILS = [
  { Icon: Clock,  title: 'Delivered to the day',  body: 'Pick any future date. We hold the capsule sealed and deliver it the moment it arrives — not a day early, not a day late.' },
  { Icon: Shield, title: 'Locked until then',     body: 'Once sealed, a capsule cannot be read — not even by you. The wax stays on until the date you chose.' },
  { Icon: Bell,   title: 'Everyone is notified',  body: 'Recipients get a beautiful email the day their capsule unlocks, with a private link to open it.' },
  { Icon: Users,  title: 'Open it together',      body: 'Invite contributors to add their own letters and photos before you seal — a shared keepsake from many hands.' },
]

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={<>Sealed today.<br />Delivered when it matters.</>}
        subtitle="Everafter turns the things you mean to say into a keepsake that opens at exactly the right moment — years from now, to the day."
      />

      <HowItWorksSection />
      <FeaturesSection />

      {/* details */}
      <section className="py-28 md:py-32 px-6 bg-ivory">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-[10px] text-warm-gray uppercase tracking-[0.22em] font-sans">The details</span>
            <h2 className="mt-4 font-display font-light text-charcoal text-balance" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
              Quietly dependable, by design.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {DETAILS.map((d) => (
              <div key={d.title} className="flex gap-5 rounded-2xl border border-stone/70 bg-cream p-7">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-charcoal text-ivory">
                  <d.Icon size={18} strokeWidth={1.6} />
                </div>
                <div>
                  <h3 className="font-display text-lg text-charcoal mb-1.5">{d.title}</h3>
                  <p className="font-sans text-[13px] text-charcoal/55 leading-[1.65]">{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosingSection />
    </>
  )
}
