import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="text-7xl select-none" aria-hidden="true">
        🛒
      </span>
      <h1 className="text-4xl font-extrabold text-base-content">৪০৪</h1>
      <h2 className="text-xl font-bold text-base-content">পৃষ্ঠাটি পাওয়া যায়নি</h2>
      <p className="text-sm text-base-content/70 max-w-xs">
        আপনি যে পৃষ্ঠাটি খুঁজছেন তা স্থানান্তরিত হয়েছে অথবা মুছে ফেলা হয়েছে।
      </p>
      <Link href="/" className="btn btn-primary mt-4">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
