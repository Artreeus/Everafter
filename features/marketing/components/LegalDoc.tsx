import { PageHero } from './PageHero'

export interface LegalSection {
  heading: string
  body:    string[]
}

interface LegalDocProps {
  eyebrow:     string
  title:       string
  intro:       string
  lastUpdated: string
  sections:    LegalSection[]
}

export function LegalDoc({ eyebrow, title, intro, lastUpdated, sections }: LegalDocProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={intro} />

      <section className="py-24 md:py-28 px-6 bg-ivory">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs text-warm-gray/70 font-sans mb-12 pb-6 border-b border-stone/60">
            Last updated: {lastUpdated}
          </p>

          <div className="space-y-12">
            {sections.map((s, i) => (
              <div key={s.heading}>
                <h2 className="font-display text-xl text-charcoal mb-4 flex items-baseline gap-3">
                  <span className="text-sm text-gold/70 font-sans tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {s.heading}
                </h2>
                <div className="space-y-4 pl-9">
                  {s.body.map((p, j) => (
                    <p key={j} className="font-sans text-[15px] text-charcoal/65 leading-[1.8]">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-stone/60">
            <p className="text-xs text-warm-gray/70 font-sans leading-relaxed">
              Questions about this document? Reach us at{' '}
              <a href="mailto:hello@everafter.app" className="text-charcoal underline underline-offset-2 decoration-stone hover:decoration-charcoal transition-colors">
                hello@everafter.app
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
