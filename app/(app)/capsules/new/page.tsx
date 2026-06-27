import type { Metadata }  from 'next'
import { requireSession } from '@/lib/auth/session'
import { connectDB }      from '@/lib/db/connection'
import { User }           from '@/lib/db/models/User.model'
import { CapsuleWizard }  from '@/features/capsules/components/creation/CapsuleWizard'

export const metadata: Metadata = { title: 'New Capsule' }

export default async function NewCapsulePage() {
  const session = await requireSession()
  await connectDB()

  const user = await User.findById(session.user.id).select('plan').lean()

  return <CapsuleWizard userPlan={user?.plan ?? 'free'} />
}
