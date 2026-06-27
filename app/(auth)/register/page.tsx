import type { Metadata } from 'next'
import { AuthCard, AuthLink } from '@/features/auth/components/AuthCard'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your Everafter account and start preserving memories.',
}

export default function RegisterPage() {
  return (
    <AuthCard
      title="Begin."
      description="Create an account to start building your first time capsule."
      footer={
        <>
          Already have an account?{' '}
          <AuthLink href="/login">Sign in</AuthLink>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  )
}
