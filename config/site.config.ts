export const siteConfig = {
  name: 'Everafter',
  tagline: 'Some words deserve the perfect moment.',
  description:
    'Create beautiful time capsules for the people you love. Sealed today, delivered when it matters most.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ogImage: '/images/og.jpg',
  links: {
    twitter: 'https://twitter.com/everafterapp',
    github: 'https://github.com/everafterapp',
  },
} as const

export type SiteConfig = typeof siteConfig
