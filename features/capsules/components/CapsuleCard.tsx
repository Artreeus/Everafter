import Link from 'next/link'
import { Users, Lock, Flame, Pencil, RefreshCw } from 'lucide-react'
import { formatDate, formatRelative } from '@/lib/utils/dates'
import { cn } from '@/lib/utils/cn'

const THEME_STYLES: Record<string, { card: string; number: string }> = {
  classic:  { card: 'bg-cream border-stone/50',                       number: 'text-warm-gray'        },
  floral:   { card: 'bg-rose/5 border-rose/20',                       number: 'text-rose/60'          },
  midnight: { card: 'bg-charcoal border-charcoal/80',                 number: 'text-ivory/30'         },
  golden:   { card: 'bg-gold/5 border-gold/25',                       number: 'text-gold/50'          },
  sakura:   { card: 'bg-[#FFF0F5] border-[#F0B8CC]/40',              number: 'text-[#D4789A]/70'     },
  ocean:    { card: 'bg-[#E8F4F6] border-[#5AACBB]/25',              number: 'text-[#2A8FA0]/70'     },
  ember:    { card: 'bg-[#FDF2EC] border-[#C4673A]/20',              number: 'text-[#C4673A]/70'     },
  velvet:   { card: 'bg-[#1C1228] border-[#6B46A0]/60',              number: 'text-[#8B5CF6]/40'     },
}

const STATUS_STYLES: Record<string, string> = {
  draft:     'bg-stone/60 text-warm-gray',
  sealed:    'bg-rose/15 text-rose',
  delivered: 'bg-gold/15 text-gold',
  expired:   'bg-stone/40 text-warm-gray/50',
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft', sealed: 'Sealed', delivered: 'Delivered', expired: 'Expired',
}

interface CapsuleCardProps {
  id:             string
  title:          string
  theme:          string
  status:         string
  scheduledFor:   Date | string
  sealedAt:       Date | string | null
  recipientCount: number
  recurrence?:    'once' | 'monthly' | 'annually'
}

export function CapsuleCard({
  id, title, theme, status, scheduledFor, sealedAt, recipientCount, recurrence = 'once',
}: CapsuleCardProps) {
  const themeStyle = THEME_STYLES[theme] ?? THEME_STYLES.classic
  const isDark     = theme === 'midnight' || theme === 'velvet'
  const isSealed   = status === 'sealed'
  const isDraft    = status === 'draft'

  const canUnseal = isSealed && sealedAt
    ? (Date.now() - new Date(sealedAt).getTime()) < 24 * 60 * 60 * 1000
    : false

  return (
    <Link
      href={`/capsules/${id}`}
      className={cn(
        'group block rounded-2xl border p-6 transition-all duration-200',
        'hover:shadow-card hover:-translate-y-0.5',
        themeStyle.card,
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className={cn(
          'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest font-medium',
          STATUS_STYLES[status] ?? STATUS_STYLES.draft,
        )}>
          {STATUS_LABELS[status] ?? status}
        </span>
        {isSealed && canUnseal && (
          <span className="text-[10px] text-rose/60 font-sans">24h window open</span>
        )}
        {isSealed && !canUnseal && (
          <Lock size={12} className={isDark ? 'text-ivory/30' : 'text-warm-gray/40'} />
        )}
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-display text-lg font-light leading-tight mb-4 line-clamp-2',
        isDark ? 'text-ivory' : 'text-charcoal',
      )}>
        {title}
      </h3>

      {/* Meta */}
      <div className="space-y-2">
        <div className={cn('flex items-center gap-1.5 text-xs', isDark ? 'text-ivory/50' : 'text-warm-gray')}>
          <Users size={11} className="flex-shrink-0" />
          <span>{recipientCount} recipient{recipientCount !== 1 ? 's' : ''}</span>
        </div>
        <div className={cn('flex items-center gap-1.5 text-xs', isDark ? 'text-ivory/50' : 'text-warm-gray')}>
          <span className="font-medium text-[10px] uppercase tracking-wider">
            {status === 'delivered' ? 'Delivered' : 'Delivers'}
          </span>
          <span>{formatDate(scheduledFor)}</span>
          {recurrence !== 'once' && (
            <span className="inline-flex items-center gap-0.5 text-[10px]">
              <RefreshCw size={9} />
              {recurrence}
            </span>
          )}
        </div>
        {status !== 'delivered' && (
          <div className={cn('text-xs font-medium', isDark ? 'text-ivory/70' : 'text-charcoal/70')}>
            {formatRelative(scheduledFor)}
          </div>
        )}
      </div>

      {/* CTA hints */}
      {isDraft && (
        <div className="mt-5 flex items-center justify-between">
          <div className={cn(
            'flex items-center gap-1.5 text-xs font-medium',
            isDark ? 'text-ivory/40' : 'text-warm-gray/70',
            'group-hover:text-rose transition-colors duration-200',
          )}>
            <Flame size={11} />
            Ready to seal?
          </div>
          <span className={cn(
            'flex items-center gap-1 text-[11px]',
            isDark ? 'text-ivory/30' : 'text-warm-gray/50',
          )}>
            <Pencil size={10} />
            Edit
          </span>
        </div>
      )}
    </Link>
  )
}
