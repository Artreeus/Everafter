'use client'

import Link from 'next/link'
import { FadeIn } from '@/components/animations'
import { routes } from '@/config/routes.config'
import { ArrowRight } from 'lucide-react'

export function ClosingSection() {
  return (
    <section className="py-28 md:py-40 px-6 bg-ivory relative overflow-hidden">
      {/* Ambient gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(196,165,90,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <FadeIn inView>
          <p className="text-xs font-sans tracking-[0.2em] uppercase text-warm-gray mb-6">
            Begin
          </p>
          <h2
            className="font-display font-light text-charcoal text-balance mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}
          >
            The words you mean to say.
            <br />
            <span className="text-rose">Say them now.</span>
          </h2>
          <p className="font-sans text-charcoal/50 leading-relaxed mb-10 text-base">
            Some moments only come once.
            <br className="hidden sm:block" />
            Don&apos;t leave them unsaid.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={routes.register}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-charcoal px-8 py-3.5 text-sm font-semibold text-ivory transition-all duration-200 hover:bg-dark hover:shadow-float"
            >
              Create your first capsule — it&apos;s free
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <p className="mt-6 text-xs text-warm-gray/50 font-sans">
            No credit card required · Free forever for the basics
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
