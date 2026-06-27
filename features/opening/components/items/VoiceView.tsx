'use client'

import { motion }             from 'framer-motion'
import { Mic, Play, Pause }  from 'lucide-react'
import { useRef, useState }  from 'react'

interface VoiceViewProps {
  url:             string
  caption:         string | null
  durationSeconds: number | null
}

export function VoiceView({ url, caption, durationSeconds }: VoiceViewProps) {
  const audioRef  = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  function toggle() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  function onTimeUpdate() {
    const el = audioRef.current
    if (!el || !el.duration) return
    setProgress(el.currentTime / el.duration)
  }

  function onEnded() {
    setPlaying(false)
    setProgress(0)
    if (audioRef.current) audioRef.current.currentTime = 0
  }

  const formattedDuration = durationSeconds
    ? `${Math.floor(durationSeconds / 60)}:${String(Math.round(durationSeconds % 60)).padStart(2, '0')}`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-charcoal rounded-2xl px-8 py-10 shadow-float text-center space-y-6">
        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
            <Mic className="w-6 h-6 text-gold" />
          </div>
        </div>

        {/* Waveform visual */}
        <div className="flex items-center justify-center gap-0.5 h-10">
          {Array.from({ length: 32 }, (_, i) => {
            const filled   = progress * 32 > i
            const barH     = [4, 7, 12, 18, 14, 9, 16, 22, 18, 12, 8, 20, 28, 22, 16, 30,
                               28, 20, 14, 26, 20, 12, 18, 24, 16, 10, 14, 20, 16, 10, 6, 4][i]
            return (
              <div
                key={i}
                className="w-1 rounded-full transition-colors duration-150"
                style={{
                  height: `${barH}px`,
                  backgroundColor: filled ? '#C4A55A' : 'rgba(250,247,242,0.2)',
                }}
              />
            )
          })}
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-1 bg-ivory/10 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect()
            const pct  = (e.clientX - rect.left) / rect.width
            if (audioRef.current) {
              audioRef.current.currentTime = pct * (audioRef.current.duration || 0)
            }
          }}
        >
          <div
            className="h-full bg-gold rounded-full transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between text-xs text-ivory/40 font-sans">
          <span>
            {audioRef.current
              ? formatSeconds(audioRef.current.currentTime)
              : '0:00'}
          </span>

          <button
            onClick={toggle}
            className="w-12 h-12 rounded-full bg-gold flex items-center justify-center
                       hover:bg-gold/90 transition-colors"
          >
            {playing
              ? <Pause className="w-5 h-5 text-charcoal fill-charcoal" />
              : <Play  className="w-5 h-5 text-charcoal fill-charcoal ml-0.5" />}
          </button>

          <span>{formattedDuration ?? '--:--'}</span>
        </div>

        {caption && (
          <p className="text-xs text-ivory/50 italic font-sans">{caption}</p>
        )}
      </div>

      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        preload="metadata"
      />
    </motion.div>
  )
}

function formatSeconds(s: number) {
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${String(r).padStart(2, '0')}`
}
