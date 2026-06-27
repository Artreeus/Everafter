import { requireGuest } from '@/lib/auth/session'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await requireGuest()

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Ambient gradient */}
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 30% 30%, rgba(196,165,90,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 70% 70%, rgba(201,160,160,0.06) 0%, transparent 60%)',
        }}
      />
      <div className="relative flex flex-1 items-center justify-center px-6 py-16">
        {children}
      </div>
    </div>
  )
}
