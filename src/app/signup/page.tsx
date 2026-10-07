"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { signUp, signIn } from "@/lib/auth-client";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackURL") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার নাম প্রদান করুন।");
      toast.error("নাম প্রদান করুন।");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার ইমেইল প্রদান করুন।");
      toast.error("ইমেইল প্রদান করুন।");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("পাসওয়ার্ড দুটি মেলেনি।");
      toast.error("পাসওয়ার্ড নিশ্চিতকরণ সঠিক নয়।");
      return;
    }

    setLoading(true);
    try {
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (res?.error) {
        const msg = res.error.message || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।";
        setErrorMessage(msg);
        toast.error(msg);
      } else {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      const msg = err?.message || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      const res = await signIn.social({
        provider,
        callbackURL: callbackUrl,
      });

      if (res?.error) {
        toast.error(
          `${provider === "google" ? "Google" : "GitHub"} লগইন কনফিগার করা নেই। অনুগ্রহ করে ইমেইল দিয়ে অ্যাকাউন্ট খুলুন।`
        );
      }
    } catch {
      toast.error(
        `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন ইন করতে সমস্যা হয়েছে।`
      );
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-sm">
        <header className="mb-6 text-center">
          <span className="text-4xl select-none" aria-hidden="true">
            🛒
          </span>
          <h1 className="mt-2 text-2xl font-bold text-base-content">সাইন আপ</h1>
          <p className="text-sm text-base-content/70 mt-1">
            নতুন অ্যাকাউন্ট তৈরি করে বাজার দরে যুক্ত হন
          </p>
        </header>

        {errorMessage && (
          <div className="alert alert-error text-sm mb-4 py-2 rounded-lg">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <label className="form-control w-full">
            <span className="label-text mb-1 block font-medium">নাম</span>
            <input
              type="text"
              autoComplete="name"
              className="input input-bordered w-full"
              placeholder="যেমন: রহিম উদ্দিন"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1 block font-medium">ইমেইল</span>
            <input
              type="email"
              autoComplete="email"
              className="input input-bordered w-full"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1 block font-medium">পাসওয়ার্ড</span>
            <input
              type="password"
              autoComplete="new-password"
              className="input input-bordered w-full"
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1 block font-medium">পাসওয়ার্ড নিশ্চিত করুন</span>
            <input
              type="password"
              autoComplete="new-password"
              className="input input-bordered w-full"
              placeholder="আবার লিখুন"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-2"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "অ্যাকাউন্ট তৈরি করুন"
            )}
          </button>

          <div className="divider my-1 text-xs text-base-content/60">অথবা</div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={socialLoading !== null}
              onClick={() => handleSocialLogin("google")}
              className="btn btn-outline flex-1 text-xs sm:text-sm"
            >
              {socialLoading === "google" ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <svg viewBox="0 0 48 48" aria-hidden="true" className="size-4 shrink-0">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  />
                </svg>
              )}
              Google দিয়ে চালিয়ে যান
            </button>

            <button
              type="button"
              disabled={socialLoading !== null}
              onClick={() => handleSocialLogin("github")}
              className="btn btn-outline flex-1 text-xs sm:text-sm"
            >
              {socialLoading === "github" ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 fill-current shrink-0">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
              )}
              GitHub দিয়ে চালিয়ে যান
            </button>
          </div>

          <p className="text-center text-sm text-base-content/70 mt-2">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href={`/signin${callbackUrl !== "/" ? `?callbackURL=${encodeURIComponent(callbackUrl)}` : ""}`}
              className="link link-primary font-medium"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-12">
          <div className="skeleton h-96 w-full rounded-2xl"></div>
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
