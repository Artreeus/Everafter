import { connectDB }               from '@/lib/db/connection'
import { Capsule }                  from '@/lib/db/models/Capsule.model'
import { CapsuleItem }              from '@/lib/db/models/CapsuleItem.model'
import { DeliveryLog }              from '@/lib/db/models/DeliveryLog.model'
import { inngest }                  from '@/lib/inngest/client'
import { sendCapsuleDeliveryEmail } from '@/features/notifications/lib/resend.service'
import { siteConfig }               from '@/config/site.config'

// Inngest v4: trigger is part of the config object (not a separate 2nd arg)
export const deliverCapsule = inngest.createFunction(
  {
    id:       'deliver-capsule',
    name:     'Deliver Capsule to Recipients',
    triggers: [{ event: 'capsule/delivery.scheduled' }],
    cancelOn: [
      { event: 'capsule/delivery.cancelled', match: 'data.capsuleId' },
    ],
    retries: 3,
  },
  async ({ event, step }: { event: { data: { capsuleId: string } }; step: InngestStep }) => {
    const { capsuleId } = event.data

    // Fetch capsule and verify it's still sealed
    const capsule = await step.run('fetch-capsule', async () => {
      await connectDB()
      return Capsule.findById(capsuleId).lean()
    })

    if (!capsule || capsule.status !== 'sealed') {
      return { skipped: true, reason: 'Capsule not found or not sealed', capsuleId }
    }

    // Fetch items (available for future email enrichment)
    await step.run('fetch-items', async () => {
      return CapsuleItem.find({ capsuleId }).sort({ order: 1 }).lean()
    })

    // Deliver to each recipient as independent steps (each step is retry-safe)
    for (const recipient of capsule.recipients) {
      if (recipient.status === 'delivered') continue

      await step.run(`send-${recipient.deliveryToken.slice(0, 8)}`, async () => {
        const openUrl = `${siteConfig.url}/open/${recipient.deliveryToken}`

        let emailMessageId: string | null = null
        let deliveryStatus: 'sent' | 'failed' = 'sent'
        let failureReason: string | null = null

        try {
          const result = await sendCapsuleDeliveryEmail({
            to:            recipient.email,
            recipientName: recipient.name,
            senderName:    'Someone who cares about you',
            capsuleTitle:  capsule.title,
            openUrl,
          })
          emailMessageId = result.id
        } catch (err) {
          deliveryStatus = 'failed'
          failureReason  = err instanceof Error ? err.message : 'Unknown error'
        }

        await DeliveryLog.create({
          capsuleId:      capsule._id,
          recipientEmail: recipient.email,
          recipientToken: recipient.deliveryToken,
          emailMessageId,
          status:         deliveryStatus,
          attemptCount:   1,
          lastAttemptAt:  new Date(),
          failureReason,
          schemaVersion:  1,
        })

        if (deliveryStatus === 'sent') {
          await Capsule.updateOne(
            { _id: capsule._id, 'recipients.deliveryToken': recipient.deliveryToken },
            {
              $set: {
                'recipients.$.status':      'delivered',
                'recipients.$.deliveredAt': new Date(),
              },
            },
          )
        } else {
          throw new Error(`Email failed for ${recipient.email}: ${failureReason}`)
        }
      })
    }

    await step.run('mark-delivered', async () => {
      // Re-fetch to pick up any recurrence changes made after the job started
      const latest = await Capsule.findById(capsuleId).select('scheduledFor settings').lean()
      if (!latest) return

      if (latest.settings.recurrence === 'once') {
        await Capsule.findByIdAndUpdate(capsuleId, { $set: { status: 'delivered' } })
        return
      }

      // Recurring: calculate next delivery date, then re-seal immediately
      const next = new Date(latest.scheduledFor)
      if (latest.settings.recurrence === 'monthly') {
        next.setMonth(next.getMonth() + 1)
      } else {
        next.setFullYear(next.getFullYear() + 1)
      }

      await Capsule.updateOne(
        { _id: capsuleId },
        {
          $set: {
            status:                      'sealed',
            scheduledFor:                next,
            sealedAt:                    new Date(),
            'recipients.$[].status':     'pending',
            'recipients.$[].deliveredAt': null,
            'recipients.$[].openedAt':   null,
          },
        },
      )

      await inngest.send({
        name: 'capsule/delivery.scheduled',
        data: { capsuleId },
        ts:   next.getTime(),
      })
    })

    return { delivered: true, capsuleId, recipientCount: capsule.recipients.length }
  },
)

// Minimal local type — avoids importing private Inngest internals
interface InngestStep {
  run<T>(id: string, fn: () => Promise<T>): Promise<T>
  sleepUntil(id: string, until: Date | string): Promise<null>
}
