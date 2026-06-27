'use server'

import { revalidatePath } from 'next/cache'
import { connectDB }      from '@/lib/db/connection'
import { Capsule }        from '@/lib/db/models/Capsule.model'
import { requireSession } from '@/lib/auth/session'
import { inngest }        from '@/lib/inngest/client'

export type UnsealResult =
  | { success: true }
  | { success: false; error: string }

const UNSEAL_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function unsealCapsuleAction(capsuleId: string): Promise<UnsealResult> {
  const session = await requireSession()

  try {
    await connectDB()

    const capsule = await Capsule.findOne({
      _id:      capsuleId,
      authorId: session.user.id,
    })

    if (!capsule) return { success: false, error: 'Capsule not found.' }
    if (capsule.status !== 'sealed') return { success: false, error: 'This capsule is not sealed.' }

    if (!capsule.sealedAt) return { success: false, error: 'Seal timestamp missing.' }

    const elapsed = Date.now() - capsule.sealedAt.getTime()
    if (elapsed > UNSEAL_WINDOW_MS) {
      return { success: false, error: 'The 24-hour unseal window has passed.' }
    }

    // Cancel the scheduled Inngest job
    try {
      await inngest.send({
        name: 'capsule/delivery.cancelled',
        data: { capsuleId: capsule._id.toString() },
      })
    } catch (err) {
      console.warn('[unsealCapsule] Inngest unavailable — cancel event not sent:', err)
    }

    await Capsule.findByIdAndUpdate(capsuleId, {
      $set: {
        status:      'draft',
        sealedAt:    null,
        inngestJobId: null,
      },
    })

    revalidatePath(`/capsules/${capsuleId}`)
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('[unsealCapsuleAction]', error)
    return { success: false, error: 'Failed to unseal capsule. Please try again.' }
  }
}
