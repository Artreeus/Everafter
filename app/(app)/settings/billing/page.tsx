import type { Metadata }   from 'next'
import { ArrowLeft }        from 'lucide-react'
import Link                 from 'next/link'
import { requireSession }   from '@/lib/auth/session'
import { connectDB }        from '@/lib/db/connection'
import { User }             from '@/lib/db/models/User.model'
import { BillingCard }      from '@/features/billing/components/BillingCard'

export const metadata: Metadata = { title: 'Billing' }

interface Props {
  searchParams: Promise<{ upgraded?: string }>
}

export default async function BillingPage({ searchParams }: Props) {
  const session = await requireSession()
  await connectDB()

  const user = await User.findById(session.user.id)
    .select('plan planExpiresAt capsuleCount')
    .lean()

  const { upgraded } = await searchParams

  return (
    <div className="px-6 py-8 max-w-lg mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Settings
        </Link>
      </div>

      <div>
        <h1 className="font-display text-2xl font-light text-charcoal">Billing</h1>
        <p className="text-sm text-warm-gray mt-1">
          {user?.capsuleCount ?? 0} capsule{(user?.capsuleCount ?? 0) !== 1 ? 's' : ''} created
        </p>
      </div>

      <BillingCard
        plan={user?.plan ?? 'free'}
        expiresAt={user?.planExpiresAt?.toISOString() ?? null}
        upgraded={upgraded === '1'}
      />
    </div>
  )
}
