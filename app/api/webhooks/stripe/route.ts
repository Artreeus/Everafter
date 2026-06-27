import { headers }   from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe      from 'stripe'
import { getStripe }    from '@/lib/stripe/client'
import { connectDB }    from '@/lib/db/connection'
import { User }         from '@/lib/db/models/User.model'
import { sendPlusWelcomeEmail } from '@/features/notifications/lib/resend.service'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? ''

export async function POST(req: Request) {
  const body      = await req.text()
  const headerMap = await headers()
  const sig       = headerMap.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, WEBHOOK_SECRET)
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  await connectDB()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session    = event.data.object as Stripe.Checkout.Session
      const userId     = session.metadata?.userId
      const customerId = typeof session.customer === 'string' ? session.customer : null
      const subId      = typeof session.subscription === 'string' ? session.subscription : null

      if (!userId || !subId) break

      const sub      = await getStripe().subscriptions.retrieve(subId)
      const periodEnd = sub.items.data[0]?.current_period_end ?? 0
      const expiry   = new Date(periodEnd * 1000)

      const user = await User.findByIdAndUpdate(
        userId,
        {
          plan:                 'plus',
          stripeCustomerId:     customerId,
          stripeSubscriptionId: subId,
          planExpiresAt:        expiry,
        },
        { new: true },
      ).select('email name')

      if (user) {
        void sendPlusWelcomeEmail({ to: user.email, name: user.name }).catch(console.error)
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub    = event.data.object as Stripe.Subscription
      const userId = await getUserIdFromCustomer(sub.customer)
      if (!userId) break

      const periodEnd = sub.items.data[0]?.current_period_end ?? 0
      const expiry = new Date(periodEnd * 1000)
      const plan   = sub.status === 'active' || sub.status === 'trialing' ? 'plus' : 'free'

      await User.findByIdAndUpdate(userId, { plan, planExpiresAt: expiry })
      break
    }

    case 'customer.subscription.deleted': {
      const sub    = event.data.object as Stripe.Subscription
      const userId = await getUserIdFromCustomer(sub.customer)
      if (!userId) break

      await User.findByIdAndUpdate(userId, {
        plan:                 'free',
        stripeSubscriptionId: null,
        planExpiresAt:        null,
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}

async function getUserIdFromCustomer(customer: string | Stripe.Customer | Stripe.DeletedCustomer): Promise<string | null> {
  const customerId = typeof customer === 'string' ? customer : customer.id
  const user = await User.findOne({ stripeCustomerId: customerId }).select('_id').lean()
  return user ? user._id.toString() : null
}
