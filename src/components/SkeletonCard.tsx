export default function SkeletonCard() {
  return (
    <div className="card border border-base-300 bg-base-100 animate-pulse">
      <div className="card-body gap-3 p-4">
        <div className="flex items-start gap-3">
          <div className="skeleton size-12 rounded-xl shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-3 w-16"></div>
          </div>
        </div>
        <div className="flex items-end justify-between pt-1">
          <div className="space-y-2">
            <div className="skeleton h-3 w-14"></div>
            <div className="skeleton h-6 w-24"></div>
          </div>
          <div className="skeleton h-6 w-14 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
