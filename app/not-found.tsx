import Link from 'next/link'
import { routes } from '@/config/routes.config'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-8xl text-stone mb-6">404</p>
      <h1 className="font-display text-2xl text-charcoal mb-3">This page doesn&apos;t exist</h1>
      <p className="text-sm text-warm-gray mb-8">
        The page you&apos;re looking for has moved or was never here.
      </p>
      <Link
        href={routes.home}
        className="text-sm font-medium text-charcoal underline underline-offset-4 hover:text-warm-gray transition-colors"
      >
        Return home
      </Link>
    </div>
  )
}
