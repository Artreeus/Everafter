import { serve }          from 'inngest/next'
import { inngest }         from '@/lib/inngest/client'
import { deliverCapsule }  from '@/features/capsules/jobs/deliver-capsule.job'

export const { GET, POST, PUT } = serve({
  client:    inngest,
  functions: [deliverCapsule],
})
