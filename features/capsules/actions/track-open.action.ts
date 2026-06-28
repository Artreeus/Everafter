'use server'

import { connectDB }               from '@/lib/db/connection'
import { Capsule }                  from '@/lib/db/models/Capsule.model'
import { CapsuleItem }              from '@/lib/db/models/CapsuleItem.model'
import { DeliveryLog }              from '@/lib/db/models/DeliveryLog.model'
import { User }                     from '@/lib/db/models/User.model'
import { sendCapsuleOpenedEmail }   from '@/features/notifications/lib/resend.service'
import { formatDate }               from '@/lib/utils/dates'
import { siteConfig }               from '@/config/site.config'
import { checkRateLimit }           from '@/lib/utils/rate-limit'

export interface OpeningData {
  capsule: {
    id:         string
    title:      string
    theme:      string
    message:    string | null
    allowReply: boolean
  }
  author:    { name: string }
  recipient: { name: string }
  items: SerializedOpenItem[]
  isFirstOpen: boolean
}

export interface SerializedOpenItem {
  id:              string
  type:            'letter' | 'photo' | 'voice' | 'memory'
  content:         string | null
  contentFormat:   'plain' | 'rich'
  mediaUrl:        string | null
  thumbnailUrl:    string | null
  mimeType:        string | null
  durationSeconds: number | null
  caption:         string | null
  contributorName: string | null
}

export type TrackOpenResult =
  | { status: 'ok';      data: OpeningData }
  | { status: 'notYet' }
  | { status: 'notFound' }

export async function trackOpenAction(token: string): Promise<TrackOpenResult> {
  // Throttle abnormal traffic (token enumeration / refresh hammering). Generous
  // enough that a recipient re-reading their capsule never hits it.
  const rl = await checkRateLimit('open:track', { limit: 30, windowMs: 60_000 })
  if (!rl.ok) return { status: 'notFound' }

  await connectDB()

  const capsule = await Capsule.findOne({ 'recipients.deliveryToken': token })
  if (!capsule) return { status: 'notFound' }

  // Allow opening if delivered, or if sealed and past the scheduled date
  const now = new Date()
  const isDeliverable =
    capsule.status === 'delivered' ||
    (capsule.status === 'sealed' && capsule.scheduledFor <= now)

  if (!isDeliverable) return { status: 'notYet' }

  const recipient = capsule.recipients.find((r) => r.deliveryToken === token)
  if (!recipient) return { status: 'notFound' }

  const isFirstOpen = recipient.status !== 'opened'

  if (isFirstOpen) {
    await Capsule.updateOne(
      { _id: capsule._id, 'recipients.deliveryToken': token },
      { $set: { 'recipients.$.status': 'opened', 'recipients.$.openedAt': now } },
    )
    await DeliveryLog.updateOne(
      { recipientToken: token },
      { $set: { status: 'opened', openedAt: now } },
    )

    if (capsule.settings.notifyOnOpen) {
      const author = await User.findById(capsule.authorId)
        .select('email name preferences unsubscribeToken')
        .lean()
      if (author?.email && author?.preferences?.emailNotifications !== false) {
        const unsubscribeUrl = `${siteConfig.url}/unsubscribe/${author.unsubscribeToken}`
        sendCapsuleOpenedEmail({
          to:             author.email,
          authorName:     author.name ?? 'there',
          recipientName:  recipient.name,
          capsuleTitle:   capsule.title,
          openedAt:       formatDate(now, { hour: '2-digit', minute: '2-digit' }),
          dashboardUrl:   `${siteConfig.url}/dashboard`,
          unsubscribeUrl,
        }).catch((err) => console.error('[trackOpen] email failed:', err))
      }
    }
  }

  const rawItems = await CapsuleItem.find({ capsuleId: capsule._id })
    .sort({ order: 1 })
    .lean()

  const author = await User.findById(capsule.authorId)
    .select('name preferences unsubscribeToken')
    .lean()

  const items: SerializedOpenItem[] = rawItems.map((item) => ({
    id:              item._id.toString(),
    type:            item.type,
    content:         item.content,
    contentFormat:   item.contentFormat,
    mediaUrl:        item.media?.url ?? null,
    thumbnailUrl:    item.media?.thumbnailUrl ?? null,
    mimeType:        item.media?.mimeType ?? null,
    durationSeconds: item.media?.durationSeconds ?? null,
    caption:         item.metadata?.caption ?? null,
    contributorName: item.contributorName ?? null,
  }))

  return {
    status: 'ok',
    data: {
      capsule: {
        id:         capsule._id.toString(),
        title:      capsule.title,
        theme:      capsule.theme,
        message:    capsule.message,
        allowReply: capsule.settings.allowReply,
      },
      author:    { name: author?.name ?? 'Someone who loves you' },
      recipient: { name: recipient.name },
      items,
      isFirstOpen,
    },
  }
}
