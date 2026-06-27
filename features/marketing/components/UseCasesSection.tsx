'use client'

import { FadeIn, SlideIn } from '@/components/animations'

const cases = [
  {
    quote: 'A letter to my daughter for her wedding day — written the year she was born.',
    tag:   'Future milestone',
  },
  {
    quote: 'Voice messages from grandpa, scheduled to arrive on every birthday for the next 20 years.',
    tag:   'Legacy',
  },
  {
    quote: 'A surprise capsule for our 10th anniversary — photos from our first trip together.',
    tag:   'Anniversary',
  },
  {
    quote: 'Advice to my team, to be opened the day I retire.',
    tag:   'Farewell',
  },
]

export function UseCasesSection() {
  return (
    <section className="py-24 md:py-32 px-6 bg-charcoal overflow-hidden">
      <div className="mx-auto max-w-5xl">

        <FadeIn inView className="text-center mb-14">
          <p className="text-xs font-sans tracking-[0.2em] uppercase text-ivory/30 mb-4">
            What people create
          </p>
          <h2
            className="font-display font-light text-ivory text-balance"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
          >
            Every capsule is a small act of love.
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-4">
          {cases.map((c, i) => (
            <SlideIn key={i} inView delay={i * 0.08}>
              <div className="rounded-2xl border border-ivory/8 bg-ivory/4 p-7 h-full flex flex-col justify-between gap-6">
                <p className="font-display font-light text-ivory/75 leading-relaxed text-lg">
                  &ldquo;{c.quote}&rdquo;
                </p>
                <span className="inline-flex self-start items-center rounded-full border border-ivory/12 bg-ivory/6 px-3 py-1 text-[11px] text-ivory/40 font-sans tracking-wider uppercase">
                  {c.tag}
                </span>
              </div>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  )
}
