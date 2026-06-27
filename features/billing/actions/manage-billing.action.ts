'use server'

import { redirect }        from 'next/navigation'
import { connectDB }       from '@/lib/db/connection'
import { User }            from '@/lib/db/models/User.model'
import { requireSession }  from '@/lib/auth/session'
import { getStripe }       from '@/lib/stripe/client'
import { siteConfig }      from '@/config/site.config'

export async function manageBillingAction() {
  const session = await requireSession()
  await connectDB()

  const user = await User.findById(session.user.id).select('stripeCustomerId').lean()
  if (!user?.stripeCustomerId) throw new Error('No Stripe customer found.')

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer:   user.stripeCustomerId,
    return_url: `${siteConfig.url}/settings/billing`,
  })

  redirect(portalSession.url)
}
