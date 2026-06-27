'use server'

import { connectDB }       from '@/lib/db/connection'
import { Capsule }         from '@/lib/db/models/Capsule.model'
import { CapsuleItem }     from '@/lib/db/models/CapsuleItem.model'
import { User }            from '@/lib/db/models/User.model'
import { requireSession }  from '@/lib/auth/session'

export type DeleteCapsuleResult =
  | { success: true }
  | { success: false; error: string }

export async function deleteCapsuleAction(capsuleId: string): Promise<DeleteCapsuleResult> {
  const session = await requireSession()
  await connectDB()

  const capsule = await Capsule.findOne({ _id: capsuleId, authorId: session.user.id })
  if (!capsule) return { success: false, error: 'Capsule not found.' }
  if (capsule.status !== 'draft') return { success: false, error: 'Only draft capsules can be deleted.' }

  await CapsuleItem.deleteMany({ capsuleId })
  await Capsule.findByIdAndDelete(capsuleId)
  await User.findByIdAndUpdate(session.user.id, { $inc: { capsuleCount: -1 } })

  return { success: true }
}
