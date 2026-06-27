'use server'

import { revalidatePath }  from 'next/cache'
import { connectDB }       from '@/lib/db/connection'
import { Capsule }         from '@/lib/db/models/Capsule.model'
import { CapsuleItem }     from '@/lib/db/models/CapsuleItem.model'
import { requireSession }  from '@/lib/auth/session'

export type RemoveCapsuleItemResult =
  | { success: true }
  | { success: false; error: string }

export async function removeCapsuleItemAction(
  capsuleId: string,
  itemId: string,
): Promise<RemoveCapsuleItemResult> {
  const session = await requireSession()
  await connectDB()

  const capsule = await Capsule.findOne({ _id: capsuleId, authorId: session.user.id })
  if (!capsule) return { success: false, error: 'Capsule not found.' }
  if (capsule.status !== 'draft') return { success: false, error: 'Only draft capsules can be edited.' }

  const item = await CapsuleItem.findOne({ _id: itemId, capsuleId })
  if (!item) return { success: false, error: 'Item not found.' }

  await item.deleteOne()

  revalidatePath(`/capsules/${capsuleId}/edit`)

  return { success: true }
}
