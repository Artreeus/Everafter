import type { Metadata } from 'next'
import Link              from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
import { unsubscribeEmailAction } from '@/features/user/actions/unsubscribe-email.action'

export const metadata: Metadata = {
  title:  'Unsubscribe — Everafter',
  robots: { index: false },
}

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const result = await unsubscribeEmailAction(token)

  if (!result.success) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-5">
          <div className="flex justify-center">
            <XCircle size={44} className="text-warm-gray/40" strokeWidth={1.25} />
          </div>
          <h1 className="font-display text-2xl font-light text-charcoal">Link not found</h1>
          <p className="text-sm text-warm-gray leading-relaxed">{result.error}</p>
          <Link
            href="/settings"
            className="inline-block text-sm text-gold hover:underline"
          >
            Manage notifications in settings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="flex justify-center">
          <CheckCircle size={44} className="text-gold" strokeWidth={1.25} />
        </div>
        <h1 className="font-display text-2xl font-light text-charcoal">
          {result.alreadyUnsubscribed ? 'Already unsubscribed' : 'You\'re unsubscribed'}
        </h1>
        <p className="text-sm text-warm-gray leading-relaxed">
          {result.alreadyUnsubscribed
            ? 'You were already opted out of email notifications.'
            : 'You won\'t receive notification emails from Everafter. You can re-enable them any time in your account settings.'}
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/settings"
            className="text-sm text-warm-gray hover:text-charcoal transition-colors"
          >
            Manage in settings
          </Link>
          <span className="text-stone">·</span>
          <Link
            href="/"
            className="text-sm text-warm-gray hover:text-charcoal transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
