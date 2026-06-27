'use client'

import { useState, useTransition } from 'react'
import { Send, Check }             from 'lucide-react'
import { cn }                       from '@/lib/utils/cn'
import { submitReplyAction }         from '@/features/capsules/actions/submit-reply.action'

interface ReplyFormProps {
  token:      string
  authorName: string
}

const MAX_CHARS = 1000

export function ReplyForm({ token, authorName }: ReplyFormProps) {
  const [content, setContent]   = useState('')
  const [sent, setSent]         = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [open, setOpen]         = useState(false)
  const [pending, startTransition] = useTransition()

  const remaining = MAX_CHARS - content.length

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setError(null)
    startTransition(async () => {
      const result = await submitReplyAction(token, content)
      if (result.success) {
        setSent(true)
      } else {
        setError(result.error)
      }
    })
  }

  if (sent) {
    return (
      <div className="mt-8 flex flex-col items-center gap-2 text-center">
        <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center">
          <Check className="w-4 h-4 text-gold" />
        </div>
        <p className="text-sm text-charcoal/60 font-sans">
          Your reply has been sent to {authorName}.
        </p>
      </div>
    )
  }

  if (!open) {
    return (
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-5 py-2.5',
            'border border-stone text-sm text-warm-gray',
            'hover:border-warm-gray/60 hover:text-charcoal transition-all duration-200',
          )}
        >
          <Send className="w-3.5 h-3.5" />
          Write a reply to {authorName}
        </button>
      </div>
    )
  }

  return (
    <div className="mt-8 max-w-md mx-auto">
      <p className="text-xs text-charcoal/40 font-sans text-center mb-4 uppercase tracking-wider">
        Reply to {authorName}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
          rows={4}
          autoFocus
          placeholder="Write your reply…"
          className={cn(
            'block w-full rounded-xl border border-stone bg-ivory px-4 py-3 text-sm text-charcoal',
            'outline-none resize-none transition-all duration-150',
            'focus:ring-2 focus:ring-gold/30 focus:border-gold/50',
            'placeholder:text-warm-gray/50',
          )}
        />
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-xs font-sans',
            remaining < 100 ? 'text-rose' : 'text-charcoal/30',
          )}>
            {remaining} left
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-xs text-warm-gray hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || pending}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-colors',
                content.trim() && !pending
                  ? 'bg-charcoal text-ivory hover:bg-dark'
                  : 'bg-stone/40 text-warm-gray cursor-not-allowed',
              )}
            >
              <Send className="w-3 h-3" />
              {pending ? 'Sending…' : 'Send reply'}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-rose">{error}</p>}
      </form>
    </div>
  )
}
