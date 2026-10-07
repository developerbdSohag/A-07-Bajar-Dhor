import { SkeletonGrid } from "@/components/SkeletonCard";

export default function CategoryLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <div className="skeleton h-24 w-full rounded-2xl"></div>
      <div className="flex justify-between items-center">
        <div className="skeleton h-5 w-40"></div>
        <div className="skeleton h-8 w-32"></div>
      </div>
      <SkeletonGrid count={6} />
    </div>
  );
}
