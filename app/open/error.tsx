'use client'

import { useEffect } from 'react'
import { reportError } from '@/lib/utils/log-error'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function OpenError({ error, reset }: ErrorProps) {
  useEffect(() => {
    reportError(error, { boundary: 'open', digest: error.digest })
  }, [error])

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'linear-gradient(160deg, #2C2825 0%, #1A1714 100%)' }}
    >
      <div className="space-y-4 max-w-sm">
        <p className="text-ivory/30 text-xs font-sans uppercase tracking-widest">Error</p>
        <h1
          className="text-ivory text-2xl font-light"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Something went wrong.
        </h1>
        <p className="text-ivory/40 text-sm font-sans leading-relaxed">
          We couldn&apos;t open this capsule right now. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-4 px-6 py-2.5 rounded-full text-sm font-sans font-medium
                     bg-ivory/10 text-ivory hover:bg-ivory/20 transition-colors border border-ivory/20"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
