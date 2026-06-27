'use client'

import { motion } from 'framer-motion'

interface WaxSealAnimationProps {
  play?: boolean
  size?: number
}

export function WaxSealAnimation({ play = false, size = 120 }: WaxSealAnimationProps) {
  return (
    <div style={{ width: size, height: size }} className="relative mx-auto">
      {/* Wax circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={play ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ width: size, height: size }}
        className="absolute inset-0 rounded-full bg-rose"
      >
        {/* Texture overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        {/* Drip effects */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={play ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
          style={{ originY: 0 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-5 rounded-b-full bg-rose"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={play ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.3, delay: 0.6, ease: 'easeOut' }}
          style={{ originY: 0 }}
          className="absolute -bottom-1 left-1/3 -translate-x-1/2 w-2 h-3 rounded-b-full bg-rose"
        />
      </motion.div>

      {/* Stamp impression */}
      <motion.div
        initial={{ scale: 2, opacity: 0 }}
        animate={play ? { scale: 1, opacity: 1 } : { scale: 2, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        style={{ width: size, height: size }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Seal monogram */}
        <svg
          width={size * 0.52}
          height={size * 0.52}
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer ring */}
          <circle cx="26" cy="26" r="24" stroke="rgba(250,247,242,0.6)" strokeWidth="1.5" />
          {/* Inner circle */}
          <circle cx="26" cy="26" r="18" stroke="rgba(250,247,242,0.4)" strokeWidth="1" />
          {/* E letterform — stylised */}
          <path
            d="M19 19h14M19 26h11M19 33h14"
            stroke="rgba(250,247,242,0.9)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Shimmer on land */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={play ? { opacity: [0, 0.6, 0] } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        style={{ width: size, height: size }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent"
      />
    </div>
  )
}
