import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id:   string
      plan: 'free' | 'plus'
    } & DefaultSession['user']
  }

  interface User {
    id?:  string
    plan?: 'free' | 'plus'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id:   string
    plan: 'free' | 'plus'
  }
}
