'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Mic, Square, Play, Pause, Trash2, Upload } from 'lucide-react'
import { getCloudinarySignatureAction } from '@/features/media/actions/upload-media.action'
import { cn } from '@/lib/utils/cn'
import type { MediaPayload } from '@/types/capsule.types'

interface VoiceRecorderProps {
  onUpload:     (media: MediaPayload) => void
  className?:   string
  getSignature?: () => Promise<import('@/features/media/actions/upload-media.action').CloudinarySignature>
}

type RecorderState = 'idle' | 'recording' | 'recorded' | 'uploading' | 'done'

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function VoiceRecorder({ onUpload, className, getSignature }: VoiceRecorderProps) {
  const [recState,    setRecState]   = useState<RecorderState>('idle')
  const [seconds,     setSeconds]    = useState(0)
  const [audioUrl,    setAudioUrl]   = useState<string | null>(null)
  const [isPlaying,   setIsPlaying]  = useState(false)
  const [error,       setError]      = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef        = useRef<Blob[]>([])
  const blobRef          = useRef<Blob | null>(null)
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef         = useRef<HTMLAudioElement | null>(null)
  const streamRef        = useRef<MediaStream | null>(null)

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  useEffect(() => () => { stopTimer(); streamRef.current?.getTracks().forEach(t => t.stop()) }, [stopTimer])

  const startRecording = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const mr = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mr
      chunksRef.current         = []

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        blobRef.current = blob
        setAudioUrl(URL.createObjectURL(blob))
        setRecState('recorded')
        stream.getTracks().forEach(t => t.stop())
      }

      mr.start(250)
      setRecState('recording')
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } catch {
      setError('Microphone access denied. Please allow microphone access and try again.')
    }
  }

  const stopRecording = () => {
    stopTimer()
    mediaRecorderRef.current?.stop()
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) { audioRef.current.pause() }
    else           { audioRef.current.play() }
    setIsPlaying(!isPlaying)
  }

  const reset = () => {
    setRecState('idle')
    setSeconds(0)
    setAudioUrl(null)
    setIsPlaying(false)
    blobRef.current = null
    chunksRef.current = []
  }

  const uploadRecording = async () => {
    if (!blobRef.current) return
    setRecState('uploading')
    setError(null)

    try {
      const { signature, timestamp, apiKey, cloudName, folder } =
        await (getSignature ?? getCloudinarySignatureAction)()

      const formData = new FormData()
      formData.append('file',      blobRef.current, `voice-${Date.now()}.webm`)
      formData.append('api_key',   apiKey)
      formData.append('timestamp', String(timestamp))
      formData.append('signature', signature)
      formData.append('folder',    folder)
      formData.append('resource_type', 'video')  // Cloudinary uses 'video' for audio

      const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
        method: 'POST',
        body:   formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message ?? 'Upload failed')

      onUpload({
        cloudinaryId:    data.public_id,
        url:             data.secure_url,
        thumbnailUrl:    null,
        mimeType:        'audio/webm',
        sizeBytes:       blobRef.current.size,
        durationSeconds: data.duration ? Math.round(data.duration) : seconds,
      })
      setRecState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
      setRecState('recorded')
    }
  }

  return (
    <div className={cn('rounded-xl border border-stone bg-ivory p-5', className)}>
      {recState === 'idle' && (
        <div className="flex flex-col items-center gap-4 py-4">
          <button
            type="button"
            onClick={startRecording}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-charcoal text-ivory hover:bg-dark transition-colors shadow-card"
          >
            <Mic size={24} />
          </button>
          <p className="text-sm text-warm-gray">Tap to start recording</p>
          {error && <p className="text-xs text-rose text-center">{error}</p>}
        </div>
      )}

      {recState === 'recording' && (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <button
              type="button"
              onClick={stopRecording}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-rose text-ivory hover:bg-rose/80 transition-colors shadow-card"
            >
              <Square size={20} />
            </button>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-rose/30 animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-lg font-mono text-charcoal">{formatSeconds(seconds)}</p>
            <p className="text-xs text-warm-gray mt-0.5">Recording… tap to stop</p>
          </div>
        </div>
      )}

      {(recState === 'recorded' || recState === 'uploading') && audioUrl && (
        <div className="space-y-4">
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
          <div className="flex items-center gap-4 rounded-xl bg-cream px-4 py-3">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-ivory hover:bg-dark transition-colors flex-shrink-0"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <div className="flex-1">
              <div className="h-1 rounded-full bg-stone" />
            </div>
            <span className="text-xs font-mono text-warm-gray">{formatSeconds(seconds)}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              disabled={recState === 'uploading'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone px-3 py-2 text-xs font-medium text-warm-gray hover:text-rose hover:border-rose/40 transition-colors disabled:opacity-40"
            >
              <Trash2 size={12} />
              Re-record
            </button>
            <button
              type="button"
              onClick={uploadRecording}
              disabled={recState === 'uploading'}
              className="inline-flex items-center gap-1.5 rounded-lg bg-charcoal px-4 py-2 text-xs font-medium text-ivory hover:bg-dark transition-colors disabled:opacity-60"
            >
              <Upload size={12} />
              {recState === 'uploading' ? 'Uploading…' : 'Save recording'}
            </button>
          </div>
          {error && <p className="text-xs text-rose">{error}</p>}
        </div>
      )}

      {recState === 'done' && (
        <div className="flex items-center justify-between rounded-xl bg-cream px-4 py-3">
          <div>
            <p className="text-sm font-medium text-charcoal">Recording saved</p>
            <p className="text-xs text-warm-gray">{formatSeconds(seconds)}</p>
          </div>
          <button type="button" onClick={reset} className="text-xs text-warm-gray hover:text-rose transition-colors">
            Replace
          </button>
        </div>
      )}
    </div>
  )
}
