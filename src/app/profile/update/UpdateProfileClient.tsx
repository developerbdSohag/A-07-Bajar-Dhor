"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateUser } from "@/lib/auth-client";

interface UserInfo {
  name: string;
  email: string;
}

export default function UpdateProfileClient({ user }: { user: UserInfo }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার নাম লিখুন।");
      toast.error("নাম খালি রাখা যাবে না।");
      return;
    }

    setLoading(true);
    try {
      const res = await updateUser({
        name: name.trim(),
      });

      if (res?.error) {
        const msg = res.error.message || "তথ্য হালনাগাদ করতে সমস্যা হয়েছে।";
        setErrorMessage(msg);
        toast.error(msg);
      } else {
        toast.success("নাম সফলভাবে হালনাগাদ করা হয়েছে!");
        router.push("/profile");
        router.refresh();
      }
    } catch (err: any) {
      const msg = err?.message || "তথ্য আপডেট করা যায়নি।";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8">
      {/* Breadcrumb navigation */}
      <nav aria-label="ব্রেডক্রাম্ব" className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/" className="hover:underline">
              হোম
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:underline">
              প্রোফাইল
            </Link>
          </li>
          <li className="font-medium text-base-content">তথ্য হালনাগাদ</li>
        </ul>
      </nav>

      {/* Update Card */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-sm">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">তথ্য হালনাগাদ করুন</h1>
          <p className="text-sm sm:text-base text-base-content/75 mt-1">
            আপনার অ্যাকাউন্টের নাম পরিবর্তন করতে নিচে নতুন নামটি লিখুন।
          </p>
        </header>

        {errorMessage && (
          <div className="alert alert-error text-sm mb-4 py-2 rounded-xl">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <label className="form-control w-full">
            <span className="label-text mb-1 block font-semibold text-sm sm:text-base">নাম</span>
            <input
              type="text"
              autoComplete="name"
              className="input input-bordered w-full rounded-xl"
              placeholder="যেমন: রহিম উদ্দিন"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1 block font-medium">ইমেইল (অপরিবর্তনীয়)</span>
            <input
              type="email"
              disabled
              className="input input-bordered w-full bg-base-200 opacity-70 cursor-not-allowed"
              value={user.email}
            />
          </label>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-primary py-2.5 px-6 text-sm font-semibold text-primary-content shadow-xs hover:bg-primary/95 hover:shadow-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-60 flex-1"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "তথ্য আপডেট করুন"
              )}
            </button>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-base-content/80 hover:bg-base-200 active:scale-[0.98] transition-all duration-200 sm:w-auto"
            >
              বাতিল করুন
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
