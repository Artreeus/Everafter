import { auth } from '@/lib/auth/config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/dashboard', '/capsules', '/settings']
const authPaths = ['/login', '/register']

// Auth.js v5 exports `auth` as the middleware function.
// Next.js 16 requires the export to be named `proxy`.
export async function proxy(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
  const isAuth = authPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !session?.user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuth && session?.user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|images|fonts).*)'],
}
