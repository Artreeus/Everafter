import { headers } from 'next/headers'

/**
 * Lightweight in-memory sliding-window rate limiter for public Server Actions.
 *
 * NOTE: state lives in the process, so on serverless it is per-instance and
 * resets on cold start. It meaningfully throttles abuse from a single source
 * hitting a warm instance, but is not a distributed guarantee. For multi-region
 * production scale, swap the `rateLimit` body for Upstash Redis / @upstash/ratelimit.
 */

interface Bucket {
  count:   number
  resetAt: number
}

const store = new Map<string, Bucket>()
let lastSweep = Date.now()

/** Drop expired buckets occasionally so the map can't grow unbounded. */
function maybeSweep(now: number): void {
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key)
  }
}

export interface RateLimitResult {
  ok:        boolean
  remaining: number
  resetAt:   number
}

export interface RateLimitOptions {
  /** Max requests allowed within the window. */
  limit:    number
  /** Window length in milliseconds. */
  windowMs: number
}

export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  maybeSweep(now)

  const bucket = store.get(key)

  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, resetAt }
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt }
  }

  bucket.count += 1
  return { ok: true, remaining: limit - bucket.count, resetAt: bucket.resetAt }
}

/** Best-effort client identifier from proxy headers (Vercel sets x-forwarded-for). */
export async function getClientIdentifier(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return h.get('x-real-ip') ?? 'unknown'
}

/**
 * Check a rate limit for the current request, scoped by action name + client IP.
 * Use in public Server Actions before doing expensive work (DB writes, emails).
 */
export async function checkRateLimit(scope: string, options: RateLimitOptions): Promise<RateLimitResult> {
  const id = await getClientIdentifier()
  return rateLimit(`${scope}:${id}`, options)
}
