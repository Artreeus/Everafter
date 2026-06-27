'use client'

import { useState, useTransition } from 'react'
import { Trash2 }                  from 'lucide-react'
import { cn }                      from '@/lib/utils/cn'
import { deleteAccountAction }     from '@/features/user/actions/delete-account.action'
import { toast }                   from 'sonner'

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition]  = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteAccountAction()
      if (!result?.success) {
        toast.error(result?.error ?? 'Failed to delete account.')
        setConfirming(false)
      }
    })
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-rose/30 px-4 py-2.5 text-sm text-rose/70 hover:text-rose hover:border-rose/60 transition-colors"
      >
        <Trash2 size={13} />
        Delete my account
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-rose/30 bg-rose/5 p-4 space-y-3">
      <p className="text-sm font-medium text-charcoal">Are you sure?</p>
      <p className="text-xs text-warm-gray leading-relaxed">
        This permanently deletes your account, all your capsules, and their contents.
        Any active Stripe subscription will be cancelled. <strong>This cannot be undone.</strong>
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={pending}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            pending
              ? 'bg-rose/30 text-rose/60 cursor-not-allowed'
              : 'bg-rose text-white hover:bg-rose/90',
          )}
        >
          {pending ? 'Deleting…' : 'Yes, delete everything'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="text-sm text-warm-gray hover:text-charcoal transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
