'use server'

import { connectDB } from '@/lib/db/connection'
import { User }      from '@/lib/db/models/User.model'

export type UnsubscribeResult =
  | { success: true;  alreadyUnsubscribed: boolean }
  | { success: false; error: string }

export async function unsubscribeEmailAction(token: string): Promise<UnsubscribeResult> {
  if (!token || token.length < 10) return { success: false, error: 'Invalid unsubscribe link.' }

  await connectDB()

  const user = await User.findOne({ unsubscribeToken: token })
    .select('preferences')
    .lean()

  if (!user) return { success: false, error: 'Unsubscribe link not found or already used.' }

  if (!user.preferences?.emailNotifications) {
    return { success: true, alreadyUnsubscribed: true }
  }

  await User.updateOne(
    { unsubscribeToken: token },
    { $set: { 'preferences.emailNotifications': false } },
  )

  return { success: true, alreadyUnsubscribed: false }
}
