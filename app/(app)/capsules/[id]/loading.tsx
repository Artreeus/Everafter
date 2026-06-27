import { Skeleton } from '@/components/ui/Skeleton'

export default function CapsuleDetailLoading() {
  return (
    <div className="px-6 py-8 max-w-2xl mx-auto space-y-6">
      {/* Back link */}
      <Skeleton className="h-4 w-28" />

      {/* Card */}
      <div className="bg-white border border-stone/30 rounded-3xl p-8 space-y-6">
        {/* Status badge + title */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-7 w-2/3" />
        </div>

        <Skeleton className="h-px w-full" />

        {/* Detail rows */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-1">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        ))}

        <Skeleton className="h-px w-full" />

        {/* CTA area */}
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
