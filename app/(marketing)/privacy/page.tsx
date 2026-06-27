import type { Metadata } from 'next'
import { LegalDoc, type LegalSection } from '@/features/marketing/components/LegalDoc'

export const metadata: Metadata = {
  title:       'Privacy Policy — Everafter',
  description: 'How Everafter collects, uses, and protects your information.',
}

const SECTIONS: LegalSection[] = [
  {
    heading: 'The short version',
    body: [
      'Your capsules are private. We do not read them, sell them, or share their contents with anyone. We collect only what we need to run the service and deliver your capsules on time.',
      'This policy explains what we collect, why, and the choices you have. We have tried to write it in plain language.',
    ],
  },
  {
    heading: 'What we collect',
    body: [
      'Account information: your name, email address, and a securely hashed password when you create an account.',
      'Capsule content: the letters, photos, voice recordings, and memories you add. This content is stored so we can deliver it on your chosen date. We treat it as private and confidential.',
      'Recipient details: the names and email addresses you provide so we can deliver capsules to the people you choose.',
      'Usage data: basic technical information such as device and browser type, used to keep the service secure and reliable.',
    ],
  },
  {
    heading: 'How we use your information',
    body: [
      'To create and seal your capsules, and to deliver them to your recipients on the date you set.',
      'To send you essential account and delivery notifications. You can opt out of non-essential emails at any time from your settings or via the unsubscribe link in any email.',
      'To keep Everafter secure, prevent abuse, and improve the service.',
      'We do not use the contents of your capsules for advertising, and we never sell your personal information.',
    ],
  },
  {
    heading: 'Storage and security',
    body: [
      'Your data is stored with reputable infrastructure providers. Passwords are hashed and never stored in plain text. Media is uploaded through signed, private channels.',
      'No system is perfectly secure, but we take reasonable measures to protect your information and limit access to it.',
    ],
  },
  {
    heading: 'Sharing with third parties',
    body: [
      'We share data only with service providers that help us operate Everafter — for example, email delivery, media storage, and payment processing. These providers act on our instructions and may only use the data to provide their service to us.',
      'We may disclose information if required by law, or to protect the rights and safety of our users and the public.',
    ],
  },
  {
    heading: 'Your choices and rights',
    body: [
      'You can edit your profile, manage email preferences, and delete your account at any time from your settings.',
      'Deleting your account permanently removes your capsules, their contents, and your personal information from our active systems.',
      'Depending on where you live, you may have additional rights to access, correct, or export your data. Contact us and we will help.',
    ],
  },
  {
    heading: 'Children',
    body: [
      'Everafter is intended for people aged 16 and older. We do not knowingly collect personal information from children under that age.',
    ],
  },
  {
    heading: 'Changes to this policy',
    body: [
      'We may update this policy from time to time. If we make material changes, we will notify you by email or through the service. Continued use after changes means you accept the updated policy.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Privacy Policy"
      intro="Your capsules are yours. Here is exactly what we collect, why we collect it, and how we keep it safe."
      lastUpdated="June 2026"
      sections={SECTIONS}
    />
  )
}
