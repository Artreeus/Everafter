import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  href?: string
  dark?: boolean
}

const sizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-3xl',
}

export function Logo({ className, size = 'md', href = '/', dark = true }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        'font-display font-light tracking-tight transition-colors duration-300',
        dark
          ? 'text-charcoal hover:text-warm-gray'
          : 'text-ivory hover:text-ivory/70',
        sizes[size],
        className,
      )}
    >
      Everafter
    </Link>
  )
}
