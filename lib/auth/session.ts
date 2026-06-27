import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { routes } from '@/config/routes.config'

export async function requireSession() {
  const session = await auth()
  if (!session?.user?.id) redirect(routes.login)
  return session
}

export async function requireGuest() {
  const session = await auth()
  if (session?.user?.id) redirect(routes.dashboard)
}

export async function getSession() {
  return auth()
}
