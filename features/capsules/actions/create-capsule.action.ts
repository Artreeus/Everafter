'use server'

import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db/connection'
import { Capsule } from '@/lib/db/models/Capsule.model'
import { CapsuleItem } from '@/lib/db/models/CapsuleItem.model'
import { User } from '@/lib/db/models/User.model'
import { requireSession } from '@/lib/auth/session'
import { createCapsuleSchema, type CapsuleItemPayload } from '@/features/capsules/schemas/capsule.schema'
import { generateDeliveryToken } from '@/lib/utils/tokens'
import type { WizardState } from '@/types/capsule.types'
import { getPlanLimits, PREMIUM_THEMES } from '@/lib/billing/plans'

export type CreateCapsuleResult =
  | { success: true;  capsuleId: string }
  | { success: false; error: string }

function buildScheduledDate(date: string, time: string, timezone: string): Date {
  // Build date-time string in the author's timezone
  const dateTimeStr = `${date}T${time}:00`
  // Use Intl to get the UTC offset for this timezone at this datetime
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  })
  // Parse naively: create a Date treating the input as local, then adjust
  const naive = new Date(dateTimeStr)
  const utcStr = new Date(naive.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzStr  = new Date(naive.toLocaleString('en-US', { timeZone: timezone }))
  const offset = utcStr.getTime() - tzStr.getTime()
  return new Date(naive.getTime() + offset)
}

export async function createCapsuleAction(
  state: WizardState,
  items: CapsuleItemPayload[],
): Promise<CreateCapsuleResult> {
  const session = await requireSession()

  const parsed = createCapsuleSchema.safeParse({
    title:         state.title,
    theme:         state.theme,
    message:       state.message,
    recipients:    state.recipients,
    scheduledDate: state.scheduledDate,
    scheduledTime: state.scheduledTime,
    timezone:      state.timezone,
    notifyOnOpen:  state.notifyOnOpen,
    allowReply:    state.allowReply,
    recurrence:    state.recurrence,
  })

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { success: false, error: firstError ?? 'Invalid capsule data.' }
  }

  const { title, theme, message, recipients, scheduledDate, scheduledTime, timezone, notifyOnOpen, allowReply, recurrence } =
    parsed.data

  const scheduledFor = buildScheduledDate(scheduledDate, scheduledTime, timezone)

  if (scheduledFor <= new Date()) {
    return { success: false, error: 'Delivery date must be in the future.' }
  }

  try {
    await connectDB()

    const authorId = session.user.id

    // Enforce plan limits
    const user = await User.findById(authorId).select('plan capsuleCount').lean()
    if (!user) return { success: false, error: 'User not found.' }

    const limits = getPlanLimits(user.plan)
    if (user.capsuleCount >= limits.maxCapsules) {
      return {
        success: false,
        error: `Free plan is limited to ${limits.maxCapsules} capsules. Upgrade to Plus for unlimited.`,
      }
    }
    if (parsed.data.recipients.length > limits.maxRecipients) {
      return {
        success: false,
        error: `Free plan allows up to ${limits.maxRecipients} recipients. Upgrade to Plus for up to 10.`,
      }
    }
    if (parsed.data.recurrence !== 'once' && !limits.recurring) {
      return {
        success: false,
        error: 'Recurring delivery is a Plus feature. Upgrade to enable it.',
      }
    }
    if (PREMIUM_THEMES.includes(parsed.data.theme as typeof PREMIUM_THEMES[number]) && !limits.premiumThemes) {
      return {
        success: false,
        error: 'Premium themes are a Plus feature. Upgrade to unlock all 8 themes.',
      }
    }

    const capsule = await Capsule.create({
      authorId,
      title,
      theme,
      message:  message ?? null,
      status:   'draft',
      scheduledFor,
      recipients: recipients.map((r) => ({
        name:          r.name,
        email:         r.email,
        deliveryToken: generateDeliveryToken(),
        status:        'pending',
      })),
      settings: {
        notifyOnOpen,
        allowReply,
        selfDestruct: false,
        recurrence,
      },
      schemaVersion: 1,
    })

    if (items.length > 0) {
      const itemDocs = items.map((item, index) => ({
        capsuleId:     capsule._id,
        authorId,
        type:          item.type,
        order:         item.order ?? index,
        content:       item.content ?? null,
        contentFormat: item.contentFormat ?? 'plain',
        media:         item.media ?? null,
        metadata: {
          caption: item.caption ?? null,
          takenAt: null,
        },
        schemaVersion: 1,
      }))
      await CapsuleItem.insertMany(itemDocs)
    }

    // Increment denormalized count
    await User.findByIdAndUpdate(authorId, { $inc: { capsuleCount: 1 } })

    return { success: true, capsuleId: capsule._id.toString() }
  } catch (error) {
    console.error('[createCapsuleAction]', error)
    return { success: false, error: 'Failed to save capsule. Please try again.' }
  }
}
