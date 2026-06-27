import type { ReactNode } from 'react'

interface PageHeroProps {
  eyebrow:    string
  title:      ReactNode
  subtitle?:  string
}

/**
 * Dark hero band for standalone marketing pages.
 * The fixed MarketingHeader renders ivory text when unscrolled, so content
 * pages open on charcoal to keep the nav legible and the brand consistent.
 */
export function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative bg-charcoal overflow-hidden px-6 pt-36 pb-20 md:pt-44 md:pb-24">
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(196,165,90,0.10) 0%, transparent 62%)',
        }} />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-8 bg-gold/45" />
          <span className="text-[10px] text-gold/55 uppercase tracking-[0.22em] font-sans">{eyebrow}</span>
          <div className="h-px w-8 bg-gold/45" />
        </div>
        <h1 className="font-display font-light text-ivory text-balance leading-[1.08]" style={{ fontSize: 'clamp(2.3rem, 5.5vw, 4rem)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 font-sans text-ivory/50 leading-[1.75] mx-auto max-w-xl" style={{ fontSize: '1.05rem' }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
