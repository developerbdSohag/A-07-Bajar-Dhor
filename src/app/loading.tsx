import { SkeletonGrid } from "@/components/SkeletonCard";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6">
      {/* Hero skeleton */}
      <div className="skeleton h-56 w-full rounded-3xl"></div>

      {/* Section 1 skeleton */}
      <div className="skeleton h-7 w-48"></div>
      <SkeletonGrid count={6} />

      {/* Section 2 skeleton */}
      <div className="skeleton h-7 w-48"></div>
      <SkeletonGrid count={6} />

      {/* Section 3 skeleton */}
      <div className="skeleton h-7 w-48"></div>
      <SkeletonGrid count={6} />
    </div>
  );
}
