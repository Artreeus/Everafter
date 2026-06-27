'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/features/auth/schemas/auth.schema'
import { loginAction } from '@/features/auth/actions/login.action'
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

interface FieldProps {
  label:     string
  id:        string
  type?:     string
  error?:    string
  register:  ReturnType<typeof useForm<LoginInput>>['register']
  name:      keyof LoginInput
  autoComplete?: string
}

function Field({ label, id, type = 'text', error, register, name, autoComplete }: FieldProps) {
  return (
    <div>
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
          error ? 'border-rose' : 'border-stone hover:border-warm-gray/50',
        )}
      />
      {error && <p className="mt-1 text-xs text-rose">{error}</p>}
    </div>
  )
}

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition]  = useTransition()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = handleSubmit((data) => {
    setServerError(null)
    startTransition(async () => {
      const result = await loginAction(data)
      if (result && !result.success) {
        setServerError(result.error)
      }
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <OAuthButtons mode="login" />
      <Divider />

      <Field
        label="Email address"
        id="email"
        type="email"
        autoComplete="email"
        name="email"
        register={register}
        error={errors.email?.message}
      />
      <Field
        label="Password"
        id="password"
        type="password"
        autoComplete="current-password"
        name="password"
        register={register}
        error={errors.password?.message}
      />

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
        )}
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
