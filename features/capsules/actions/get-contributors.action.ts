'use server'

import { connectDB }          from '@/lib/db/connection'
import { Capsule }            from '@/lib/db/models/Capsule.model'
import { CapsuleContributor } from '@/lib/db/models/CapsuleContributor.model'
import { requireSession }     from '@/lib/auth/session'

export interface SerializedContributor {
  id:          string
  name:        string
  email:       string
  status:      'pending' | 'accepted' | 'declined'
  acceptedAt:  string | null
}

export async function getContributorsAction(capsuleId: string): Promise<SerializedContributor[]> {
  const session = await requireSession()
  await connectDB()

  const capsule = await Capsule.findOne({ _id: capsuleId, authorId: session.user.id })
    .select('_id')
    .lean()
  if (!capsule) return []

  const contributors = await CapsuleContributor.find({ capsuleId })
    .sort({ createdAt: 1 })
    .lean()

  return contributors.map((c) => ({
    id:         c._id.toString(),
    name:       c.name,
    email:      c.email,
    status:     c.status,
    acceptedAt: c.acceptedAt?.toISOString() ?? null,
  }))
}
