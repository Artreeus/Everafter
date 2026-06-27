'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface MemoryBlockProps {
  value?:    string
  onChange:  (value: string) => void
  className?: string
}

export function MemoryBlock({ value = '', onChange, className }: MemoryBlockProps) {
  const maxLength = 1000
  const remaining = maxLength - value.length

  return (
    <div className={cn('space-y-2', className)}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        rows={5}
        placeholder="A memory you want to preserve — a feeling, a moment, a detail that matters..."
        className={cn(
          'block w-full rounded-xl border border-stone bg-ivory px-4 py-3',
          'text-sm text-charcoal placeholder:text-warm-gray/50 resize-none',
          'outline-none transition-all duration-150 leading-relaxed',
          'focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
          'hover:border-warm-gray/50',
        )}
      />
      <p className={cn(
        'text-xs text-right transition-colors',
        remaining < 100 ? 'text-rose' : 'text-warm-gray/50',
      )}>
        {remaining} characters remaining
      </p>
    </div>
  )
}
