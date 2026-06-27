'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/lib/auth/config'
import { loginSchema, type LoginInput } from '@/features/auth/schemas/auth.schema'

export type LoginResult =
  | { success: true }
  | { success: false; error: string }

export async function loginAction(data: LoginInput): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Please enter a valid email and password.' }
  }

  try {
    await signIn('credentials', {
      email:      parsed.data.email,
      password:   parsed.data.password,
      redirectTo: '/dashboard',
    })
    return { success: true }
  } catch (error: unknown) {
    // Re-throw Next.js redirects — signIn throws on success too
    const isRedirect =
      error instanceof Error &&
      (error.message === 'NEXT_REDIRECT' || (error as { digest?: string }).digest?.startsWith('NEXT_REDIRECT'))
    if (isRedirect) throw error

    if (error instanceof AuthError) {
      return { success: false, error: 'Invalid email or password.' }
    }

    console.error('[loginAction]', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function oauthLoginAction(provider: 'google' | 'github') {
  await signIn(provider, { redirectTo: '/dashboard' })
}
