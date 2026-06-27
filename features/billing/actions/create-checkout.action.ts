'use server'

import { redirect }        from 'next/navigation'
import { connectDB }       from '@/lib/db/connection'
import { User }            from '@/lib/db/models/User.model'
import { requireSession }  from '@/lib/auth/session'
import { getStripe }       from '@/lib/stripe/client'
import { siteConfig }      from '@/config/site.config'
import { PLUS_MONTHLY_PRICE_ID, PLUS_YEARLY_PRICE_ID } from '@/lib/billing/plans'

export async function createCheckoutAction(interval: 'monthly' | 'yearly') {
  const session = await requireSession()
  await connectDB()

  const priceId = interval === 'monthly' ? PLUS_MONTHLY_PRICE_ID : PLUS_YEARLY_PRICE_ID
  if (!priceId) throw new Error('Stripe price ID is not configured.')

  const user = await User.findById(session.user.id).select('email stripeCustomerId').lean()
  if (!user) throw new Error('User not found.')

  // Reuse existing Stripe customer, or create a new one
  const stripe = getStripe()

  let customerId = user.stripeCustomerId ?? undefined
  if (!customerId) {
    const customer = await stripe.customers.create({
      email:    user.email,
      metadata: { userId: session.user.id },
    })
    customerId = customer.id
    await User.findByIdAndUpdate(session.user.id, { stripeCustomerId: customerId })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer:             customerId,
    mode:                 'subscription',
    line_items:           [{ price: priceId, quantity: 1 }],
    success_url:          `${siteConfig.url}/settings/billing?upgraded=1`,
    cancel_url:           `${siteConfig.url}/settings/billing`,
    allow_promotion_codes: true,
    metadata:             { userId: session.user.id },
  })

  redirect(checkoutSession.url!)
}
