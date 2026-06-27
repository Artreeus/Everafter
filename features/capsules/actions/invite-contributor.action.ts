'use server'

import { z }                   from 'zod'
import { connectDB }           from '@/lib/db/connection'
import { Capsule }             from '@/lib/db/models/Capsule.model'
import { CapsuleContributor }  from '@/lib/db/models/CapsuleContributor.model'
import { User }                from '@/lib/db/models/User.model'
import { requireSession }      from '@/lib/auth/session'
import { generateDeliveryToken } from '@/lib/utils/tokens'
import { sendContributorInviteEmail } from '@/features/notifications/lib/resend.service'
import { siteConfig }          from '@/config/site.config'
import { getPlanLimits }       from '@/lib/billing/plans'

const schema = z.object({
  name:  z.string().min(1, 'Name is required').max(100).trim(),
  email: z.string().email('Invalid email').toLowerCase(),
})

export interface AddedContributor {
  id:     string
  name:   string
  email:  string
  status: 'pending'
}

export type InviteContributorResult =
  | { success: true;  contributor: AddedContributor }
  | { success: false; error: string }

export async function inviteContributorAction(
  capsuleId: string,
  name: string,
  email: string,
): Promise<InviteContributorResult> {
  const session = await requireSession()

  const parsed = schema.safeParse({ name, email })
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { success: false, error: first ?? 'Invalid input.' }
  }

  await connectDB()

  const author = await User.findById(session.user.id).select('plan name').lean()
  if (!author) return { success: false, error: 'User not found.' }

  const limits = getPlanLimits(author.plan)
  if (!limits.contributors) {
    return { success: false, error: 'Contributor invites are a Plus feature. Upgrade to enable group capsules.' }
  }

  const capsule = await Capsule.findOne({ _id: capsuleId, authorId: session.user.id }).lean()
  if (!capsule) return { success: false, error: 'Capsule not found.' }
  if (capsule.status !== 'draft') return { success: false, error: 'Only draft capsules accept contributors.' }

  const existing = await CapsuleContributor.findOne({ capsuleId, email: parsed.data.email }).lean()
  if (existing) return { success: false, error: 'This person has already been invited.' }

  const count = await CapsuleContributor.countDocuments({ capsuleId })
  if (count >= 10) return { success: false, error: 'Maximum of 10 contributors per capsule.' }

  const inviteToken = generateDeliveryToken()
  const contributor = await CapsuleContributor.create({
    capsuleId,
    name:  parsed.data.name,
    email: parsed.data.email,
    inviteToken,
    status: 'pending',
  })

  void sendContributorInviteEmail({
    to:           parsed.data.email,
    toName:       parsed.data.name,
    authorName:   author.name ?? 'Someone',
    capsuleTitle: capsule.title,
    contributeUrl: `${siteConfig.url}/contribute/${inviteToken}`,
  }).catch((err) => console.error('[inviteContributor] email failed:', err))

  return {
    success: true,
    contributor: {
      id:     contributor._id.toString(),
      name:   contributor.name,
      email:  contributor.email,
      status: 'pending',
    },
  }
}
