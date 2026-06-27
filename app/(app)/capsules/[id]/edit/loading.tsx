import { Skeleton } from '@/components/ui/Skeleton'

export default function EditCapsuleLoading() {
  return (
    <div className="px-6 py-8 max-w-2xl mx-auto space-y-10">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-1">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Basics section */}
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-3.5 w-14" />
          <div className="flex-1 h-px bg-stone/30" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-3.5 w-16" />
          <div className="flex-1 h-px bg-stone/30" />
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>

      {/* Recipients section */}
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-3.5 w-20" />
          <div className="flex-1 h-px bg-stone/30" />
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      </div>
    </div>
  )
}
