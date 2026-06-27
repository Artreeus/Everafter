'use server'

import { revalidatePath }  from 'next/cache'
import { z }               from 'zod'
import { connectDB }       from '@/lib/db/connection'
import { User }            from '@/lib/db/models/User.model'
import { requireSession }  from '@/lib/auth/session'

const schema = z.object({
  name:               z.string().min(1, 'Name is required').max(60).trim(),
  emailNotifications: z.boolean(),
})

export type UpdateProfileResult =
  | { success: true }
  | { success: false; error: string }

export async function updateProfileAction(
  data: { name: string; emailNotifications: boolean },
): Promise<UpdateProfileResult> {
  const session = await requireSession()

  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors.name?.[0] ?? 'Invalid data.' }
  }

  try {
    await connectDB()
    await User.findByIdAndUpdate(session.user.id, {
      $set: {
        name: parsed.data.name,
        'preferences.emailNotifications': parsed.data.emailNotifications,
      },
    })
    revalidatePath('/settings')
    revalidatePath('/dashboard')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update profile.' }
  }
}
