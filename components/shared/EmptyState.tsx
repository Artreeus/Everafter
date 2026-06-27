import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-6 text-center', className)}>
      {icon && (
        <div className="mb-6 text-stone opacity-60">
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl text-charcoal mb-2">{title}</h3>
      {description && (
        <p className="text-warm-gray text-sm leading-relaxed max-w-xs">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
