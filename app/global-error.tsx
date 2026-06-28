'use client'

import { useEffect } from 'react'
import { reportError } from '@/lib/utils/log-error'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Top-level boundary — catches errors thrown in the root layout itself.
 * It replaces the root layout, so globals.css and the app fonts are NOT
 * available here; everything must be inline-styled.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    reportError(error, { boundary: 'global', digest: error.digest })
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            backgroundColor: '#FAF7F2',
            color: '#2C2825',
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          }}
        >
          {/* wax seal mark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '9999px',
              backgroundImage: 'radial-gradient(circle at 35% 30%, #D4B870, #A8893A)',
              color: '#FAF7F2',
              fontSize: 26,
              fontFamily: 'Georgia, ui-serif, serif',
              fontStyle: 'italic',
              marginBottom: 28,
            }}
          >
            E
          </div>

          <h1
            style={{
              fontFamily: 'Georgia, ui-serif, serif',
              fontWeight: 300,
              fontSize: 28,
              margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}
          >
            Something went wrong
          </h1>

          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#9B9189', maxWidth: 360, margin: '0 0 32px' }}>
            An unexpected error interrupted Everafter. Your capsules are safe — please try again.
          </p>

          <button
            onClick={reset}
            style={{
              cursor: 'pointer',
              border: 'none',
              borderRadius: 12,
              backgroundColor: '#2C2825',
              color: '#FAF7F2',
              fontSize: 14,
              fontWeight: 600,
              padding: '12px 24px',
            }}
          >
            Try again
          </button>

          {error.digest && (
            <p style={{ marginTop: 24, fontSize: 11, color: 'rgba(155,145,137,0.7)' }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
