import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('[resend] RESEND_API_KEY is not set — emails will not be delivered')
}

export const resend = new Resend(process.env.RESEND_API_KEY ?? '')
