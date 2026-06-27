import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'
import { cn } from '@/lib/utils/cn'

interface AuthCardProps {
  title:       string
  description?: string
  children:    React.ReactNode
  footer?:     React.ReactNode
  className?:  string
}

export function AuthCard({ title, description, children, footer, className }: AuthCardProps) {
  return (
    <div className={cn('w-full max-w-md', className)}>
      {/* Logo */}
      <div className="mb-10 text-center">
        <Logo href="/" size="md" />
      </div>

      {/* Card */}
      <div
        className="rounded-xl bg-cream px-8 py-10"
        style={{ boxShadow: 'var(--shadow-float)' }}
      >
        <div className="mb-8">
          <h1 className="font-display text-2xl font-light text-charcoal tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-warm-gray leading-relaxed">{description}</p>
          )}
        </div>

        {children}
      </div>

      {footer && (
        <div className="mt-6 text-center text-sm text-warm-gray">
          {footer}
        </div>
      )}
    </div>
  )
}

interface AuthLinkProps {
  href:     string
  children: React.ReactNode
}

export function AuthLink({ href, children }: AuthLinkProps) {
  return (
    <Link
      href={href}
      className="font-medium text-charcoal hover:text-warm-gray underline-offset-4 hover:underline transition-colors duration-200"
    >
      {children}
    </Link>
  )
}
