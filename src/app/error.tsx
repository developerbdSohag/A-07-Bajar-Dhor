"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="text-6xl select-none" aria-hidden="true">
        ⚠️
      </span>
      <h1 className="text-2xl font-bold text-base-content">কিছু একটা ভুল হয়েছে!</h1>
      <p className="text-sm text-base-content/70">
        পৃষ্ঠাটি লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
      </p>
      <div className="flex gap-3 mt-4">
        <button onClick={() => reset()} className="btn btn-primary">
          আবার চেষ্টা করুন
        </button>
        <Link href="/" className="btn btn-ghost">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
