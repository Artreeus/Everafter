import { Skeleton } from '@/components/ui/Skeleton'

export default function SettingsLoading() {
  return (
    <div className="px-6 py-8 max-w-2xl mx-auto space-y-8">
      <Skeleton className="h-7 w-24" />

      {/* Profile card */}
      <div className="bg-white border border-stone/30 rounded-2xl p-6 space-y-6">
        <Skeleton className="h-5 w-20" />

        {/* Avatar + name row */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>

        <Skeleton className="h-px w-full" />

        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        </div>

        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>

      {/* Account card */}
      <div className="bg-white border border-stone/30 rounded-2xl p-6 space-y-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-3.5 w-44" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}
