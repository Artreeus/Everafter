import type { Metadata } from 'next'
import { HeroSection }      from '@/features/marketing/components/HeroSection'
import { HowItWorksSection } from '@/features/marketing/components/HowItWorksSection'
import { UseCasesSection }  from '@/features/marketing/components/UseCasesSection'
import { ClosingSection }   from '@/features/marketing/components/ClosingSection'
import { siteConfig }       from '@/config/site.config'

export const metadata: Metadata = {
  title:       `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
}

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <UseCasesSection />
      <ClosingSection />
    </>
  )
}
