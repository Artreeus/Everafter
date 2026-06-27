'use client'

import Link        from 'next/link'
import { motion }  from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { routes }  from '@/config/routes.config'

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' as const },
  }),
}

export function ClosingSection() {
  return (
    <section className="relative py-32 md:py-44 px-6 bg-ivory overflow-hidden">
      {/* ambient gold + rose glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 55% at 50% 45%, rgba(196,165,90,0.10) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 90%, rgba(201,160,160,0.07) 0%, transparent 70%)',
        }} />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* wax seal mark */}
        <motion.div
          variants={fade} custom={0}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="flex justify-center mb-9"
        >
          <svg width="56" height="56" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
            <circle cx="26" cy="26" r="24" fill="#B8953A" opacity="0.18" />
            <circle cx="26" cy="26" r="22" fill="#C4A55A" />
            <circle cx="26" cy="26" r="22" fill="url(#closeSeal)" />
            <circle cx="26" cy="26" r="17" stroke="#FAF7F2" strokeWidth="1.2" fill="none" opacity="0.7" />
            <text x="26" y="32" textAnchor="middle" fontSize="16" fontFamily="Georgia, serif" fontStyle="italic" fill="#FAF7F2" opacity="0.95">E</text>
            <defs>
              <radialGradient id="closeSeal" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#D4B870" />
                <stop offset="100%" stopColor="#A8893A" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.p
          variants={fade} custom={1}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="text-[10px] font-sans tracking-[0.22em] uppercase text-warm-gray mb-6"
        >
          Begin
        </motion.p>

        <motion.h2
          variants={fade} custom={2}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="font-display font-light text-charcoal text-balance mb-6"
          style={{ fontSize: 'clamp(2.1rem, 5vw, 3.4rem)' }}
        >
          The words you mean to say.<br />
          <span className="text-rose italic">Say them now.</span>
        </motion.h2>

        <motion.p
          variants={fade} custom={3}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="font-sans text-charcoal/50 leading-[1.75] mb-11 text-base mx-auto max-w-md"
        >
          Some moments only come once. Write to them now — and let Everafter hold it
          until the day it will mean the most.
        </motion.p>

        <motion.div
          variants={fade} custom={4}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col items-center gap-5"
        >
          <Link
            href={routes.register}
            className="group inline-flex items-center gap-2.5 rounded-xl bg-charcoal px-8 py-4 text-sm font-semibold text-ivory transition-all duration-200 hover:bg-dark hover:shadow-float"
          >
            Create your first capsule — it&rsquo;s free
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <p className="text-xs text-warm-gray/60 font-sans">
            No credit card required &middot; Free forever for the basics
          </p>
        </motion.div>
      </div>
    </section>
  )
}
