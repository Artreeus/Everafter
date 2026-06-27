'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState }                from 'react'
import { CapsuleViewer }           from './CapsuleViewer'
import type { OpeningData }        from '@/features/capsules/actions/track-open.action'

type Phase = 'waiting' | 'opening' | 'reading'

const THEME_BG: Record<string, string> = {
  velvet: 'linear-gradient(160deg, #1C1228 0%, #0F0A18 100%)',
  ocean:  'linear-gradient(160deg, #0A2430 0%, #061520 100%)',
}
const DEFAULT_BG = 'linear-gradient(160deg, #2C2825 0%, #1A1714 100%)'

const THEME_GLOW: Record<string, string> = {
  sakura: 'rgba(212,120,154,0.14)',
  ocean:  'rgba(42,143,160,0.12)',
  ember:  'rgba(196,103,58,0.12)',
  velvet: 'rgba(139,92,246,0.12)',
}
const DEFAULT_GLOW = 'rgba(196,165,90,0.08)'

export function EnvelopeReveal({ data, token }: { data: OpeningData; token: string }) {
  const [phase, setPhase] = useState<Phase>('waiting')
  const theme = data.capsule.theme

  function handleOpen() {
    setPhase('opening')
    // After flap animation, cross-fade to reader
    setTimeout(() => setPhase('reading'), 1400)
  }

  const bgGradient = THEME_BG[theme] ?? DEFAULT_BG
  const glowColor  = THEME_GLOW[theme] ?? DEFAULT_GLOW

  return (
    <AnimatePresence mode="wait">
      {phase !== 'reading' ? (
        <motion.div
          key="envelope"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex flex-col items-center justify-center"
          style={{ background: bgGradient }}
        >
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(ellipse 600px 400px at 50% 40%, ${glowColor} 0%, transparent 70%)`,
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
            {/* From label */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs text-ivory/40 font-sans uppercase tracking-[0.2em]"
            >
              from {data.author.name}
            </motion.p>

            {/* Envelope */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
              style={{ width: 280, height: 196 }}
            >
              <EnvelopeSVG phase={phase} />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-1"
            >
              <h1
                className="text-ivory text-2xl font-light leading-snug"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {data.capsule.title}
              </h1>
              <p className="text-ivory/40 text-sm font-sans">
                for {data.recipient.name}
              </p>
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              onClick={handleOpen}
              disabled={phase === 'opening'}
              className="mt-2 px-8 py-3 rounded-full font-sans text-sm font-medium
                         bg-gold text-charcoal hover:bg-gold/90 transition-all
                         disabled:opacity-50 disabled:pointer-events-none
                         shadow-[0_0_24px_rgba(196,165,90,0.3)]"
            >
              {phase === 'opening' ? 'Opening…' : 'Open your capsule'}
            </motion.button>

            {/* Gold rule */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="flex items-center gap-3 opacity-30"
            >
              <div className="h-px w-12 bg-gold" />
              <div className="w-1 h-1 rounded-full bg-gold" />
              <div className="h-px w-12 bg-gold" />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <CapsuleViewer
            capsuleTitle={data.capsule.title}
            theme={data.capsule.theme}
            coverMessage={data.capsule.message}
            authorName={data.author.name}
            items={data.items}
            isFirstOpen={data.isFirstOpen}
            allowReply={data.capsule.allowReply}
            token={token}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function EnvelopeSVG({ phase }: { phase: Phase }) {
  const isOpening = phase === 'opening'

  return (
    <svg
      viewBox="0 0 280 196"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Envelope body */}
      <rect
        x="4" y="56" width="272" height="136"
        rx="12"
        fill="#EDE7DC"
        stroke="#B5A89A"
        strokeWidth="1.5"
      />

      {/* Bottom-left fold */}
      <path d="M4 192 L102 120" stroke="#B5A89A" strokeWidth="1" opacity="0.5" />
      {/* Bottom-right fold */}
      <path d="M276 192 L178 120" stroke="#B5A89A" strokeWidth="1" opacity="0.5" />

      {/* Flap — lifts (slides up + fades) when opening */}
      <motion.g
        animate={isOpening ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      >
        <path
          d="M4 64 L140 148 L276 64 L276 56 L4 56 Z"
          fill="#F5EFE6"
          stroke="#B5A89A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </motion.g>

      {/* Wax seal — dissolves when opening */}
      <motion.g
        animate={isOpening ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        style={{ transformOrigin: '140px 140px' }}
      >
        <circle cx="140" cy="140" r="20"  fill="#C4A55A" opacity="0.95" />
        <circle cx="140" cy="140" r="15"  stroke="#EDE7DC" strokeWidth="1.5" fill="none" />
        <text
          x="140" y="146"
          textAnchor="middle"
          fontSize="14"
          fill="#EDE7DC"
          fontFamily="Georgia, serif"
          fontStyle="italic"
        >
          E
        </text>
      </motion.g>

      {/* Letter paper — peeks out when opening */}
      <motion.rect
        x="36" y="64" width="208" height="120"
        rx="6"
        fill="#FAF7F2"
        stroke="#E8E2D9"
        strokeWidth="1"
        initial={{ y: 0, opacity: 0 }}
        animate={isOpening
          ? { y: -52, opacity: 1 }
          : { y: 0,   opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Letter lines — inside the paper */}
      {isOpening && [80, 88, 96, 104, 112].map((y) => (
        <motion.line
          key={y}
          x1="56" y1={y - 52} x2="224" y2={y - 52}
          stroke="#E8E2D9"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        />
      ))}
    </svg>
  )
}
