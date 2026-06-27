import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'
import { siteConfig } from '@/config/site.config'

export function MarketingFooter() {
  return (
    <footer className="border-t border-stone/50 bg-ivory">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <Logo size="sm" />
            <p className="mt-2 text-xs text-warm-gray max-w-xs leading-relaxed">
              {siteConfig.tagline}
            </p>
          </div>

          <nav className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            {[
              { label: 'How it works', href: '/how-it-works' },
              { label: 'About', href: '/about' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-warm-gray hover:text-charcoal transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-stone/40">
          <p className="text-xs text-warm-gray/60 text-center">
            © {new Date().getFullYear()} Everafter. Made with care.
          </p>
        </div>
      </div>
    </footer>
  )
}
