'use server'

import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db/connection'
import { User } from '@/lib/db/models/User.model'
import { registerSchema, type RegisterInput } from '@/features/auth/schemas/auth.schema'
import { sendWelcomeEmail } from '@/features/notifications/lib/resend.service'
import { signIn } from '@/lib/auth/config'

export type RegisterResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Partial<Record<string, string[]>> }

export async function registerAction(data: RegisterInput): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check your details.',
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<Record<string, string[]>>,
    }
  }

  const { name, email, password } = parsed.data

  try {
    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await User.create({
      name,
      email,
      passwordHash,
      provider: 'credentials',
      plan: 'free',
      schemaVersion: 1,
    })

    // Fire-and-forget welcome email
    sendWelcomeEmail({ name, email }).catch(console.error)

    await signIn('credentials', { email, password, redirectTo: '/dashboard' })

    return { success: true }
  } catch (error: unknown) {
    // Re-throw Next.js redirects
    const isRedirect =
      error instanceof Error &&
      (error.message === 'NEXT_REDIRECT' || (error as { digest?: string }).digest?.startsWith('NEXT_REDIRECT'))
    if (isRedirect) throw error

    console.error('[registerAction]', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
