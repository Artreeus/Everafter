export const routes = {
  home: '/',
  about: '/about',
  howItWorks: '/how-it-works',
  privacy: '/privacy',
  terms: '/terms',

  login: '/login',
  register: '/register',

  dashboard: '/dashboard',
  capsules: '/capsules',
  capsuleNew: '/capsules/new',
  capsule: (id: string) => `/capsules/${id}`,
  capsuleEdit: (id: string) => `/capsules/${id}/edit`,
  capsulePreview: (id: string) => `/capsules/${id}/preview`,

  pricing: '/pricing',

  settings: '/settings',

  open: (token: string) => `/open/${token}`,
} as const
