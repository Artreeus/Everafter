'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { Flame, Lock, LockOpen, PenLine, Image, Mic, BookOpen, Users, Calendar, Palette, Pencil, MessageSquare, UserCheck, RefreshCw, RefreshCwOff } from 'lucide-react'
import { SealConfirmDialog }  from './seal/SealConfirmDialog'
import { WaxSealAnimation }   from './seal/WaxSealAnimation'
import { unsealCapsuleAction }    from '@/features/capsules/actions/unseal-capsule.action'
import { stopRecurrenceAction }   from '@/features/capsules/actions/stop-recurrence.action'
import { formatDate, formatRelative } from '@/lib/utils/dates'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'
import type { SerializedReply }       from '@/features/capsules/actions/get-replies.action'
import type { SerializedContributor } from '@/features/capsules/actions/get-contributors.action'

const THEME_BG: Record<string, string> = {
  classic:  'bg-cream border-stone/40',
  floral:   'bg-rose/5 border-rose/20',
  midnight: 'bg-charcoal border-charcoal/80',
  golden:   'bg-gold/5 border-gold/30',
  sakura:   'bg-[#FFF0F5] border-[#F0B8CC]/40',
  ocean:    'bg-[#E8F4F6] border-[#5AACBB]/25',
  ember:    'bg-[#FDF2EC] border-[#C4673A]/20',
  velvet:   'bg-[#1C1228] border-[#6B46A0]/60',
}
const THEME_LABEL: Record<string, string> = {
  classic: 'Classic', floral: 'Floral', midnight: 'Midnight', golden: 'Golden',
  sakura: 'Sakura', ocean: 'Ocean', ember: 'Ember', velvet: 'Velvet',
}
const ITEM_ICONS = {
  letter: PenLine, photo: Image, voice: Mic, memory: BookOpen,
}

interface CapsuleDetailClientProps {
  capsuleId:      string
  title:          string
  theme:          string
  status:         string
  message:        string | null
  scheduledFor:   string
  sealedAt:       string | null
  recipients:     { id: string; name: string; email: string; status: string }[]
  itemCounts:     Record<string, number>
  notifyOnOpen:   boolean
  recurrence:     'once' | 'monthly' | 'annually'
  replies:        SerializedReply[]
  contributors:   SerializedContributor[]
}

const UNSEAL_WINDOW_MS = 24 * 60 * 60 * 1000

export function CapsuleDetailClient({
  capsuleId,
  title,
  theme,
  status,
  message,
  scheduledFor,
  sealedAt,
  recipients,
  itemCounts,
  notifyOnOpen: _notifyOnOpen,
  recurrence,
  replies,
  contributors,
}: CapsuleDetailClientProps) {
  const router = useRouter()
  const [showSealDialog, setShowSealDialog] = useState(false)
  const [isPending, startTransition]        = useTransition()
  const [stoppingRecurrence, setStoppingRecurrence] = useState(false)

  const isDraft  = status === 'draft'
  const isSealed = status === 'sealed'
  const canUnseal = isSealed && sealedAt
    ? (Date.now() - new Date(sealedAt).getTime()) < UNSEAL_WINDOW_MS
    : false

  const handleUnseal = () => {
    startTransition(async () => {
      const result = await unsealCapsuleAction(capsuleId)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Capsule unsealed. You can edit it again.')
      router.refresh()
    })
  }

  const handleSealed = () => {
    setShowSealDialog(false)
    router.refresh()
  }

  const handleStopRecurrence = () => {
    startTransition(async () => {
      setStoppingRecurrence(true)
      const result = await stopRecurrenceAction(capsuleId)
      setStoppingRecurrence(false)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('This capsule will now deliver only once more.')
      router.refresh()
    })
  }

  const themeBg    = THEME_BG[theme] ?? THEME_BG.classic
  const themeLabel = THEME_LABEL[theme] ?? theme
  const isDark     = theme === 'midnight' || theme === 'velvet'

  return (
    <>
      <div className="min-h-screen bg-ivory py-12 px-6">
        <div className="mx-auto max-w-xl space-y-6">

          {/* Status pill + Edit link */}
          <div className="flex items-center justify-between">
            <StatusPill status={status} />
            {isDraft && (
              <a
                href={`/capsules/${capsuleId}/edit`}
                className="inline-flex items-center gap-1.5 text-xs text-warm-gray hover:text-charcoal transition-colors"
              >
                <Pencil className="w-3 h-3" />
                Edit draft
              </a>
            )}
          </div>

          {/* Capsule card */}
          <div className={cn('rounded-2xl border p-6', themeBg)}>
            <p className={cn('text-[10px] uppercase tracking-[0.2em] mb-2', isDark ? 'text-ivory/40' : 'text-warm-gray')}>
              {themeLabel} capsule
            </p>
            <h1 className={cn('font-display text-2xl font-light mb-2', isDark ? 'text-ivory' : 'text-charcoal')}>
              {title}
            </h1>
            {message && (
              <p className={cn('text-sm italic leading-relaxed', isDark ? 'text-ivory/60' : 'text-warm-gray')}>
                &ldquo;{message}&rdquo;
              </p>
            )}
          </div>

          {/* Sealed state visual */}
          {isSealed && (
            <div className="flex flex-col items-center py-4">
              <WaxSealAnimation play size={90} />
              <p className="mt-4 font-display text-sm text-warm-gray">
                Sealed · delivers {formatRelative(scheduledFor)}
              </p>
              {canUnseal && sealedAt && (
                <p className="mt-1 text-xs text-warm-gray/60">
                  Unseal window closes{' '}
                  {formatDate(new Date(new Date(sealedAt).getTime() + UNSEAL_WINDOW_MS), {
                    dateStyle: 'medium', timeStyle: 'short',
                  })}
                </p>
              )}
            </div>
          )}

          {/* Details */}
          <div className="rounded-xl border border-stone/40 bg-white divide-y divide-stone/30 overflow-hidden">
            <DetailRow icon={<Calendar size={14} />} label="Delivers">
              <p className="text-sm text-charcoal">{formatDate(scheduledFor)}</p>
              <p className="text-xs text-warm-gray">{formatRelative(scheduledFor)} from now</p>
              {recurrence !== 'once' && (
                <p className="text-xs text-warm-gray mt-0.5 flex items-center gap-1">
                  <RefreshCw size={10} />
                  Repeats {recurrence}
                </p>
              )}
            </DetailRow>

            <DetailRow icon={<Users size={14} />} label="Recipients">
              <div className="space-y-1">
                {recipients.map((r) => (
                  <div key={r.id} className="flex items-center gap-2">
                    <span className="text-sm text-charcoal">{r.name}</span>
                    <span className="text-warm-gray text-xs">· {r.email}</span>
                    {r.status !== 'pending' && (
                      <span className="ml-auto text-[10px] uppercase tracking-wider text-gold">{r.status}</span>
                    )}
                  </div>
                ))}
              </div>
            </DetailRow>

            {Object.keys(itemCounts).length > 0 && (
              <DetailRow icon={<PenLine size={14} />} label="Contents">
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(itemCounts).map(([type, count]) => {
                    const Icon = ITEM_ICONS[type as keyof typeof ITEM_ICONS] ?? PenLine
                    return (
                      <span
                        key={type}
                        className="inline-flex items-center gap-1 rounded-full bg-ivory border border-stone px-2 py-0.5 text-xs text-charcoal"
                      >
                        <Icon size={10} />
                        {count} {type}
                      </span>
                    )
                  })}
                </div>
              </DetailRow>
            )}

            <DetailRow icon={<Palette size={14} />} label="Theme">
              <p className="text-sm text-charcoal">{themeLabel}</p>
            </DetailRow>

            {contributors.length > 0 && (
              <DetailRow icon={<UserCheck size={14} />} label="Contributors">
                <div className="space-y-1">
                  {contributors.map((c) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <span className="text-sm text-charcoal">{c.name}</span>
                      <span className={cn(
                        'text-[10px] uppercase tracking-wider',
                        c.status === 'accepted' ? 'text-gold' : 'text-warm-gray/50',
                      )}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </DetailRow>
            )}
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="rounded-xl border border-stone/40 bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-stone/30">
                <MessageSquare size={13} className="text-warm-gray" />
                <span className="text-xs text-warm-gray uppercase tracking-wider">Replies</span>
                <span className="ml-auto text-xs text-warm-gray/60">{replies.length}</span>
              </div>
              <div className="divide-y divide-stone/20">
                {replies.map((reply) => (
                  <div key={reply.id} className="px-5 py-4 space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-charcoal">{reply.recipientName}</span>
                      <span className="text-[11px] text-warm-gray/60 flex-shrink-0">
                        {formatDate(reply.createdAt, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-warm-gray leading-relaxed">{reply.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {isDraft && (
              <>
                <button
                  type="button"
                  onClick={() => setShowSealDialog(true)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-charcoal px-6 py-3.5 text-sm font-medium text-ivory hover:bg-dark transition-colors shadow-soft"
                >
                  <Flame size={15} />
                  Seal capsule
                </button>
                <a
                  href={`/capsules/${capsuleId}/edit`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-stone px-6 py-3 text-sm text-warm-gray hover:text-charcoal hover:border-warm-gray/50 transition-colors"
                >
                  <Pencil size={14} />
                  Edit draft
                </a>
              </>
            )}

            {isSealed && canUnseal && (
              <button
                type="button"
                onClick={handleUnseal}
                disabled={isPending}
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-stone px-6 py-3 text-sm text-warm-gray hover:text-charcoal hover:border-warm-gray/50 transition-colors disabled:opacity-50"
              >
                <LockOpen size={14} />
                {isPending ? 'Unsealing…' : 'Unseal capsule'}
              </button>
            )}

            {isSealed && !canUnseal && (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-stone/40 px-6 py-3 text-xs text-warm-gray/60">
                <Lock size={12} />
                {recurrence !== 'once' ? `Sealed · repeats ${recurrence}` : 'Sealed forever'}
              </div>
            )}

            {recurrence !== 'once' && (isSealed || status === 'delivered') && (
              <button
                type="button"
                onClick={handleStopRecurrence}
                disabled={isPending || stoppingRecurrence}
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-stone/60 px-6 py-3 text-sm text-warm-gray hover:text-rose hover:border-rose/40 transition-colors disabled:opacity-50"
              >
                <RefreshCwOff size={14} />
                {stoppingRecurrence ? 'Stopping…' : 'Stop repeating'}
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSealDialog && (
          <SealConfirmDialog
            capsuleId={capsuleId}
            capsuleTitle={title}
            deliveryDate={formatDate(scheduledFor)}
            recipientCount={recipients.length}
            onSealed={handleSealed}
            onClose={() => setShowSealDialog(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function StatusPill({ status }: { status: string }) {
  const configs = {
    draft:     { label: 'Draft',     className: 'bg-stone/40 text-warm-gray' },
    sealed:    { label: 'Sealed',    className: 'bg-rose/15 text-rose' },
    delivered: { label: 'Delivered', className: 'bg-gold/15 text-gold' },
    expired:   { label: 'Expired',   className: 'bg-stone/40 text-warm-gray/60' },
  } as const

  const config = configs[status as keyof typeof configs] ?? configs.draft

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest font-medium', config.className)}>
      {config.label}
    </span>
  )
}

function DetailRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 px-5 py-3.5">
      <div className="flex items-center gap-1.5 w-28 flex-shrink-0">
        <span className="text-warm-gray">{icon}</span>
        <span className="text-xs text-warm-gray uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
