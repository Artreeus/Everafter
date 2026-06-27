import type { Metadata } from 'next'
import { LegalDoc, type LegalSection } from '@/features/marketing/components/LegalDoc'

export const metadata: Metadata = {
  title:       'Terms of Service — Everafter',
  description: 'The terms that govern your use of Everafter.',
}

const SECTIONS: LegalSection[] = [
  {
    heading: 'Agreement to terms',
    body: [
      'By creating an account or using Everafter, you agree to these Terms of Service. If you do not agree, please do not use the service.',
      'These terms are a binding agreement between you and Everafter.',
    ],
  },
  {
    heading: 'Using Everafter',
    body: [
      'You must be at least 16 years old to use Everafter. You are responsible for the activity on your account and for keeping your password secure.',
      'You agree to provide accurate information, including valid recipient email addresses, so that we can deliver your capsules as intended.',
    ],
  },
  {
    heading: 'Your content',
    body: [
      'You retain ownership of everything you put into a capsule — your letters, photos, recordings, and memories. We do not claim ownership of your content.',
      'You grant us a limited licence to store, process, and deliver your content solely for the purpose of operating the service and delivering your capsules to the recipients you choose.',
      'You are responsible for the content you create, and you agree not to upload anything unlawful, harmful, infringing, or that violates the rights of others.',
    ],
  },
  {
    heading: 'Delivery',
    body: [
      'We take great care to deliver capsules on the dates you choose. However, delivery depends on factors outside our full control, including email providers and recipient inboxes.',
      'We cannot guarantee that every delivery will arrive exactly on time or be successfully received, and we are not liable for delays or failures caused by third parties or incorrect recipient details.',
    ],
  },
  {
    heading: 'Plans and payment',
    body: [
      'Everafter offers a free plan and a paid Plus plan. Paid plans are billed in advance on a recurring basis through our payment processor.',
      'You can cancel at any time; your plan remains active until the end of the current billing period. Except where required by law, payments are non-refundable.',
      'We may change our pricing, but we will give you reasonable notice before changes affect you.',
    ],
  },
  {
    heading: 'Acceptable use',
    body: [
      'You agree not to misuse the service — including attempting to access other users’ capsules, disrupting the service, or using it to send spam, harassment, or illegal material.',
      'We may suspend or terminate accounts that violate these terms or put the service or other users at risk.',
    ],
  },
  {
    heading: 'Availability and changes',
    body: [
      'We work hard to keep Everafter available and reliable, but the service is provided "as is" without warranties of any kind. We may modify, suspend, or discontinue features over time.',
      'To the fullest extent permitted by law, Everafter is not liable for indirect, incidental, or consequential damages arising from your use of the service.',
    ],
  },
  {
    heading: 'Termination',
    body: [
      'You may delete your account at any time from your settings. Doing so permanently removes your capsules and their contents.',
      'We may terminate or suspend access if you breach these terms. Provisions that by their nature should survive termination will continue to apply.',
    ],
  },
  {
    heading: 'Changes to these terms',
    body: [
      'We may update these terms from time to time. If we make material changes, we will notify you. Continued use of Everafter after changes take effect means you accept the revised terms.',
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Terms of Service"
      intro="The plain-language terms that govern your use of Everafter. Please read them carefully."
      lastUpdated="June 2026"
      sections={SECTIONS}
    />
  )
}
