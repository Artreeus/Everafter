'use client'

import { useEffect }   from 'react'
import Link            from 'next/link'
import { AlertCircle } from 'lucide-react'
import { reportError } from '@/lib/utils/log-error'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    reportError(error, { boundary: 'app', digest: error.digest })
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-5 h-5 text-rose" />
      </div>
      <h1 className="font-display text-xl text-charcoal mb-2">Something went wrong</h1>
      <p className="text-sm text-charcoal/50 mb-6 max-w-xs">
        An unexpected error occurred on this page.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="text-sm font-medium px-4 py-2 rounded-xl bg-charcoal text-ivory hover:bg-charcoal/90 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="text-sm text-charcoal/50 hover:text-charcoal transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
