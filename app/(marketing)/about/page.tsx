import type { Metadata } from 'next'
import Link               from 'next/link'
import { PageHero }        from '@/features/marketing/components/PageHero'
import { ClosingSection }  from '@/features/marketing/components/ClosingSection'
import { routes }          from '@/config/routes.config'
import { Heart, Clock, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title:       'About — Everafter',
  description: 'Why we built Everafter: a quieter place for the words that deserve the perfect moment.',
}

const VALUES = [
  { Icon: Heart, title: 'Built for feeling', body: 'Every detail — the wax seal, the unhurried reveal, the typography — exists to make a small moment feel momentous.' },
  { Icon: Clock, title: 'Patient by nature', body: 'We are one of the few products designed to be opened years after you use it. We take that responsibility seriously.' },
  { Icon: Lock,  title: 'Yours alone',       body: 'Your capsules are private until the day you choose. We protect them, and we never read them.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={<>Some words deserve<br />the perfect moment.</>}
        subtitle="Everafter is a quieter place on the internet — made for the letters, the voices and the memories you want to send forward in time."
      />

      {/* story */}
      <section className="py-28 md:py-32 px-6 bg-ivory">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-7 font-sans text-charcoal/70 leading-[1.85]" style={{ fontSize: '1.075rem' }}>
            <p className="font-display font-light text-charcoal" style={{ fontSize: '1.5rem', lineHeight: 1.5 }}>
              We kept meaning to say things — and kept waiting for the right time.
            </p>
            <p>
              A letter for a daughter&rsquo;s wedding. A voice note for a parent who won&rsquo;t always
              be a phone call away. A message to our future selves, written on a night that felt
              like it mattered. The words were there. The moment never quite was.
            </p>
            <p>
              So we built Everafter — a way to write those things down now and trust them to arrive
              exactly when they should. You compose a capsule, seal it with wax, and choose a future
              date. We hold it, untouched, until that day comes. Then we deliver it as something
              worth opening slowly.
            </p>
            <p>
              It is a small idea, really. But the moments it&rsquo;s made for are not small at all.
            </p>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="py-24 md:py-28 px-6 bg-cream">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-[10px] text-warm-gray uppercase tracking-[0.22em] font-sans">What we believe</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-stone/70 bg-ivory p-8 text-center flex flex-col items-center">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-ivory">
                  <v.Icon size={18} strokeWidth={1.6} />
                </div>
                <h3 className="font-display text-lg text-charcoal mb-2.5">{v.title}</h3>
                <p className="font-sans text-[13px] text-charcoal/55 leading-[1.7]">{v.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={routes.howItWorks}
              className="text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors underline underline-offset-4 decoration-stone"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <ClosingSection />
    </>
  )
}
