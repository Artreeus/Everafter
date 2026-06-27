'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl text-charcoal mb-3">Something went wrong</h1>
      <p className="text-sm text-warm-gray mb-8 max-w-sm">
        An unexpected error occurred. Our team has been notified.
      </p>
      <button
        onClick={reset}
        className="text-sm font-medium text-charcoal underline underline-offset-4 hover:text-warm-gray transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
