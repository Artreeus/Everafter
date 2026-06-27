import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

// Content-Security-Policy
// Note: 'unsafe-inline' and 'unsafe-eval' are required by Next.js for hydration.
// A nonce-based CSP is the correct long-term approach; this covers the other vectors.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: res.cloudinary.com lh3.googleusercontent.com avatars.githubusercontent.com",
  "media-src 'self' blob: res.cloudinary.com",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',            value: 'nosniff' },
          { key: 'X-Frame-Options',                   value: 'DENY' },
          { key: 'X-XSS-Protection',                  value: '1; mode=block' },
          { key: 'Referrer-Policy',                   value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',                value: 'camera=(), microphone=(self), geolocation=()' },
          { key: 'Content-Security-Policy',           value: CSP },
          // HSTS: only meaningful over HTTPS; browsers ignore it on plain HTTP
          ...(isProd ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }] : []),
        ],
      },
      // Personal links — don't index
      {
        source: '/open/:token*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/contribute/:token*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
}

export default nextConfig
