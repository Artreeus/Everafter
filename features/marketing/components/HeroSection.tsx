'use client'

import Link            from 'next/link'
import { motion }      from 'framer-motion'
import { ArrowRight, Lock, PenLine, Image, Mic, BookOpen } from 'lucide-react'
import { routes }      from '@/config/routes.config'

const CONTENTS = [
  { Icon: PenLine, label: 'A letter'    },
  { Icon: Image,   label: '12 photos'   },
  { Icon: Mic,     label: 'Voice note'  },
  { Icon: BookOpen,label: 'A memory'    },
]

function fadeUp(delay: number) {
  return {
    initial:    { opacity: 0, y: 22 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease: 'easeOut' as const },
  }
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-charcoal overflow-hidden flex items-center">

      {/* ── Multi-layer atmosphere ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Warm golden bloom — capsule side */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 900px 700px at 72% 58%, rgba(196,165,90,0.12) 0%, transparent 65%)',
        }} />
        {/* Cool rose — headline side */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 700px 500px at 8% 55%, rgba(201,140,140,0.07) 0%, transparent 58%)',
        }} />
        {/* Top vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 100% 40% at 50% 0%, rgba(250,247,242,0.035) 0%, transparent 100%)',
        }} />
        {/* Subtle grain */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Top rule */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ originX: 0 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent"
      />

      {/* ── Main grid ── */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 lg:px-16 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: copy ── */}
          <div>
            {/* Ornament */}
            <motion.div {...fadeUp(0.15)} className="flex items-center gap-3 mb-10">
              <div className="h-px w-8 bg-gold/45" />
              <span className="text-[10px] text-gold/55 uppercase tracking-[0.22em] font-sans">
                Everafter
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.25)}
              className="font-display font-light text-ivory leading-[1.05] mb-7"
              style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)' }}
            >
              Write a letter<br />
              they&rsquo;ll open<br />
              <em className="not-italic text-[#D4A0A0]">in five years.</em>
            </motion.h1>

            {/* Body */}
            <motion.p
              {...fadeUp(0.38)}
              className="font-sans text-ivory/50 leading-[1.75] mb-10"
              style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)', maxWidth: '34rem' }}
            >
              Compose letters, add photos and voice notes, then pick a future date.
              Everafter seals it and delivers it exactly when you choose — an anniversary,
              a milestone, a moment you already know will matter.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.5)} className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href={routes.register}
                className="group inline-flex items-center gap-2.5 rounded-xl bg-ivory px-7 py-3.5 text-sm font-semibold text-charcoal transition-all duration-200 hover:bg-stone hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)]"
              >
                Create your first capsule
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={routes.login}
                className="text-sm text-ivory/45 hover:text-ivory/70 transition-colors duration-200 font-sans"
              >
                Sign in
              </Link>
            </motion.div>

            {/* Social proof line */}
            <motion.div {...fadeUp(0.62)} className="flex items-center gap-3">
              <div className="h-px w-4 bg-ivory/15" />
              <span className="text-xs text-ivory/25 font-sans">
                Free to start &middot; No credit card required
              </span>
            </motion.div>
          </div>

          {/* ── Right: capsule mockup ── */}
          <div className="relative flex justify-center lg:justify-end">

            {/* Ghost cards for depth */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 0.35, scale: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="absolute inset-0 rounded-[20px] rotate-[-5deg] translate-x-3 translate-y-4"
              style={{ background: '#EDE7DC', boxShadow: '0 30px 60px rgba(0,0,0,0.35)' }}
            />
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 0.55, scale: 1 }}
              transition={{ duration: 1, delay: 0.75 }}
              className="absolute inset-0 rounded-[20px] rotate-[-2.5deg] translate-x-1.5 translate-y-2"
              style={{ background: '#F0E9DF', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}
            />

            {/* Main capsule card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              className="relative w-full max-w-sm"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="relative rounded-[20px] p-8 select-none"
                style={{
                  background: '#F5EFE6',
                  border: '1px solid rgba(180,165,145,0.5)',
                  boxShadow: '0 50px 100px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)',
                }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-7">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#9B8B7B] font-sans">
                    Everafter · Sealed
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#9B8B7B] font-sans">
                    <Lock size={8} strokeWidth={2.5} />
                    Jun 2026
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-display font-light leading-snug mb-7 text-[#1E1814]"
                  style={{ fontSize: '1.5rem' }}
                >
                  To my daughter,<br />
                  on her<br />
                  <em style={{ fontStyle: 'italic', color: '#8B5E5E' }}>wedding day</em>
                </h3>

                {/* Rule */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-[#D4CAC0]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4A55A]" />
                  <div className="h-px flex-1 bg-[#D4CAC0]" />
                </div>

                {/* Contents */}
                <div className="space-y-2 mb-6">
                  {CONTENTS.map(({ Icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <Icon size={12} strokeWidth={1.75} className="text-[#9B8B7B]" />
                      <span className="text-xs text-[#6B5B4E] font-sans">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Open date badge */}
                <div
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{ background: '#EDE7DC', border: '1px solid rgba(180,165,145,0.3)' }}
                >
                  <span className="text-[10px] text-[#9B8B7B] font-sans uppercase tracking-wider">Opens</span>
                  <span className="text-sm font-sans font-medium text-[#1E1814]">September 14, 2031</span>
                </div>

                {/* Wax seal */}
                <div className="absolute -top-5 -right-5 drop-shadow-lg">
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Seal base */}
                    <circle cx="26" cy="26" r="24" fill="#B8953A" opacity="0.2" />
                    <circle cx="26" cy="26" r="22" fill="#C4A55A" />
                    <circle cx="26" cy="26" r="22" fill="url(#sealGrad)" />
                    {/* Inner ring */}
                    <circle cx="26" cy="26" r="17" stroke="#EDE7DC" strokeWidth="1.2" fill="none" opacity="0.7" />
                    {/* Letter */}
                    <text
                      x="26" y="32"
                      textAnchor="middle"
                      fontSize="16"
                      fontFamily="Georgia, serif"
                      fontStyle="italic"
                      fill="#EDE7DC"
                      opacity="0.95"
                    >
                      E
                    </text>
                    <defs>
                      <radialGradient id="sealGrad" cx="35%" cy="30%">
                        <stop offset="0%" stopColor="#D4B870" />
                        <stop offset="100%" stopColor="#A8893A" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom bleed */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
        style={{ background: 'linear-gradient(to bottom, transparent, #FAF7F2)' }}
      />
    </section>
  )
}
