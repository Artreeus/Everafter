'use client'

import { motion } from 'framer-motion'

interface MemoryViewProps {
  content: string | null
  caption: string | null
}

export function MemoryView({ content, caption }: MemoryViewProps) {
  if (!content) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="relative bg-ivory rounded-2xl shadow-float px-10 py-12 text-center">
        {/* Decorative open-quote */}
        <div
          aria-hidden
          className="absolute top-6 left-8 text-rose/30 select-none"
          style={{ fontFamily: 'Georgia, serif', fontSize: '72px', lineHeight: 1 }}
        >
          &ldquo;
        </div>

        <p
          className="relative z-10 text-charcoal text-lg font-light leading-relaxed italic"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {content}
        </p>

        {caption && (
          <p className="mt-6 text-sm text-charcoal/50 font-sans not-italic">
            — {caption}
          </p>
        )}

        {/* Decorative gold line */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gold/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
          <div className="h-px w-12 bg-gold/40" />
        </div>
      </div>
    </motion.div>
  )
}
