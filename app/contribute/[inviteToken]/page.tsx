import type { Metadata }           from 'next'
import { notFound }                 from 'next/navigation'
import { getContributeDataAction }  from '@/features/contribute/actions/contribute.action'
import { ContributeClient }         from '@/features/contribute/components/ContributeClient'

interface Props { params: Promise<{ inviteToken: string }> }

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title:  'Contribute to a capsule — Everafter',
  robots: { index: false, follow: false },
}

export default async function ContributePage({ params }: Props) {
  const { inviteToken } = await params
  const result          = await getContributeDataAction(inviteToken)

  if (result.status === 'notFound') notFound()

  if (result.status === 'closed') {
    return (
      <ClosedScreen capsuleTitle={result.capsuleTitle} />
    )
  }

  const { data } = result

  return (
    <ContributeClient
      inviteToken={inviteToken}
      capsuleTitle={data.capsuleTitle}
      authorName={data.authorName}
      contributorName={data.contributorName}
      initialItems={data.items}
    />
  )
}

function ClosedScreen({ capsuleTitle }: { capsuleTitle: string }) {
  return (
    <main className="min-h-screen bg-ivory flex flex-col items-center justify-center text-center px-6 gap-3">
      <div className="space-y-3 max-w-sm">
        <p className="text-xs text-warm-gray uppercase tracking-widest font-medium">Everafter</p>
        <h1 className="font-display text-2xl font-light text-charcoal">{capsuleTitle}</h1>
        <p className="text-sm text-warm-gray leading-relaxed">
          This capsule has been sealed and is no longer accepting contributions.
        </p>
      </div>
    </main>
  )
}
