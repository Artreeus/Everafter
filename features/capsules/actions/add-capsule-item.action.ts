'use server'

import { revalidatePath }  from 'next/cache'
import { connectDB }       from '@/lib/db/connection'
import { Capsule }         from '@/lib/db/models/Capsule.model'
import { CapsuleItem }     from '@/lib/db/models/CapsuleItem.model'
import { requireSession }  from '@/lib/auth/session'
import type { CapsuleItemPayload } from '@/features/capsules/schemas/capsule.schema'

export interface AddedItem {
  id:            string
  type:          string
  content:       string | null
  contentFormat: string
  mediaUrl:      string | null
  caption:       string | null
  order:         number
}

export type AddCapsuleItemResult =
  | { success: true;  item: AddedItem }
  | { success: false; error: string }

export async function addCapsuleItemAction(
  capsuleId: string,
  payload: CapsuleItemPayload,
): Promise<AddCapsuleItemResult> {
  const session = await requireSession()
  await connectDB()

  const capsule = await Capsule.findOne({ _id: capsuleId, authorId: session.user.id })
  if (!capsule) return { success: false, error: 'Capsule not found.' }
  if (capsule.status !== 'draft') return { success: false, error: 'Only draft capsules can be edited.' }

  const existingCount = await CapsuleItem.countDocuments({ capsuleId })

  const item = await CapsuleItem.create({
    capsuleId,
    authorId:      session.user.id,
    type:          payload.type,
    order:         payload.order ?? existingCount,
    content:       payload.content ?? null,
    contentFormat: payload.contentFormat ?? 'plain',
    media:         payload.media ?? null,
    metadata: {
      caption: payload.caption ?? null,
      takenAt: null,
    },
    schemaVersion: 1,
  })

  revalidatePath(`/capsules/${capsuleId}/edit`)

  return {
    success: true,
    item: {
      id:            item._id.toString(),
      type:          item.type,
      content:       item.content,
      contentFormat: item.contentFormat,
      mediaUrl:      item.media?.url ?? null,
      caption:       item.metadata?.caption ?? null,
      order:         item.order,
    },
  }
}
