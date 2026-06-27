import Link from 'next/link'
import { Plus, Inbox } from 'lucide-react'
import { CapsuleCard } from './CapsuleCard'
import type { ICapsule } from '@/lib/db/models/Capsule.model'

interface CapsuleGridProps {
  capsules: ICapsule[]
}

export function CapsuleGrid({ capsules }: CapsuleGridProps) {
  if (capsules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="h-14 w-14 rounded-2xl border border-stone/60 bg-cream flex items-center justify-center mb-5">
          <Inbox size={24} className="text-warm-gray/60" />
        </div>
        <h3 className="font-display text-xl font-light text-charcoal mb-2">
          No capsules yet
        </h3>
        <p className="text-sm text-warm-gray max-w-xs leading-relaxed mb-8">
          Create your first time capsule — a letter, a photo, a voice note — for someone you love.
        </p>
        <Link
          href="/capsules/new"
          className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-6 py-3 text-sm font-medium text-ivory hover:bg-dark transition-colors shadow-soft"
        >
          <Plus size={15} />
          Create your first capsule
        </Link>
      </div>
    )
  }

  // Group by status for visual order: draft → sealed → delivered
  const order = ['draft', 'sealed', 'delivered', 'expired']
  const sorted = [...capsules].sort(
    (a, b) => order.indexOf(a.status) - order.indexOf(b.status),
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {sorted.map((c) => (
        <CapsuleCard
          key={c._id.toString()}
          id={c._id.toString()}
          title={c.title}
          theme={c.theme}
          status={c.status}
          scheduledFor={c.scheduledFor}
          sealedAt={c.sealedAt}
          recipientCount={c.recipients.length}
          recurrence={c.settings.recurrence}
        />
      ))}
    </div>
  )
}
