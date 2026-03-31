import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export default function CharacterLoading() {
  return (
    <div className="pb-12">
      {/* --- 헤더 스켈레톤 --- */}
      <div className="flex items-center gap-6 py-6">
        <Skeleton className="size-20 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>

      <Separator />

      {/* --- 탭 스켈레톤 --- */}
      <div className="mt-6 space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  )
}
