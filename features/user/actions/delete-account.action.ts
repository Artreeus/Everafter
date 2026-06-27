'use server'

import { redirect }       from 'next/navigation'
import { connectDB }      from '@/lib/db/connection'
import { User }           from '@/lib/db/models/User.model'
import { Capsule }        from '@/lib/db/models/Capsule.model'
import { CapsuleItem }    from '@/lib/db/models/CapsuleItem.model'
import { CapsuleReply }   from '@/lib/db/models/CapsuleReply.model'
import { CapsuleContributor } from '@/lib/db/models/CapsuleContributor.model'
import { DeliveryLog }    from '@/lib/db/models/DeliveryLog.model'
import { requireSession } from '@/lib/auth/session'
import { signOut }        from '@/lib/auth/config'
import { getStripe }      from '@/lib/stripe/client'

export type DeleteAccountResult =
  | { success: true }
  | { success: false; error: string }

export async function deleteAccountAction(): Promise<DeleteAccountResult> {
  const session = await requireSession()
  const userId  = session.user.id

  try {
    await connectDB()

    const user = await User.findById(userId)
      .select('stripeSubscriptionId')
      .lean()

    if (!user) return { success: false, error: 'Account not found.' }

    // Cancel active Stripe subscription if exists
    if (user.stripeSubscriptionId) {
      try {
        await getStripe().subscriptions.cancel(user.stripeSubscriptionId)
      } catch (err) {
        console.warn('[deleteAccount] Stripe cancel failed — continuing:', err)
      }
    }

    // Collect all capsule IDs owned by this user
    const capsules = await Capsule.find({ authorId: userId }).select('_id').lean()
    const capsuleIds = capsules.map((c) => c._id)

    // Delete all related documents
    await Promise.all([
      CapsuleItem.deleteMany({ capsuleId: { $in: capsuleIds } }),
      CapsuleReply.deleteMany({ capsuleId: { $in: capsuleIds } }),
      CapsuleContributor.deleteMany({ capsuleId: { $in: capsuleIds } }),
      DeliveryLog.deleteMany({ capsuleId: { $in: capsuleIds } }),
    ])

    await Capsule.deleteMany({ authorId: userId })
    await User.findByIdAndDelete(userId)

  } catch (error) {
    console.error('[deleteAccountAction]', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  await signOut({ redirectTo: '/?deleted=1' })

  // signOut throws a redirect — this line is unreachable but satisfies TS
  redirect('/')
}
