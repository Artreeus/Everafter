'use server'

import { revalidatePath }   from 'next/cache'
import { z }                from 'zod'
import { connectDB }        from '@/lib/db/connection'
import { Capsule }          from '@/lib/db/models/Capsule.model'
import { User }             from '@/lib/db/models/User.model'
import { requireSession }   from '@/lib/auth/session'
import { getPlanLimits, PREMIUM_THEMES } from '@/lib/billing/plans'

const schema = z.object({
  title:         z.string().min(1, 'Title is required').max(120).trim(),
  theme:         z.enum(['classic', 'floral', 'midnight', 'golden', 'sakura', 'ocean', 'ember', 'velvet']),
  message:       z.string().max(600).optional(),
  scheduledDate: z.string().min(1, 'Date is required'),
  scheduledTime: z.string().default('09:00'),
  timezone:      z.string().min(1),
  notifyOnOpen:  z.boolean().default(true),
  allowReply:    z.boolean().default(false),
  recurrence:    z.enum(['once', 'monthly', 'annually']).default('once'),
})

export type UpdateCapsuleResult =
  | { success: true }
  | { success: false; error: string }

function buildScheduledDate(date: string, time: string, timezone: string): Date {
  const naive  = new Date(`${date}T${time}:00`)
  const utcStr = new Date(naive.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzStr  = new Date(naive.toLocaleString('en-US', { timeZone: timezone }))
  return new Date(naive.getTime() + (utcStr.getTime() - tzStr.getTime()))
}

export async function updateCapsuleAction(
  capsuleId: string,
  input: z.infer<typeof schema>,
): Promise<UpdateCapsuleResult> {
  const session = await requireSession()

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { success: false, error: first ?? 'Invalid data.' }
  }

  const { title, theme, message, scheduledDate, scheduledTime, timezone, notifyOnOpen, allowReply, recurrence } = parsed.data

  const scheduledFor = buildScheduledDate(scheduledDate, scheduledTime, timezone)
  if (scheduledFor <= new Date()) {
    return { success: false, error: 'Delivery date must be in the future.' }
  }

  await connectDB()

  const user = await User.findById(session.user.id).select('plan').lean()
  if (user) {
    const limits = getPlanLimits(user.plan)
    if (recurrence !== 'once' && !limits.recurring) {
      return { success: false, error: 'Recurring delivery is a Plus feature. Upgrade to enable it.' }
    }
    if (PREMIUM_THEMES.includes(theme as typeof PREMIUM_THEMES[number]) && !limits.premiumThemes) {
      return { success: false, error: 'Premium themes are a Plus feature. Upgrade to unlock all 8 themes.' }
    }
  }

  const capsule = await Capsule.findOne({ _id: capsuleId, authorId: session.user.id })
  if (!capsule) return { success: false, error: 'Capsule not found.' }
  if (capsule.status !== 'draft') return { success: false, error: 'Only draft capsules can be edited.' }

  await Capsule.updateOne(
    { _id: capsuleId },
    {
      $set: {
        title,
        theme,
        message:       message ?? null,
        scheduledFor,
        'settings.notifyOnOpen': notifyOnOpen,
        'settings.allowReply':   allowReply,
        'settings.recurrence':   recurrence,
      },
    },
  )

  revalidatePath(`/capsules/${capsuleId}`)
  revalidatePath(`/capsules/${capsuleId}/edit`)
  revalidatePath('/dashboard')

  return { success: true }
}
