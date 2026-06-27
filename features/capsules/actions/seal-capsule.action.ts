'use server'

import { revalidatePath } from 'next/cache'
import { connectDB }       from '@/lib/db/connection'
import { Capsule }         from '@/lib/db/models/Capsule.model'
import { requireSession }  from '@/lib/auth/session'
import { inngest }         from '@/lib/inngest/client'
import { sendCapsuleSealedEmail } from '@/features/notifications/lib/resend.service'
import { User }            from '@/lib/db/models/User.model'
import { formatDate }      from '@/lib/utils/dates'
import { siteConfig }      from '@/config/site.config'

export type SealResult =
  | { success: true }
  | { success: false; error: string }

export async function sealCapsuleAction(capsuleId: string): Promise<SealResult> {
  const session = await requireSession()

  try {
    await connectDB()

    const capsule = await Capsule.findOne({
      _id:      capsuleId,
      authorId: session.user.id,
    })

    if (!capsule) return { success: false, error: 'Capsule not found.' }
    if (capsule.status !== 'draft') return { success: false, error: 'Only draft capsules can be sealed.' }
    if (capsule.recipients.length === 0) return { success: false, error: 'Add at least one recipient before sealing.' }
    if (capsule.scheduledFor <= new Date()) return { success: false, error: 'Delivery date has already passed.' }

    // Schedule Inngest delivery event
    let inngestJobId: string | null = null
    try {
      const result = await inngest.send({
        name: 'capsule/delivery.scheduled',
        data: { capsuleId: capsule._id.toString() },
        ts:   capsule.scheduledFor.getTime(),
      })
      inngestJobId = result.ids?.[0] ?? null
    } catch (err) {
      // In development without Inngest dev server, log and continue
      console.warn('[sealCapsule] Inngest unavailable — job not scheduled:', err)
    }

    const sealedAt = new Date()

    await Capsule.findByIdAndUpdate(capsuleId, {
      $set: { status: 'sealed', sealedAt, inngestJobId },
    })

    // Send confirmation email to author (fire-and-forget, respects emailNotifications)
    void (async () => {
      const author = await User.findById(session.user.id)
        .select('preferences unsubscribeToken')
        .lean()
      if (!author?.preferences?.emailNotifications) return

      const unsealDeadline  = new Date(sealedAt.getTime() + 24 * 60 * 60 * 1000)
      const unsubscribeUrl  = `${siteConfig.url}/unsubscribe/${author.unsubscribeToken}`

      await sendCapsuleSealedEmail({
        to:             session.user.email!,
        authorName:     session.user.name ?? 'there',
        capsuleTitle:   capsule.title,
        deliveryDate:   formatDate(capsule.scheduledFor, { dateStyle: 'long' }),
        recipientNames: capsule.recipients.map((r) => r.name),
        unsealDeadline: formatDate(unsealDeadline, { dateStyle: 'medium', timeStyle: 'short' }),
        dashboardUrl:   `${siteConfig.url}/dashboard`,
        unsubscribeUrl,
      })
    })().catch((err) => console.error('[sealCapsule] email failed:', err))

    revalidatePath(`/capsules/${capsuleId}`)
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('[sealCapsuleAction]', error)
    return { success: false, error: 'Failed to seal capsule. Please try again.' }
  }
}
