'use client'

import { motion }              from 'framer-motion'
import { PenLine, Flame, Send } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    Icon:   PenLine,
    title:  'Compose',
    body:   'Write the letter. Add photos, record your voice, pin a memory. Build it slowly, the way the moment deserves — there is no rush.',
  },
  {
    number: '02',
    Icon:   Flame,
    title:  'Seal',
    body:   'Choose the day it opens — a birthday a decade out, an anniversary, a graduation. Press the wax seal and it locks until then.',
  },
  {
    number: '03',
    Icon:   Send,
    title:  'Deliver',
    body:   'When the day arrives, Everafter delivers it as an unhurried, cinematic reveal your person will never forget.',
  },
]

const fade = {
  hidden:  { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.13, ease: 'easeOut' as const },
  }),
}

export function HowItWorksSection() {
  return (
    <section className="relative py-28 md:py-36 px-6 bg-ivory overflow-hidden">
      {/* faint warm wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(196,165,90,0.06) 0%, transparent 60%)',
      }} />

      <div className="relative mx-auto max-w-6xl">
        {/* heading */}
        <motion.div
          variants={fade} custom={0}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-gold/45" />
            <span className="text-[10px] text-warm-gray uppercase tracking-[0.22em] font-sans">How it works</span>
            <div className="h-px w-8 bg-gold/45" />
          </div>
          <h2 className="font-display font-light text-charcoal text-balance" style={{ fontSize: 'clamp(2rem, 4.2vw, 3.1rem)' }}>
            Three moments.<br />
            <span className="text-warm-gray">A lifetime between them.</span>
          </h2>
        </motion.div>

        {/* steps with connecting line */}
        <div className="relative">
          {/* desktop connector */}
          <div aria-hidden className="hidden md:block absolute top-[2.15rem] left-[16%] right-[16%] h-px">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-stone to-transparent" />
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fade} custom={i + 1}
                initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
                className="relative flex flex-col items-center text-center"
              >
                {/* node */}
                <div className="relative mb-7">
                  <div className="flex h-[4.3rem] w-[4.3rem] items-center justify-center rounded-full bg-ivory border border-stone shadow-soft">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-ivory">
                      <step.Icon size={19} strokeWidth={1.6} />
                    </div>
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-charcoal font-sans shadow-soft">
                    {step.number.replace('0', '')}
                  </span>
                </div>

                <h3 className="font-display text-xl text-charcoal mb-3">{step.title}</h3>
                <p className="font-sans text-sm text-charcoal/55 leading-[1.7] max-w-[17rem]">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
