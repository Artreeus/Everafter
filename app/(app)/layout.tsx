import { requireSession } from '@/lib/auth/session'
import { AppSidebar }     from '@/components/layout/AppSidebar'
import { connectDB }      from '@/lib/db/connection'
import { User }           from '@/lib/db/models/User.model'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()

  await connectDB()
  const user = await User.findById(session.user.id)
    .select('name email plan capsuleCount')
    .lean()

  return (
    <div className="min-h-screen bg-ivory">
      <AppSidebar
        userName={user?.name ?? session.user.name ?? 'User'}
        userEmail={user?.email ?? session.user.email ?? ''}
        plan={(user?.plan as 'free' | 'plus') ?? 'free'}
        capsuleCount={user?.capsuleCount ?? 0}
      />
      <main className="lg:pl-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}
