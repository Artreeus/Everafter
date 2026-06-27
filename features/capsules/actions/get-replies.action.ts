'use server'

import { connectDB }        from '@/lib/db/connection'
import { Capsule }          from '@/lib/db/models/Capsule.model'
import { CapsuleReply }     from '@/lib/db/models/CapsuleReply.model'
import { requireSession }   from '@/lib/auth/session'

export interface SerializedReply {
  id:            string
  recipientName: string
  content:       string
  createdAt:     string
}

export async function getRepliesAction(capsuleId: string): Promise<SerializedReply[]> {
  const session = await requireSession()
  await connectDB()

  const capsule = await Capsule.findOne({ _id: capsuleId, authorId: session.user.id })
    .select('_id')
    .lean()
  if (!capsule) return []

  const replies = await CapsuleReply.find({ capsuleId })
    .sort({ createdAt: 1 })
    .lean()

  return replies.map((r) => ({
    id:            r._id.toString(),
    recipientName: r.recipientName,
    content:       r.content,
    createdAt:     r.createdAt.toISOString(),
  }))
}
