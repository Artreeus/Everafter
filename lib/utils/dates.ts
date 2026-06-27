export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  // dateStyle/timeStyle cannot be mixed with component options (year/month/day).
  // When the caller uses style options, skip the defaults entirely.
  const opts: Intl.DateTimeFormatOptions =
    options?.dateStyle || options?.timeStyle
      ? options
      : { year: 'numeric', month: 'long', day: 'numeric', ...options }
  return new Intl.DateTimeFormat('en-US', opts).format(new Date(date))
}

export function formatRelative(date: Date | string): string {
  const target = new Date(date)
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Delivered'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 30) return `${diffDays} days`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`
  const years = Math.floor(diffDays / 365)
  const months = Math.floor((diffDays % 365) / 30)
  return months > 0 ? `${years}y ${months}m` : `${years} year${years !== 1 ? 's' : ''}`
}

export function isInPast(date: Date | string): boolean {
  return new Date(date) < new Date()
}
