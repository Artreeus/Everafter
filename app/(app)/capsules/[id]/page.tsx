import type { Metadata }       from 'next'
import { notFound }              from 'next/navigation'
import { getCapsuleAction }      from '@/features/capsules/actions/get-capsule.action'
import { getRepliesAction }      from '@/features/capsules/actions/get-replies.action'
import { getContributorsAction } from '@/features/capsules/actions/get-contributors.action'
import { CapsuleDetailClient }   from '@/features/capsules/components/CapsuleDetailClient'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const result  = await getCapsuleAction(id)
  if (!result) return { title: 'Capsule' }
  return { title: result.capsule.title }
}

export default async function CapsulePage({ params }: Props) {
  const { id } = await params
  const [result, replies, contributors] = await Promise.all([
    getCapsuleAction(id),
    getRepliesAction(id),
    getContributorsAction(id),
  ])
  if (!result) notFound()

  const { capsule, items } = result

  const itemCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1
    return acc
  }, {})

  return (
    <CapsuleDetailClient
      capsuleId={capsule._id.toString()}
      title={capsule.title}
      theme={capsule.theme}
      status={capsule.status}
      message={capsule.message ?? null}
      scheduledFor={capsule.scheduledFor.toISOString()}
      sealedAt={capsule.sealedAt?.toISOString() ?? null}
      recipients={capsule.recipients.map((r) => ({
        id:     r._id.toString(),
        name:   r.name,
        email:  r.email,
        status: r.status,
      }))}
      itemCounts={itemCounts}
      notifyOnOpen={capsule.settings.notifyOnOpen}
      recurrence={capsule.settings.recurrence}
      replies={replies}
      contributors={contributors}
    />
  )
}
