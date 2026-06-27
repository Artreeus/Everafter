import { Inngest } from 'inngest'

// In development without the Inngest dev server running, send calls fail silently
// (wrapped in try/catch in seal/unseal actions). In production, INNGEST_EVENT_KEY is required.
export const inngest = new Inngest({
  id:       'everafter',
  isDev:    process.env.NODE_ENV !== 'production',
  ...(process.env.INNGEST_EVENT_KEY ? { eventKey: process.env.INNGEST_EVENT_KEY } : {}),
})
