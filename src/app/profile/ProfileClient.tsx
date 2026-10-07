"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut, useSession } from "@/lib/auth-client";

interface UserInfo {
  name: string;
  email: string;
}

export default function ProfileClient({ user }: { user: UserInfo }) {
  const router = useRouter();
  const { data: session } = useSession();

  const currentUser = session?.user || user;
  const userInitial = currentUser.name?.charAt(0) || "ব";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছেন।");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-base-content sm:text-3xl">আমার প্রোফাইল</h1>
        <p className="text-sm text-base-content/70 mt-1">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন এবং ব্যবস্থাপনা করুন।
        </p>
      </header>

      {/* Profile Card */}
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-base-300 bg-base-100 p-6 sm:flex-row sm:items-start shadow-sm">
        <span className="avatar avatar-placeholder select-none">
          <span className="w-20 h-20 rounded-full bg-primary text-2xl font-bold text-primary-content shadow-sm flex items-center justify-center">
            <span>{userInitial}</span>
          </span>
        </span>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-base-content">{currentUser.name}</h2>
          <p className="truncate text-sm text-base-content/70 mt-0.5">{currentUser.email}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="badge badge-success badge-sm">সক্রিয় সদস্য</span>
            <span className="badge badge-ghost badge-sm">বাজার দর অ্যাকাউন্ট</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Challenge C3: Update button that navigates to another route */}
          <Link
            href="/profile/update"
            className="btn btn-primary btn-sm sm:btn-md"
          >
            ✏️ তথ্য হালনাগাদ করুন
          </Link>

          <button
            onClick={handleSignOut}
            type="button"
            className="btn btn-outline btn-error btn-sm sm:btn-md"
          >
            ↩︎ সাইন আউট
          </button>
        </div>
      </div>
    </div>
  );
}
