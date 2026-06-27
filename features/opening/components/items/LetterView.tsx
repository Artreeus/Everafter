'use client'

import { motion } from 'framer-motion'

interface LetterViewProps {
  content:       string | null
  contentFormat: 'plain' | 'rich'
}

export function LetterView({ content, contentFormat }: LetterViewProps) {
  if (!content) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Paper */}
      <div
        className="relative bg-ivory rounded-2xl shadow-float px-8 py-10 overflow-hidden"
        style={{
          backgroundImage: `repeating-linear-gradient(
            transparent, transparent 31px,
            rgba(44,40,37,0.04) 31px, rgba(44,40,37,0.04) 32px
          )`,
          backgroundPositionY: '52px',
        }}
      >
        {/* Top margin line */}
        <div className="absolute left-16 top-0 bottom-0 w-px bg-rose/15" />

        <div className="relative pl-8">
          {contentFormat === 'rich' ? (
            <div
              className="letter-content font-sans text-charcoal leading-[2rem] text-[15px]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="font-sans text-charcoal leading-[2rem] text-[15px] whitespace-pre-wrap">
              {content}
            </p>
          )}
        </div>
      </div>

      <style>{`
        .letter-content p { margin: 0 0 2rem; }
        .letter-content p:last-child { margin-bottom: 0; }
        .letter-content strong { font-weight: 600; }
        .letter-content em { font-style: italic; }
        .letter-content ul { list-style: disc; padding-left: 1.5rem; margin: 0 0 2rem; }
        .letter-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0 0 2rem; }
        .letter-content li { margin-bottom: 0.5rem; }
      `}</style>
    </motion.div>
  )
}
