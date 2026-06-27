'use client'

import { motion } from 'framer-motion'
import { FadeIn, SlideIn } from '@/components/animations'
import { Flame, Clock, Mail } from 'lucide-react'

const steps = [
  {
    number: '01',
    Icon:   PenFlame,
    title:  'Create',
    description:
      'Write heartfelt letters, upload photos, record your voice, or capture a memory. Compose it exactly the way you feel it.',
    accent: 'text-gold',
    border: 'border-gold/20',
    bg:     'bg-gold/5',
  },
  {
    number: '02',
    Icon:   SealIcon,
    title:  'Seal',
    description:
      'Pick the perfect delivery date — an anniversary, a graduation, a birthday a decade from now. Then seal it with wax.',
    accent: 'text-rose',
    border: 'border-rose/20',
    bg:     'bg-rose/5',
  },
  {
    number: '03',
    Icon:   DeliverIcon,
    title:  'Deliver',
    description:
      'On that day, Everafter sends a beautiful opening experience your recipient will never forget.',
    accent: 'text-charcoal',
    border: 'border-stone',
    bg:     'bg-cream',
  },
]

function PenFlame() {
  return <Flame size={22} />
}
function SealIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="11" cy="11" r="9" />
      <circle cx="11" cy="11" r="5" />
      <line x1="11" y1="2" x2="11" y2="6" />
      <line x1="11" y1="16" x2="11" y2="20" />
      <line x1="2" y1="11" x2="6" y2="11" />
      <line x1="16" y1="11" x2="20" y2="11" />
    </svg>
  )
}
function DeliverIcon() {
  return <Mail size={22} />
}

export function HowItWorksSection() {
  return (
    <section className="py-28 md:py-36 px-6 bg-ivory">
      <div className="mx-auto max-w-5xl">

        {/* Section label */}
        <FadeIn inView className="text-center mb-16">
          <p className="text-xs font-sans tracking-[0.2em] uppercase text-warm-gray mb-4">
            How it works
          </p>
          <h2
            className="font-display font-light text-charcoal text-balance"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Three moments.
            <br />
            <span className="text-warm-gray">A lifetime of meaning.</span>
          </h2>
        </FadeIn>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <SlideIn key={step.number} inView delay={i * 0.12}>
              <div className={`rounded-2xl border ${step.border} ${step.bg} p-8 h-full flex flex-col`}>
                <div className={`mb-5 ${step.accent}`}>
                  <step.Icon />
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className={`font-display text-4xl font-light ${step.accent} opacity-40 leading-none`}>
                    {step.number}
                  </span>
                  <h3 className="font-display text-xl text-charcoal">{step.title}</h3>
                </div>
                <p className="font-sans text-sm text-charcoal/60 leading-relaxed flex-1">
                  {step.description}
                </p>
              </div>
            </SlideIn>
          ))}
        </div>

        {/* Connector line on desktop */}
        <FadeIn inView className="hidden md:flex items-center justify-center mt-10 gap-2">
          <div className="h-px flex-1 bg-stone/60" />
          <span className="text-xs text-warm-gray/50 font-sans px-4">
            From creation to delivery, we handle everything in between.
          </span>
          <div className="h-px flex-1 bg-stone/60" />
        </FadeIn>
      </div>
    </section>
  )
}
