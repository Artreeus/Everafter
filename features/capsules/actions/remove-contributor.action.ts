'use server'

import { connectDB }          from '@/lib/db/connection'
import { Capsule }            from '@/lib/db/models/Capsule.model'
import { CapsuleContributor } from '@/lib/db/models/CapsuleContributor.model'
import { CapsuleItem }        from '@/lib/db/models/CapsuleItem.model'
import { requireSession }     from '@/lib/auth/session'

export type RemoveContributorResult =
  | { success: true }
  | { success: false; error: string }

export async function removeContributorAction(
  capsuleId:     string,
  contributorId: string,
): Promise<RemoveContributorResult> {
  const session = await requireSession()
  await connectDB()

  const capsule = await Capsule.findOne({ _id: capsuleId, authorId: session.user.id }).lean()
  if (!capsule) return { success: false, error: 'Capsule not found.' }
  if (capsule.status !== 'draft') return { success: false, error: 'Cannot modify a sealed capsule.' }

  const contributor = await CapsuleContributor.findOne({ _id: contributorId, capsuleId }).lean()
  if (!contributor) return { success: false, error: 'Contributor not found.' }

  await Promise.all([
    CapsuleContributor.deleteOne({ _id: contributorId }),
    CapsuleItem.deleteMany({ capsuleId, contributorName: contributor.name }),
  ])

  return { success: true }
}
