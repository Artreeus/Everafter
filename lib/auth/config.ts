import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db/connection'
import { User } from '@/lib/db/models/User.model'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email    = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        await connectDB()
        const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash')
        if (!user || !user.passwordHash) return null

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) return null

        return {
          id:    user._id.toString(),
          email: user.email,
          name:  user.name,
          image: user.image ?? undefined,
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.type === 'credentials') return true

      const provider = account.provider as 'google' | 'github'
      const email    = user.email?.toLowerCase()
      if (!email) return false

      try {
        await connectDB()
        await User.findOneAndUpdate(
          { email },
          {
            $setOnInsert: {
              email,
              name:     user.name ?? 'Unnamed',
              image:    user.image ?? null,
              provider,
              plan:     'free',
              schemaVersion: 1,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        )
        return true
      } catch {
        return false
      }
    },

    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  pages: {
    signIn:  '/login',
    error:   '/login',
  },

  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
})
