'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Settings, Plus, LogOut, Menu, X, Zap } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { logoutAction } from '@/features/auth/actions/logout.action'
import { cn } from '@/lib/utils/cn'
import { useState } from 'react'

interface AppSidebarProps {
  userName:  string
  userEmail: string
  plan:      'free' | 'plus'
  capsuleCount: number
}

const NAV = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/settings',  label: 'Settings',  Icon: Settings },
]

export function AppSidebar({ userName, userEmail, plan, capsuleCount }: AppSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavLinks = () => (
    <nav className="flex-1 px-3 py-2 space-y-0.5">
      {NAV.map(({ href, label, Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150',
              active
                ? 'bg-charcoal text-ivory font-medium'
                : 'text-warm-gray hover:bg-stone/60 hover:text-charcoal',
            )}
          >
            <Icon size={16} />
            <span>{label}</span>
            {label === 'Dashboard' && capsuleCount > 0 && (
              <span className={cn(
                'ml-auto text-[10px] font-medium rounded-full px-1.5 py-0.5 min-w-[20px] text-center',
                active ? 'bg-ivory/20 text-ivory' : 'bg-stone text-warm-gray',
              )}>
                {capsuleCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )

  const NewCapsuleBtn = () => (
    <div className="px-3 py-2">
      <Link
        href="/capsules/new"
        onClick={() => setMobileOpen(false)}
        className="flex items-center justify-center gap-2 w-full rounded-xl border border-stone bg-ivory px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-stone/50 hover:border-warm-gray/40 transition-all duration-150 shadow-soft"
      >
        <Plus size={15} />
        New capsule
      </Link>
    </div>
  )

  const UserFooter = () => (
    <div className="px-3 py-3 border-t border-stone/60">
      <div className="flex items-center gap-3 px-2 mb-2">
        <div className="h-8 w-8 rounded-full bg-charcoal flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-ivory">{userName.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-charcoal truncate">{userName}</p>
          <p className="text-[11px] text-warm-gray truncate">{userEmail}</p>
        </div>
        {plan === 'plus' && (
          <span className="text-[10px] uppercase tracking-wider text-gold font-medium border border-gold/30 rounded-full px-1.5 py-0.5">
            Plus
          </span>
        )}
      </div>
      {plan === 'free' && (
        <Link
          href="/settings/billing"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 mx-2 mb-1.5 rounded-lg bg-gold/10 border border-gold/20 px-3 py-2 text-xs text-gold hover:bg-gold/15 transition-colors"
        >
          <Zap size={11} />
          Upgrade to Plus
        </Link>
      )}
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs text-warm-gray hover:text-charcoal hover:bg-stone/40 transition-colors"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </form>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 bg-ivory border-r border-stone/60 z-30">
        <div className="px-5 py-5 border-b border-stone/40">
          <Logo size="md" />
        </div>
        <NewCapsuleBtn />
        <NavLinks />
        <UserFooter />
      </aside>

      {/* ── Mobile header ──────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-ivory/95 backdrop-blur-sm border-b border-stone/50 px-4 py-3">
        <Logo size="sm" />
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-warm-gray hover:text-charcoal transition-colors rounded-lg hover:bg-stone/40"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ── Mobile drawer ──────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-charcoal/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-ivory border-r border-stone/60"
            >
              <div className="px-5 py-5 border-b border-stone/40 flex items-center justify-between">
                <Logo size="md" />
                <button onClick={() => setMobileOpen(false)} className="p-1.5 text-warm-gray hover:text-charcoal rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <NewCapsuleBtn />
              <NavLinks />
              <UserFooter />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
