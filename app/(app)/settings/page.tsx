import type { Metadata }    from 'next'
import Link                 from 'next/link'
import { ChevronRight, Zap } from 'lucide-react'
import { requireSession }   from '@/lib/auth/session'
import { connectDB }        from '@/lib/db/connection'
import { User }             from '@/lib/db/models/User.model'
import { ProfileForm }          from '@/features/user/components/ProfileForm'
import { DeleteAccountButton }  from '@/features/user/components/DeleteAccountButton'
import { logoutAction }         from '@/features/auth/actions/logout.action'

export const metadata: Metadata = { title: 'Settings — Everafter' }

export default async function SettingsPage() {
  const session = await requireSession()
  await connectDB()

  const user = await User.findById(session.user.id)
    .select('name email plan capsuleCount preferences createdAt')
    .lean()

  if (!user) return null

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-sans uppercase tracking-[0.18em] text-warm-gray mb-1.5">
          Account
        </p>
        <h1 className="font-display text-3xl font-light text-charcoal">Settings</h1>
      </div>

      <div className="space-y-8">
        {/* Profile section */}
        <Section title="Profile">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-charcoal flex items-center justify-center flex-shrink-0">
              <span className="text-base font-medium text-ivory">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">{user.email}</p>
              <p className="text-xs text-warm-gray capitalize">
                {user.plan} plan · {user.capsuleCount} capsule{user.capsuleCount !== 1 ? 's' : ''} created
              </p>
            </div>
          </div>
          <ProfileForm
            name={user.name}
            emailNotifications={user.preferences?.emailNotifications ?? true}
          />
        </Section>

        {/* Account section */}
        <Section title="Account">
          <div className="space-y-3">
            <div className="rounded-lg border border-stone/50 bg-cream px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal">Email address</p>
                <p className="text-xs text-warm-gray">{user.email}</p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-warm-gray/50 border border-stone rounded-full px-2 py-0.5">
                Read-only
              </span>
            </div>
          </div>
        </Section>

        {/* Billing section */}
        <Section title="Billing">
          <Link
            href="/settings/billing"
            className="flex items-center justify-between rounded-lg border border-stone/50 bg-cream px-4 py-3 hover:border-warm-gray/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {user.plan === 'plus' ? (
                <Zap size={14} className="text-gold" />
              ) : null}
              <div>
                <p className="text-sm font-medium text-charcoal capitalize">
                  {user.plan === 'plus' ? 'Everafter Plus' : 'Free plan'}
                </p>
                <p className="text-xs text-warm-gray">
                  {user.plan === 'free' ? 'Upgrade to unlock all features' : 'Manage your subscription'}
                </p>
              </div>
            </div>
            <ChevronRight size={14} className="text-warm-gray group-hover:text-charcoal transition-colors" />
          </Link>
        </Section>

        {/* Sign out */}
        <Section title="Sign out" subtle>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-stone px-4 py-2.5 text-sm text-warm-gray hover:text-charcoal hover:border-warm-gray/50 transition-colors"
            >
              Sign out of Everafter
            </button>
          </form>
        </Section>

        {/* Danger zone */}
        <Section title="Danger zone" subtle>
          <p className="text-xs text-warm-gray mb-4 leading-relaxed">
            Permanently delete your account and all capsules. This action cannot be undone.
          </p>
          <DeleteAccountButton />
        </Section>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
  subtle,
}: {
  title: string
  children: React.ReactNode
  subtle?: boolean
}) {
  return (
    <div className="rounded-2xl border border-stone/50 bg-white overflow-hidden">
      <div className={`px-6 py-4 border-b border-stone/40 ${subtle ? 'bg-ivory' : 'bg-ivory'}`}>
        <h2 className="text-sm font-medium text-charcoal">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}
