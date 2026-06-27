'use client'

import { motion } from 'framer-motion'

const CASES = [
  {
    quote: 'A letter to my daughter for her wedding day — written the year she was born.',
    author: 'For a future milestone',
    span: 'lg:col-span-3',
    accent: '#D4A0A0',
  },
  {
    quote: 'Voice notes from grandpa, set to arrive on every birthday for the next twenty years.',
    author: 'A living legacy',
    span: 'lg:col-span-3',
    accent: '#C4A55A',
  },
  {
    quote: 'A surprise capsule for our tenth anniversary — photos from the very first trip we took together.',
    author: 'An anniversary',
    span: 'lg:col-span-2',
    accent: '#C9A0A0',
  },
  {
    quote: 'Advice to my team, sealed to open the day I finally retire.',
    author: 'A farewell',
    span: 'lg:col-span-2',
    accent: '#A0B8C4',
  },
  {
    quote: 'A note to myself at forty, written at thirty, when I had no idea what was coming.',
    author: 'A letter forward',
    span: 'lg:col-span-2',
    accent: '#B8A0C4',
  },
]

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.07, ease: 'easeOut' as const },
  }),
}

export function UseCasesSection() {
  return (
    <section className="relative py-28 md:py-36 px-6 bg-charcoal overflow-hidden">
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(196,165,90,0.08) 0%, transparent 60%)',
      }} />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          variants={fade} custom={0}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-gold/40" />
            <span className="text-[10px] text-ivory/35 uppercase tracking-[0.22em] font-sans">What people create</span>
            <div className="h-px w-8 bg-gold/40" />
          </div>
          <h2 className="font-display font-light text-ivory text-balance" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.9rem)' }}>
            Every capsule is a small act of love.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-6 gap-4">
          {CASES.map((c, i) => (
            <motion.figure
              key={i}
              variants={fade} custom={i + 1}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
              className={`${c.span} group relative flex flex-col justify-between gap-7 rounded-2xl border border-ivory/10 bg-ivory/[0.04] p-8 transition-colors duration-300 hover:bg-ivory/[0.06] hover:border-ivory/20`}
            >
              {/* quote mark */}
              <span
                className="font-display leading-none select-none"
                style={{ fontSize: '3rem', color: c.accent, opacity: 0.35 }}
                aria-hidden
              >
                &ldquo;
              </span>
              <blockquote className="font-display font-light text-ivory/80 leading-[1.5] -mt-6" style={{ fontSize: '1.18rem' }}>
                {c.quote}
              </blockquote>
              <figcaption className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.accent }} />
                <span className="text-[11px] text-ivory/40 font-sans tracking-wider uppercase">{c.author}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
