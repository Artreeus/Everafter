'use server'

import { revalidatePath }  from 'next/cache'
import { connectDB }       from '@/lib/db/connection'
import { Capsule }         from '@/lib/db/models/Capsule.model'
import { requireSession }  from '@/lib/auth/session'

export type RemoveRecipientResult =
  | { success: true }
  | { success: false; error: string }

export async function removeRecipientAction(
  capsuleId: string,
  recipientId: string,
): Promise<RemoveRecipientResult> {
  const session = await requireSession()
  await connectDB()

  const capsule = await Capsule.findOne({ _id: capsuleId, authorId: session.user.id })
  if (!capsule) return { success: false, error: 'Capsule not found.' }
  if (capsule.status !== 'draft') return { success: false, error: 'Only draft capsules can be edited.' }

  await Capsule.updateOne(
    { _id: capsuleId },
    { $pull: { recipients: { _id: recipientId } } },
  )

  revalidatePath(`/capsules/${capsuleId}/edit`)

  return { success: true }
}
