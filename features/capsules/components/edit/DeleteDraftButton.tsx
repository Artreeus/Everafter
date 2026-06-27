'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import { Trash2 }                  from 'lucide-react'
import { toast }                   from 'sonner'
import { cn }                      from '@/lib/utils/cn'
import { deleteCapsuleAction }     from '@/features/capsules/actions/delete-capsule.action'

interface DeleteDraftButtonProps {
  capsuleId:    string
  capsuleTitle: string
}

export function DeleteDraftButton({ capsuleId, capsuleTitle }: DeleteDraftButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition]  = useTransition()
  const router                      = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCapsuleAction(capsuleId)
      if (result.success) {
        toast.success('Capsule deleted.')
        router.push('/dashboard')
      } else {
        toast.error(result.error)
        setConfirming(false)
      }
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-warm-gray">Delete &ldquo;{capsuleTitle.slice(0, 30)}&rdquo;?</span>
        <button
          onClick={handleDelete}
          disabled={pending}
          className="text-xs font-medium text-rose hover:text-rose/80 transition-colors disabled:opacity-50"
        >
          {pending ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="text-xs text-warm-gray hover:text-charcoal transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs text-warm-gray/60',
        'hover:text-rose transition-colors',
      )}
    >
      <Trash2 className="w-3.5 h-3.5" />
      Delete draft
    </button>
  )
}
