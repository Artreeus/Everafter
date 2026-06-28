import type { Metadata }  from 'next'
import Link               from 'next/link'
import { Plus }           from 'lucide-react'
import { getSession }     from '@/lib/auth/session'
import { getCapsulesAction } from '@/features/capsules/actions/get-capsule.action'
import { CapsuleBrowser, type CapsuleCardData } from '@/features/capsules/components/CapsuleBrowser'
import { OnboardingEmptyState } from '@/features/capsules/components/OnboardingEmptyState'

export const metadata: Metadata = { title: 'Dashboard — Everafter' }

export default async function DashboardPage() {
  const [session, capsules] = await Promise.all([
    getSession(),
    getCapsulesAction(),
  ])

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  const stats = {
    total:     capsules.length,
    drafts:    capsules.filter((c) => c.status === 'draft').length,
    sealed:    capsules.filter((c) => c.status === 'sealed').length,
    delivered: capsules.filter((c) => c.status === 'delivered').length,
  }

  const cardData: CapsuleCardData[] = capsules.map((c) => ({
    id:             c._id.toString(),
    title:          c.title,
    theme:          c.theme,
    status:         c.status,
    scheduledFor:   new Date(c.scheduledFor).toISOString(),
    sealedAt:       c.sealedAt ? new Date(c.sealedAt).toISOString() : null,
    recipientCount: c.recipients.length,
    recurrence:     c.settings.recurrence,
  }))

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-sans uppercase tracking-[0.18em] text-warm-gray mb-1.5">
            Your capsules
          </p>
          <h1 className="font-display text-3xl font-light text-charcoal">
            Hello, {firstName}.
          </h1>
        </div>

        <Link
          href="/capsules/new"
          className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-charcoal px-5 py-2.5 text-sm font-medium text-ivory hover:bg-dark transition-colors shadow-soft flex-shrink-0"
        >
          <Plus size={15} />
          New capsule
        </Link>
      </div>

      {/* Stats row — only show if there are capsules */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Drafts"    value={stats.drafts}    muted={stats.drafts === 0} />
          <StatCard label="Sealed"    value={stats.sealed}    accent="rose" muted={stats.sealed === 0} />
          <StatCard label="Delivered" value={stats.delivered} accent="gold" muted={stats.delivered === 0} />
        </div>
      )}

      {/* Capsules — onboarding for new users, browser otherwise */}
      {stats.total === 0
        ? <OnboardingEmptyState />
        : <CapsuleBrowser capsules={cardData} />}
    </div>
  )
}

function StatCard({
  label, value, accent, muted,
}: {
  label: string
  value: number
  accent?: 'rose' | 'gold'
  muted?: boolean
}) {
  const valueColor =
    muted ? 'text-warm-gray/40' :
    accent === 'rose' ? 'text-rose' :
    accent === 'gold' ? 'text-gold' :
    'text-charcoal'

  return (
    <div className="rounded-xl border border-stone/50 bg-cream px-5 py-4">
      <p className={`font-display text-2xl font-light mb-0.5 ${valueColor}`}>{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-warm-gray/70 font-sans">{label}</p>
    </div>
  )
}
