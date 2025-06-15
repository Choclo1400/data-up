
import { cn } from "@/lib/utils"

function EnhancedSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted relative overflow-hidden", className)}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

// Skeleton específicos para diferentes componentes
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <EnhancedSkeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <EnhancedSkeleton className="h-4 w-3/4" />
            <EnhancedSkeleton className="h-4 w-1/2" />
          </div>
          <EnhancedSkeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <EnhancedSkeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <EnhancedSkeleton className="h-4 w-3/4" />
          <EnhancedSkeleton className="h-4 w-1/2" />
        </div>
      </div>
      <EnhancedSkeleton className="h-32 w-full" />
      <div className="flex space-x-2">
        <EnhancedSkeleton className="h-8 w-20" />
        <EnhancedSkeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="p-6 space-y-3">
          <div className="flex items-center space-x-3">
            <EnhancedSkeleton className="h-8 w-8 rounded" />
            <div className="space-y-2 flex-1">
              <EnhancedSkeleton className="h-4 w-24" />
              <EnhancedSkeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export { EnhancedSkeleton, TableSkeleton, CardSkeleton, StatsSkeleton }
