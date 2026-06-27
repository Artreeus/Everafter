'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/features/auth/schemas/auth.schema'
import { registerAction } from '@/features/auth/actions/register.action'
import { OAuthButtons } from './OAuthButtons'
import { cn } from '@/lib/utils/cn'

function Divider() {
  return (
    <div className="relative my-6 flex items-center">
      <div className="flex-grow border-t border-stone" />
      <span className="mx-4 text-xs text-warm-gray/60 uppercase tracking-widest">or</span>
      <div className="flex-grow border-t border-stone" />
    </div>
  )
}

type FieldConfig = {
  label:        string
  id:           string
  name:         keyof RegisterInput
  type?:        string
  autoComplete?: string
  description?: string
}

const fields: FieldConfig[] = [
  { label: 'Your name',        id: 'name',            name: 'name',            autoComplete: 'name' },
  { label: 'Email address',    id: 'email',           name: 'email',           type: 'email',    autoComplete: 'email' },
  { label: 'Password',         id: 'password',        name: 'password',        type: 'password', autoComplete: 'new-password', description: 'At least 8 characters' },
  { label: 'Confirm password', id: 'confirmPassword', name: 'confirmPassword', type: 'password', autoComplete: 'new-password' },
]

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition]  = useTransition()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = handleSubmit((data) => {
    setServerError(null)
    startTransition(async () => {
      const result = await registerAction(data)
      if (result && !result.success) {
        setServerError(result.error)
      }
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <OAuthButtons mode="register" />
      <Divider />

      {fields.map(({ label, id, name, type = 'text', autoComplete, description }) => (
        <div key={id}>
          <label htmlFor={id} className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">
            {label}
          </label>
          <input
            id={id}
            type={type}
            autoComplete={autoComplete}
            {...register(name)}
            className={cn(
              'block w-full rounded-lg border bg-ivory px-3.5 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/50',
              'transition-all duration-150 outline-none',
              'focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
              errors[name] ? 'border-rose' : 'border-stone hover:border-warm-gray/50',
            )}
          />
          {errors[name] && (
            <p className="mt-1 text-xs text-rose">{errors[name]?.message}</p>
          )}
          {!errors[name] && description && (
            <p className="mt-1 text-xs text-warm-gray/60">{description}</p>
          )}
        </div>
      ))}

      {serverError && (
        <p className="rounded-lg bg-rose/10 px-4 py-2.5 text-sm text-rose text-center">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'w-full rounded-lg bg-charcoal px-4 py-3 text-sm font-medium text-ivory',
          'transition-all duration-200 hover:bg-dark',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'mt-2',
        )}
      >
        {isPending ? 'Creating your account…' : 'Create account'}
      </button>

      <p className="text-center text-xs text-warm-gray/60 leading-relaxed">
        By creating an account you agree to our{' '}
        <a href="/terms" className="underline hover:text-charcoal transition-colors">Terms</a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-charcoal transition-colors">Privacy Policy</a>.
      </p>
    </form>
  )
}
