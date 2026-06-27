'use server'

import { revalidatePath }  from 'next/cache'
import { connectDB }       from '@/lib/db/connection'
import { Capsule }         from '@/lib/db/models/Capsule.model'
import { requireSession }  from '@/lib/auth/session'

export type StopRecurrenceResult =
  | { success: true }
  | { success: false; error: string }

export async function stopRecurrenceAction(capsuleId: string): Promise<StopRecurrenceResult> {
  const session = await requireSession()
  await connectDB()

  const capsule = await Capsule.findOne({ _id: capsuleId, authorId: session.user.id })
    .select('status settings')
    .lean()

  if (!capsule) return { success: false, error: 'Capsule not found.' }
  if (capsule.settings.recurrence === 'once') return { success: false, error: 'Already set to deliver once.' }

  await Capsule.updateOne(
    { _id: capsuleId },
    { $set: { 'settings.recurrence': 'once' } },
  )

  revalidatePath(`/capsules/${capsuleId}`)
  return { success: true }
}
