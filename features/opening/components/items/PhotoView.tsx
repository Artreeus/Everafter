'use client'

import { motion } from 'framer-motion'
import Image      from 'next/image'

interface PhotoViewProps {
  url:     string
  caption: string | null
}

export function PhotoView({ url, caption }: PhotoViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto space-y-4"
    >
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-float bg-stone/30">
        <Image
          src={url}
          alt={caption ?? 'A memory'}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 600px"
        />
      </div>
      {caption && (
        <p className="text-center text-sm text-charcoal/60 italic font-sans px-4">
          {caption}
        </p>
      )}
    </motion.div>
  )
}
