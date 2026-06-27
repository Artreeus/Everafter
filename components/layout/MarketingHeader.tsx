'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Logo } from '@/components/shared/Logo'
import { routes } from '@/config/routes.config'
import { cn } from '@/lib/utils/cn'
import { useEffect, useState } from 'react'

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-ivory/95 backdrop-blur-md border-b border-stone/40 shadow-soft'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo — adapts color based on scroll */}
          <Logo dark={scrolled} />

          <div className="flex items-center gap-5">
            <Link
              href={routes.pricing}
              className={cn(
                'text-sm font-medium transition-colors duration-200 hidden sm:block',
                scrolled ? 'text-warm-gray hover:text-charcoal' : 'text-ivory/60 hover:text-ivory',
              )}
            >
              Pricing
            </Link>
            <Link
              href={routes.login}
              className={cn(
                'text-sm font-medium transition-colors duration-200 hidden sm:block',
                scrolled ? 'text-warm-gray hover:text-charcoal' : 'text-ivory/60 hover:text-ivory',
              )}
            >
              Sign in
            </Link>
            <Link
              href={routes.register}
              className={cn(
                'text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
                scrolled
                  ? 'bg-charcoal text-ivory hover:bg-dark'
                  : 'bg-ivory text-charcoal hover:bg-stone',
              )}
            >
              Begin
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
