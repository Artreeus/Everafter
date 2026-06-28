export interface ErrorContext {
  /** Which boundary or call site caught the error. */
  boundary?: string
  /** Next.js error digest, when available. */
  digest?:   string
  [key: string]: unknown
}

/**
 * Central error sink for client and server boundaries.
 *
 * Today it emits structured output to the console. This is the single place to
 * wire an external tracker later — e.g. replace the console call with
 * `Sentry.captureException(err, { extra: context })` after adding @sentry/nextjs
 * and a DSN. Keeping every boundary pointed here means that's a one-line change.
 */
export function reportError(error: unknown, context: ErrorContext = {}): void {
  const err = error instanceof Error ? error : new Error(String(error))

  console.error('[everafter]', {
    message: err.message,
    stack:   err.stack,
    ...context,
  })
}
