import Link            from 'next/link'
import { Logo }         from '@/components/shared/Logo'
import { siteConfig }   from '@/config/site.config'
import { routes }       from '@/config/routes.config'

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: routes.howItWorks },
      { label: 'Pricing',      href: routes.pricing },
      { label: 'Create a capsule', href: routes.register },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',   href: routes.about },
      { label: 'Sign in', href: routes.login },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: routes.privacy },
      { label: 'Terms',   href: routes.terms },
    ],
  },
]

export function MarketingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone/50 bg-ivory">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* brand */}
          <div className="max-w-xs">
            <Logo size="md" />
            <p className="mt-4 text-sm text-warm-gray leading-relaxed">
              {siteConfig.tagline}
            </p>
            <Link
              href={routes.register}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal hover:text-warm-gray transition-colors"
            >
              Begin your first capsule →
            </Link>
          </div>

          {/* link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[10px] uppercase tracking-[0.18em] text-warm-gray/70 font-sans mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-charcoal/70 hover:text-charcoal transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-stone/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-warm-gray/60">
            © {year} Everafter. Made with care.
          </p>
          <p className="text-xs text-warm-gray/50 flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold/70" />
            Sealed today, delivered when it matters.
          </p>
        </div>
      </div>
    </footer>
  )
}
