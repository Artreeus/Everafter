export const PREMIUM_THEMES = ['sakura', 'ocean', 'ember', 'velvet'] as const
export type PremiumTheme = typeof PREMIUM_THEMES[number]

export const PLAN_LIMITS = {
  free: {
    maxCapsules:   3,
    maxRecipients: 3,
    contributors:  false,
    recurring:     false,
    premiumThemes: false,
  },
  plus: {
    maxCapsules:   Infinity,
    maxRecipients: 10,
    contributors:  true,
    recurring:     true,
    premiumThemes: true,
  },
} as const

export type Plan = keyof typeof PLAN_LIMITS

export const PLUS_MONTHLY_PRICE_ID = process.env.STRIPE_PLUS_MONTHLY_PRICE_ID ?? ''
export const PLUS_YEARLY_PRICE_ID  = process.env.STRIPE_PLUS_YEARLY_PRICE_ID  ?? ''
export const PLUS_MONTHLY_PRICE    = 8   // USD
export const PLUS_YEARLY_PRICE     = 60  // USD

export function getPlanLimits(plan: Plan) {
  return PLAN_LIMITS[plan]
}
