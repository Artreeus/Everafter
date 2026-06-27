'use client'

import { motion }   from 'framer-motion'
import Link         from 'next/link'
import { PenLine, Image as ImageIcon, Mic, BookOpen, Sparkles, ArrowRight } from 'lucide-react'
import { routes }   from '@/config/routes.config'

const CONTENT = [
  { Icon: PenLine,  title: 'Letters',  body: 'A rich writing canvas for the things you mean to say. As long or as short as the feeling.' },
  { Icon: ImageIcon, title: 'Photos',   body: 'Up to a dozen images per capsule — the trip, the face, the day you never want to forget.' },
  { Icon: Mic,      title: 'Voice',    body: 'Record a message in your own voice. Years later, it still sounds exactly like you.' },
  { Icon: BookOpen, title: 'Memories', body: 'Pin a single moment in time — a date, a place, a few lines about why it mattered.' },
]

// premium = Plus-only themes
const THEMES = [
  { name: 'Classic',  swatch: '#F5EFE6', ring: '#C4A55A', dark: false },
  { name: 'Floral',   swatch: '#F7EEF0', ring: '#C98CA0', dark: false },
  { name: 'Midnight', swatch: '#1A1A2E', ring: '#4A4A7A', dark: true  },
  { name: 'Golden',   swatch: '#F6EFDD', ring: '#C4A55A', dark: false },
  { name: 'Sakura',   swatch: '#FFF0F5', ring: '#D4789A', dark: false, premium: true },
  { name: 'Ocean',    swatch: '#E8F4F6', ring: '#2A8FA0', dark: false, premium: true },
  { name: 'Ember',    swatch: '#FDF2EC', ring: '#C4673A', dark: false, premium: true },
  { name: 'Velvet',   swatch: '#1C1228', ring: '#8B5CF6', dark: true,  premium: true },
]

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: 'easeOut' as const },
  }),
}

export function FeaturesSection() {
  return (
    <section className="relative py-28 md:py-36 px-6 bg-cream overflow-hidden">
      <div className="relative mx-auto max-w-6xl">

        {/* heading */}
        <motion.div
          variants={fade} custom={0}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="max-w-2xl mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-gold/45" />
            <span className="text-[10px] text-warm-gray uppercase tracking-[0.22em] font-sans">What goes inside</span>
          </div>
          <h2 className="font-display font-light text-charcoal text-balance mb-5" style={{ fontSize: 'clamp(2rem, 4.2vw, 3.1rem)' }}>
            Everything worth keeping,<br className="hidden sm:block" /> sealed in one place.
          </h2>
          <p className="font-sans text-charcoal/55 leading-[1.75] text-base max-w-xl">
            A capsule isn&rsquo;t just a note. Layer words, images, your voice and the memories
            behind them into a single keepsake that opens when the time is right.
          </p>
        </motion.div>

        {/* content type grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {CONTENT.map((c, i) => (
            <motion.div
              key={c.title}
              variants={fade} custom={i + 1}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
              className="group rounded-2xl border border-stone/70 bg-ivory p-7 transition-all duration-300 hover:border-gold/40 hover:shadow-card"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-charcoal/[0.04] text-charcoal transition-colors duration-300 group-hover:bg-gold/12 group-hover:text-gold">
                <c.Icon size={18} strokeWidth={1.6} />
              </div>
              <h3 className="font-display text-lg text-charcoal mb-2">{c.title}</h3>
              <p className="font-sans text-[13px] text-charcoal/55 leading-[1.65]">{c.body}</p>
            </motion.div>
          ))}
        </div>

        {/* themes showcase */}
        <motion.div
          variants={fade} custom={0}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="rounded-3xl border border-stone/70 bg-ivory p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={13} className="text-gold" />
                <span className="text-[10px] text-warm-gray uppercase tracking-[0.22em] font-sans">Eight themes</span>
              </div>
              <h3 className="font-display font-light text-charcoal" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)' }}>
                Dress every capsule to match the moment.
              </h3>
            </div>
            <Link
              href={routes.pricing}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors whitespace-nowrap"
            >
              See what Plus unlocks
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {THEMES.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fade} custom={i}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                className="flex flex-col items-center gap-2.5"
              >
                <div
                  className="relative h-16 w-full rounded-xl border shadow-soft overflow-hidden"
                  style={{ background: t.swatch, borderColor: `${t.ring}55` }}
                >
                  {/* accent dot */}
                  <span className="absolute bottom-2 left-2 h-2 w-2 rounded-full" style={{ background: t.ring }} />
                  {t.premium && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold/90">
                      <Sparkles size={8} className="text-charcoal" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-sans text-charcoal/60">{t.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
