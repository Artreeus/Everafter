import { render } from '@react-email/components'
import { resend } from '@/lib/resend/client'
import { WelcomeEmail }         from '@/features/notifications/emails/WelcomeEmail'
import { CapsuleSealedEmail }   from '@/features/notifications/emails/CapsuleSealedEmail'
import { CapsuleDeliveryEmail } from '@/features/notifications/emails/CapsuleDeliveryEmail'
import { CapsuleOpenedEmail }   from '@/features/notifications/emails/CapsuleOpenedEmail'
import CapsuleReplyEmail        from '@/features/notifications/emails/CapsuleReplyEmail'
import ContributorInviteEmail   from '@/features/notifications/emails/ContributorInviteEmail'
import PlusWelcomeEmail         from '@/features/notifications/emails/PlusWelcomeEmail'
import { siteConfig } from '@/config/site.config'

const FROM = process.env.RESEND_FROM_EMAIL ?? 'hello@everafter.app'

// ── Welcome ──────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail({ name, email }: { name: string; email: string }) {
  const html = await render(
    WelcomeEmail({ name, appUrl: siteConfig.url }) as React.ReactElement,
  )
  await resend.emails.send({
    from:    FROM,
    to:      email,
    subject: `Welcome to Everafter, ${name}.`,
    html,
  })
}

// ── Capsule sealed (author confirmation) ─────────────────────────────────────

interface SealedPayload {
  to:              string
  authorName:      string
  capsuleTitle:    string
  deliveryDate:    string
  recipientNames:  string[]
  unsealDeadline:  string
  dashboardUrl:    string
  unsubscribeUrl?: string
}

export async function sendCapsuleSealedEmail(payload: SealedPayload) {
  const html = await render(
    CapsuleSealedEmail({
      authorName:     payload.authorName,
      capsuleTitle:   payload.capsuleTitle,
      deliveryDate:   payload.deliveryDate,
      recipientNames: payload.recipientNames,
      unsealDeadline: payload.unsealDeadline,
      dashboardUrl:   payload.dashboardUrl,
      unsubscribeUrl: payload.unsubscribeUrl,
    }) as React.ReactElement,
  )
  await resend.emails.send({
    from:    FROM,
    to:      payload.to,
    subject: `Your capsule "${payload.capsuleTitle}" is sealed.`,
    html,
  })
}

// ── Capsule delivery (recipient) ─────────────────────────────────────────────

interface DeliveryPayload {
  to:            string
  recipientName: string
  senderName:    string
  capsuleTitle:  string
  openUrl:       string
}

export async function sendCapsuleDeliveryEmail(payload: DeliveryPayload): Promise<{ id: string }> {
  const html = await render(
    CapsuleDeliveryEmail(payload) as React.ReactElement,
  )
  const result = await resend.emails.send({
    from:    FROM,
    to:      payload.to,
    subject: `A message has arrived for you — from ${payload.senderName}`,
    html,
  })
  return { id: result.data?.id ?? 'unknown' }
}

// ── Capsule opened (author notification) ─────────────────────────────────────

interface OpenedPayload {
  to:              string
  authorName:      string
  recipientName:   string
  capsuleTitle:    string
  openedAt:        string
  dashboardUrl:    string
  unsubscribeUrl?: string
}

export async function sendCapsuleOpenedEmail(payload: OpenedPayload) {
  const html = await render(
    CapsuleOpenedEmail({
      authorName:     payload.authorName,
      recipientName:  payload.recipientName,
      capsuleTitle:   payload.capsuleTitle,
      openedAt:       payload.openedAt,
      dashboardUrl:   payload.dashboardUrl,
      unsubscribeUrl: payload.unsubscribeUrl,
    }) as React.ReactElement,
  )
  await resend.emails.send({
    from:    FROM,
    to:      payload.to,
    subject: `${payload.recipientName} opened your capsule.`,
    html,
  })
}

// ── Capsule reply (author notification) ──────────────────────────────────────

interface ReplyPayload {
  authorEmail:     string
  authorName:      string
  capsuleTitle:    string
  replyFrom:       string
  replyContent:    string
  unsubscribeUrl?: string
}

export async function sendCapsuleReplyEmail(payload: ReplyPayload) {
  const html = await render(
    CapsuleReplyEmail({
      authorName:   payload.authorName,
      capsuleTitle: payload.capsuleTitle,
      replyFrom:    payload.replyFrom,
      replyContent: payload.replyContent,
    }) as React.ReactElement,
  )
  await resend.emails.send({
    from:    FROM,
    to:      payload.authorEmail,
    subject: `${payload.replyFrom} replied to your capsule.`,
    html,
  })
}

// ── Contributor invite ────────────────────────────────────────────────────────

interface ContributorInvitePayload {
  to:            string
  toName:        string
  authorName:    string
  capsuleTitle:  string
  contributeUrl: string
}

export async function sendContributorInviteEmail(payload: ContributorInvitePayload) {
  const html = await render(
    ContributorInviteEmail({
      toName:        payload.toName,
      authorName:    payload.authorName,
      capsuleTitle:  payload.capsuleTitle,
      contributeUrl: payload.contributeUrl,
    }) as React.ReactElement,
  )
  await resend.emails.send({
    from:    FROM,
    to:      payload.to,
    subject: `${payload.authorName} invited you to contribute to a time capsule.`,
    html,
  })
}

// ── Plus welcome ──────────────────────────────────────────────────────────────

export async function sendPlusWelcomeEmail({ to, name }: { to: string; name: string }) {
  const html = await render(PlusWelcomeEmail({ name }) as React.ReactElement)
  await resend.emails.send({
    from:    FROM,
    to,
    subject: 'Welcome to Everafter Plus.',
    html,
  })
}
