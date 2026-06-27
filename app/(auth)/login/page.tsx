import type { Metadata } from 'next'
import { AuthCard, AuthLink } from '@/features/auth/components/AuthCard'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Everafter account.',
}

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back."
      description="Sign in to your capsules."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <AuthLink href="/register">Create one</AuthLink>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  )
}
