interface SkeletonProps {
  className?: string
  rounded?: string
}

export const Skeleton = ({ className = '', rounded = 'rounded-lg' }: SkeletonProps) => (
  <div className={`skeleton ${rounded} ${className}`} />
)

export const ProductCardSkeleton = () => (
  <div className="card p-0 overflow-hidden">
    <Skeleton className="h-56 w-full" rounded="rounded-none rounded-t-xl" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-24" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  </div>
)

export const ProductDetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
    <Skeleton className="h-[500px]" />
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-10 w-36" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
)
