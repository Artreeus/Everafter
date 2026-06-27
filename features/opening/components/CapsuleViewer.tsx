'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useRef }          from 'react'
import { ConfettiBurst }             from './ConfettiBurst'
import { ReplyForm }                 from './ReplyForm'
import { LetterView }                from './items/LetterView'
import { PhotoView }                 from './items/PhotoView'
import { VoiceView }                 from './items/VoiceView'
import { MemoryView }                from './items/MemoryView'
import type { SerializedOpenItem }   from '@/features/capsules/actions/track-open.action'

interface Slide {
  key:     string
  type:    'cover' | 'item'
  content: string | null
  item?:   SerializedOpenItem
}

interface CapsuleViewerProps {
  capsuleTitle: string
  theme:        string
  coverMessage: string | null
  authorName:   string
  items:        SerializedOpenItem[]
  isFirstOpen:  boolean
  allowReply:   boolean
  token:        string
}

const themeAccent: Record<string, string> = {
  classic:  '#C4A55A',
  floral:   '#C9A0A0',
  midnight: '#C4A55A',
  golden:   '#C4A55A',
}

export function CapsuleViewer({
  capsuleTitle,
  theme,
  coverMessage,
  authorName,
  items,
  isFirstOpen,
  allowReply,
  token,
}: CapsuleViewerProps) {
  const slides: Slide[] = [
    ...(coverMessage
      ? [{ key: 'cover', type: 'cover' as const, content: coverMessage }]
      : []),
    ...items.map((item) => ({
      key:  item.id,
      type: 'item' as const,
      content: null,
      item,
    })),
  ]

  const [idx, setIdx]       = useState(0)
  const [direction, setDir] = useState<1 | -1>(1)
  const touchStartX         = useRef<number | null>(null)

  const isLastSlide = idx === slides.length - 1

  const accent = themeAccent[theme] ?? '#C4A55A'

  function go(delta: 1 | -1) {
    const next = idx + delta
    if (next < 0 || next >= slides.length) return
    setDir(delta)
    setIdx(next)
  }

  const slide = slides[idx]
  if (!slide) return null

  const variants = {
    enter:   (d: number) => ({ opacity: 0, x: d * 60 }),
    center:  { opacity: 1, x: 0 },
    exit:    (d: number) => ({ opacity: 0, x: d * -60 }),
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-ivory"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1)
        touchStartX.current = null
      }}
    >
      {isFirstOpen && <ConfettiBurst />}

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="min-w-0">
          <p className="text-xs text-charcoal/40 font-sans uppercase tracking-wider mb-0.5">
            from {authorName}
          </p>
          <h1 className="text-sm font-medium text-charcoal truncate">{capsuleTitle}</h1>
        </div>

        {/* Progress dots */}
        {slides.length > 1 && (
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }}
                className="rounded-full transition-all duration-200"
                style={{
                  width:           i === idx ? 20 : 6,
                  height:          6,
                  backgroundColor: i === idx ? accent : '#E8E2D9',
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accent line */}
      <div className="h-px mx-6" style={{ backgroundColor: `${accent}30` }} />

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.key}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
            className="w-full max-w-2xl"
          >
            {slide.type === 'cover' && (
              <div className="text-center space-y-4 py-8">
                <p
                  className="text-charcoal/40 text-xs font-sans uppercase tracking-widest"
                >
                  A personal note
                </p>
                <p
                  className="text-charcoal text-xl font-light leading-relaxed italic max-w-md mx-auto"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {slide.content}
                </p>
              </div>
            )}

            {slide.type === 'item' && slide.item && (
              <>
                {slide.item.contributorName && (
                  <p className="text-center text-xs text-charcoal/40 font-sans mb-4 tracking-wider">
                    — from {slide.item.contributorName}
                  </p>
                )}
                <ItemRenderer item={slide.item} />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 pb-8">
        <button
          onClick={() => go(-1)}
          disabled={idx === 0}
          className="flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal
                     disabled:opacity-20 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-xs text-charcoal/30 font-sans">
          {idx + 1} / {slides.length}
        </span>

        {!isLastSlide ? (
          <button
            onClick={() => go(1)}
            className="flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-sm text-charcoal/30 italic font-sans">
            ✦ the end
          </div>
        )}
      </div>

      {/* Reply form — only on last slide if author enabled replies */}
      {isLastSlide && allowReply && (
        <div className="px-6 pb-10">
          <ReplyForm token={token} authorName={authorName} />
        </div>
      )}
    </div>
  )
}

function ItemRenderer({ item }: { item: SerializedOpenItem }) {
  switch (item.type) {
    case 'letter':
      return (
        <LetterView
          content={item.content}
          contentFormat={item.contentFormat}
        />
      )
    case 'photo':
      if (!item.mediaUrl) return null
      return <PhotoView url={item.mediaUrl} caption={item.caption} />
    case 'voice':
      if (!item.mediaUrl) return null
      return (
        <VoiceView
          url={item.mediaUrl}
          caption={item.caption}
          durationSeconds={item.durationSeconds}
        />
      )
    case 'memory':
      return <MemoryView content={item.content} caption={item.caption} />
    default:
      return null
  }
}
