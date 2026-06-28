import Link from 'next/link'
import { PenLine, Flame, Send, ArrowRight, Sparkles } from 'lucide-react'
import { routes } from '@/config/routes.config'

const STEPS = [
  { Icon: PenLine, title: 'Compose', body: 'Write a letter, add photos, record your voice.' },
  { Icon: Flame,   title: 'Seal',    body: 'Pick a future date and lock it with wax.' },
  { Icon: Send,    title: 'Deliver', body: 'We deliver it, to the day, years from now.' },
]

const IDEAS = [
  'A letter for a future birthday',
  'A message to your future self',
  'Photos for an anniversary',
  'Advice for a graduation day',
]

export function OnboardingEmptyState() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-stone/60 bg-cream">
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 70% at 50% 0%, rgba(196,165,90,0.10) 0%, transparent 65%)',
      }} />

      <div className="relative px-6 py-14 sm:py-20 text-center">
        {/* seal mark */}
        <div className="flex justify-center mb-7">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
            <circle cx="26" cy="26" r="24" fill="#B8953A" opacity="0.18" />
            <circle cx="26" cy="26" r="22" fill="#C4A55A" />
            <circle cx="26" cy="26" r="22" fill="url(#obSeal)" />
            <circle cx="26" cy="26" r="17" stroke="#FAF7F2" strokeWidth="1.2" fill="none" opacity="0.7" />
            <text x="26" y="32" textAnchor="middle" fontSize="16" fontFamily="Georgia, serif" fontStyle="italic" fill="#FAF7F2" opacity="0.95">E</text>
            <defs>
              <radialGradient id="obSeal" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#D4B870" />
                <stop offset="100%" stopColor="#A8893A" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <h2 className="font-display font-light text-charcoal mb-3" style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)' }}>
          Your first capsule starts here.
        </h2>
        <p className="font-sans text-sm text-charcoal/55 leading-relaxed max-w-md mx-auto mb-10">
          Write something worth keeping, seal it, and choose the day it opens.
          Everafter holds it safe until that moment arrives.
        </p>

        {/* steps */}
        <div className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10 text-left">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-stone/60 bg-ivory p-5">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal text-ivory">
                  <s.Icon size={15} strokeWidth={1.7} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-warm-gray/60 font-sans tabular-nums">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="font-display text-base text-charcoal mb-1">{s.title}</h3>
              <p className="font-sans text-xs text-charcoal/55 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {/* primary CTA */}
        <Link
          href={routes.capsuleNew}
          className="group inline-flex items-center gap-2.5 rounded-xl bg-charcoal px-7 py-3.5 text-sm font-semibold text-ivory transition-all duration-200 hover:bg-dark hover:shadow-float"
        >
          Create your first capsule
          <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>

        {/* inspiration chips */}
        <div className="mt-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={12} className="text-gold" />
            <span className="text-[10px] uppercase tracking-[0.18em] text-warm-gray/60 font-sans">Need an idea?</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
            {IDEAS.map((idea) => (
              <Link
                key={idea}
                href={routes.capsuleNew}
                className="rounded-full border border-stone/60 bg-ivory px-3.5 py-1.5 text-xs text-charcoal/65 hover:text-charcoal hover:border-gold/40 transition-colors"
              >
                {idea}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
