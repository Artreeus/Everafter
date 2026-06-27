'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Flame } from 'lucide-react'
import { WaxSealAnimation } from './WaxSealAnimation'
import { sealCapsuleAction } from '@/features/capsules/actions/seal-capsule.action'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'

interface SealConfirmDialogProps {
  capsuleId:    string
  capsuleTitle: string
  deliveryDate: string
  recipientCount: number
  onSealed:     () => void
  onClose:      () => void
}

type Phase = 'confirm' | 'sealing' | 'done'

export function SealConfirmDialog({
  capsuleId,
  capsuleTitle,
  deliveryDate,
  recipientCount,
  onSealed,
  onClose,
}: SealConfirmDialogProps) {
  const [phase, setPhase] = useState<Phase>('confirm')
  const [isPending, startTransition] = useTransition()

  const handleSeal = () => {
    setPhase('sealing')
    startTransition(async () => {
      const result = await sealCapsuleAction(capsuleId)
      if (!result.success) {
        setPhase('confirm')
        toast.error(result.error)
        return
      }
      // Let the wax seal animation play for a moment
      setTimeout(() => {
        setPhase('done')
        setTimeout(() => {
          onSealed()
        }, 1200)
      }, 1400)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={phase === 'confirm' ? onClose : undefined}
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-stone/50 bg-ivory shadow-float overflow-hidden"
      >
        {/* Close */}
        {phase === 'confirm' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-warm-gray hover:text-charcoal transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}

        <AnimatePresence mode="wait">
          {phase === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-7"
            >
              <div className="mb-5">
                <Flame size={22} className="text-rose mb-3" />
                <h2 className="font-display text-xl font-light text-charcoal mb-2">
                  Seal this capsule?
                </h2>
                <p className="text-sm text-warm-gray leading-relaxed">
                  &ldquo;{capsuleTitle}&rdquo; will be delivered to{' '}
                  {recipientCount === 1 ? '1 person' : `${recipientCount} people`} on{' '}
                  <span className="text-charcoal font-medium">{deliveryDate}</span>.
                </p>
              </div>

              <div className="rounded-lg border border-stone/60 bg-cream px-4 py-3 text-xs text-warm-gray mb-6">
                You&apos;ll have <strong className="text-charcoal">24 hours</strong> to unseal and
                make changes. After that, the capsule is truly locked.
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-stone py-2.5 text-sm text-warm-gray hover:text-charcoal hover:border-warm-gray/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSeal}
                  disabled={isPending}
                  className={cn(
                    'flex-1 rounded-lg bg-charcoal py-2.5 text-sm font-medium text-ivory',
                    'hover:bg-dark transition-colors',
                    'disabled:opacity-60 disabled:cursor-not-allowed',
                  )}
                >
                  Seal it
                </button>
              </div>
            </motion.div>
          )}

          {(phase === 'sealing' || phase === 'done') && (
            <motion.div
              key="sealing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-7 flex flex-col items-center text-center"
            >
              <div className="my-4">
                <WaxSealAnimation play={phase === 'sealing' || phase === 'done'} size={100} />
              </div>

              <AnimatePresence mode="wait">
                {phase === 'sealing' && (
                  <motion.div
                    key="sealing-text"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mt-5"
                  >
                    <p className="font-display text-lg font-light text-charcoal">Sealing…</p>
                    <p className="text-xs text-warm-gray mt-1">Your words are being sealed.</p>
                  </motion.div>
                )}
                {phase === 'done' && (
                  <motion.div
                    key="done-text"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5"
                  >
                    <p className="font-display text-lg font-light text-charcoal">Sealed.</p>
                    <p className="text-xs text-warm-gray mt-1">It&apos;ll arrive exactly when it should.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
