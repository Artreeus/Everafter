'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, X, Upload } from 'lucide-react'
import { getCloudinarySignatureAction } from '@/features/media/actions/upload-media.action'
import { cn } from '@/lib/utils/cn'
import type { MediaPayload } from '@/types/capsule.types'

interface PhotoUploaderProps {
  onUpload:     (media: MediaPayload) => void
  className?:   string
  getSignature?: () => Promise<import('@/features/media/actions/upload-media.action').CloudinarySignature>
}

export function PhotoUploader({ onUpload, className, getSignature }: PhotoUploaderProps) {
  const [preview,    setPreview]    = useState<string | null>(null)
  const [uploading,  setUploading]  = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadToCloudinary = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Image must be under 20 MB.')
      return
    }

    setError(null)
    setUploading(true)
    setPreview(URL.createObjectURL(file))

    try {
      const { signature, timestamp, apiKey, cloudName, folder } =
        await (getSignature ?? getCloudinarySignatureAction)()

      const formData = new FormData()
      formData.append('file',      file)
      formData.append('api_key',   apiKey)
      formData.append('timestamp', String(timestamp))
      formData.append('signature', signature)
      formData.append('folder',    folder)
      formData.append('transformation', 'c_limit,w_2400,q_auto:good')

      const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body:   formData,
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error?.message ?? 'Upload failed')

      onUpload({
        cloudinaryId:  data.public_id,
        url:           data.secure_url,
        thumbnailUrl:  data.secure_url.replace('/upload/', '/upload/c_thumb,w_400,h_300,g_auto/'),
        mimeType:      file.type,
        sizeBytes:     file.size,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (file: File | undefined) => {
    if (file) uploadToCloudinary(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  if (preview) {
    return (
      <div className={cn('relative rounded-xl overflow-hidden border border-stone', className)}>
        <div className="relative aspect-video bg-cream">
          <Image src={preview} alt="Upload preview" fill className="object-cover" sizes="600px" />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark/40 backdrop-blur-sm">
              <Upload size={20} className="text-ivory animate-bounce" />
            </div>
          )}
        </div>
        {!uploading && (
          <button
            type="button"
            onClick={() => { setPreview(null); setError(null) }}
            className="absolute top-2 right-2 rounded-full bg-dark/60 p-1.5 text-ivory hover:bg-dark transition-colors"
            aria-label="Remove photo"
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={cn(className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'w-full rounded-xl border-2 border-dashed py-12 flex flex-col items-center justify-center gap-3 transition-all duration-200',
          isDragging
            ? 'border-gold bg-gold/5'
            : 'border-stone hover:border-warm-gray/60 bg-cream/50 hover:bg-cream',
        )}
      >
        <ImagePlus size={28} className="text-warm-gray/60" />
        <div className="text-center">
          <p className="text-sm font-medium text-charcoal">Drop a photo here</p>
          <p className="text-xs text-warm-gray mt-0.5">or click to browse · JPG, PNG, WebP up to 20 MB</p>
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="mt-2 text-xs text-rose">{error}</p>}
    </div>
  )
}
