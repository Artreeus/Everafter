'use client'

import { useMemo, useState } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { CapsuleCard } from './CapsuleCard'
import { cn } from '@/lib/utils/cn'

export interface CapsuleCardData {
  id:             string
  title:          string
  theme:          string
  status:         string
  scheduledFor:   string
  sealedAt:       string | null
  recipientCount: number
  recurrence:     'once' | 'monthly' | 'annually'
}

interface CapsuleBrowserProps {
  capsules: CapsuleCardData[]
}

type StatusFilter = 'all' | 'draft' | 'sealed' | 'delivered' | 'expired'

const STATUS_ORDER = ['draft', 'sealed', 'delivered', 'expired']

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: 'All', draft: 'Drafts', sealed: 'Sealed', delivered: 'Delivered', expired: 'Expired',
}

export function CapsuleBrowser({ capsules }: CapsuleBrowserProps) {
  const [query, setQuery]   = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')

  // counts per status for the filter pills
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: capsules.length }
    for (const cap of capsules) c[cap.status] = (c[cap.status] ?? 0) + 1
    return c
  }, [capsules])

  // which status pills to render: always all/draft/sealed/delivered; expired only if present
  const filters: StatusFilter[] = useMemo(() => {
    const base: StatusFilter[] = ['all', 'draft', 'sealed', 'delivered']
    if (counts.expired) base.push('expired')
    return base
  }, [counts])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return capsules
      .filter((c) => (status === 'all' ? true : c.status === status))
      .filter((c) => (q ? c.title.toLowerCase().includes(q) : true))
      .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))
  }, [capsules, query, status])

  const hasActiveFilter = status !== 'all' || query.trim() !== ''

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        {/* status pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1">
          {filters.map((f) => {
            const active = status === f
            return (
              <button
                key={f}
                type="button"
                onClick={() => setStatus(f)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-150',
                  active
                    ? 'bg-charcoal text-ivory'
                    : 'bg-cream border border-stone/60 text-warm-gray hover:text-charcoal hover:border-warm-gray/40',
                )}
              >
                {FILTER_LABELS[f]}
                <span className={cn('tabular-nums', active ? 'text-ivory/55' : 'text-warm-gray/50')}>
                  {counts[f] ?? 0}
                </span>
              </button>
            )
          })}
        </div>

        {/* search */}
        <div className="relative sm:w-64 flex-shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title…"
            className="w-full rounded-xl border border-stone/60 bg-cream pl-9 pr-9 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/15 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray/60 hover:text-charcoal transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CapsuleCard
              key={c.id}
              id={c.id}
              title={c.title}
              theme={c.theme}
              status={c.status}
              scheduledFor={c.scheduledFor}
              sealedAt={c.sealedAt}
              recipientCount={c.recipientCount}
              recurrence={c.recurrence}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="h-12 w-12 rounded-2xl border border-stone/60 bg-cream flex items-center justify-center mb-5">
            <SlidersHorizontal size={20} className="text-warm-gray/60" />
          </div>
          <h3 className="font-display text-lg font-light text-charcoal mb-1.5">
            No capsules match
          </h3>
          <p className="text-sm text-warm-gray max-w-xs leading-relaxed mb-6">
            {query.trim()
              ? <>Nothing titled &ldquo;{query.trim()}&rdquo;{status !== 'all' ? ` in ${FILTER_LABELS[status].toLowerCase()}` : ''}.</>
              : <>You have no {FILTER_LABELS[status].toLowerCase()} capsules yet.</>}
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => { setQuery(''); setStatus('all') }}
              className="inline-flex items-center gap-2 rounded-xl border border-stone/60 px-5 py-2.5 text-sm font-medium text-charcoal hover:border-warm-gray/40 transition-colors"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
