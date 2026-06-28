'use server'

import { z }                from 'zod'
import { connectDB }        from '@/lib/db/connection'
import { Capsule }          from '@/lib/db/models/Capsule.model'
import { CapsuleReply }     from '@/lib/db/models/CapsuleReply.model'
import { User }             from '@/lib/db/models/User.model'
import { sendCapsuleReplyEmail } from '@/features/notifications/lib/resend.service'
import { siteConfig }           from '@/config/site.config'
import { checkRateLimit }       from '@/lib/utils/rate-limit'

const schema = z.object({
  token:   z.string().min(1),
  content: z.string().min(1, 'Reply cannot be empty').max(1000, 'Reply is too long (max 1000 characters)').trim(),
})

export type SubmitReplyResult =
  | { success: true }
  | { success: false; error: string }

export async function submitReplyAction(
  token: string,
  content: string,
): Promise<SubmitReplyResult> {
  // Replies write to the DB and send an email — keep this tight.
  const rl = await checkRateLimit('reply:submit', { limit: 5, windowMs: 5 * 60_000 })
  if (!rl.ok) return { success: false, error: 'Too many replies. Please wait a few minutes and try again.' }

  const parsed = schema.safeParse({ token, content })
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { success: false, error: first ?? 'Invalid reply.' }
  }

  await connectDB()

  const capsule = await Capsule.findOne({ 'recipients.deliveryToken': token }).lean()
  if (!capsule) return { success: false, error: 'Capsule not found.' }

  if (!capsule.settings.allowReply) {
    return { success: false, error: 'Replies are not enabled for this capsule.' }
  }

  const recipient = capsule.recipients.find((r) => r.deliveryToken === token)
  if (!recipient) return { success: false, error: 'Recipient not found.' }

  if (recipient.status !== 'opened') {
    return { success: false, error: 'Open the capsule before sending a reply.' }
  }

  await CapsuleReply.create({
    capsuleId:      capsule._id,
    recipientToken: token,
    recipientName:  recipient.name,
    content:        parsed.data.content,
  })

  // Notify author — fire-and-forget, respects emailNotifications
  void (async () => {
    const author = await User.findById(capsule.authorId)
      .select('name email preferences unsubscribeToken')
      .lean()
    if (!author) return
    if (author.preferences?.emailNotifications === false) return
    await sendCapsuleReplyEmail({
      authorEmail:    author.email,
      authorName:     author.name,
      capsuleTitle:   capsule.title,
      replyFrom:      recipient.name,
      replyContent:   parsed.data.content,
      unsubscribeUrl: `${siteConfig.url}/unsubscribe/${author.unsubscribeToken}`,
    })
  })()

  return { success: true }
}
