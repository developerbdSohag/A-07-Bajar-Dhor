"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface SocialAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: "google" | "github";
  onDemoSignIn: (provider: "google" | "github") => Promise<void>;
  loading: boolean;
  callbackUrl?: string;
  redirectUri?: string;
}

export default function SocialAuthModal({
  isOpen,
  onClose,
  provider,
  onDemoSignIn,
  loading,
  redirectUri,
}: SocialAuthModalProps) {
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  if (!isOpen) return null;

  const isGoogle = provider === "google";
  const defaultCallback =
    redirectUri ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/api/auth/callback/${provider}`
      : `https://a-07-bajar-dhor.vercel.app/api/auth/callback/${provider}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultCallback);
    setCopied(true);
    toast.success("Callback URL কপি করা হয়েছে!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xl sm:p-7">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-base-200">
            {isGoogle ? (
              <svg viewBox="0 0 48 48" aria-hidden="true" className="size-6">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-base-content">
              {isGoogle ? "Google" : "GitHub"} লগইন কনফিগারেশন
            </h3>
            <span className="inline-block rounded-md bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning-content mt-1">
              OAuth Credentials প্রয়োজন
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content"
            aria-label="বন্ধ করুন"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-base-content/75 leading-relaxed">
          Google ও GitHub এর নিরাপত্তা পলিসি অনুযায়ী প্রতিটি লাইভ অ্যাপের জন্য নিজস্ব Client ID ও Secret প্রয়োজন। আপনি এখনই ১ ক্লিকে আপনার সোশ্যাল প্রোফাইলে প্রবেশ করতে পারেন, অথবা রিয়েল OAuth চালু করতে নিচের নির্দেশিকা দেখতে পারেন।
        </p>

        {/* Primary Action: 1-Click Demo Social Login */}
        <div className="mt-4 flex flex-col gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={() => onDemoSignIn(provider)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-sm font-semibold text-primary-content shadow-xs shadow-primary/25 hover:bg-primary/95 active:scale-[0.98] transition-all"
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <>
                <span>🚀</span>
                <span>
                  {isGoogle
                    ? "সরাসরি Google অ্যাকাউন্টে সাইন ইন করুন"
                    : "সরাসরি GitHub অ্যাকাউন্টে সাইন ইন করুন"}
                </span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-base-content/60">
            {isGoogle
              ? "অ্যাকাউন্ট: mdsalahuddinsohag218@gmail.com"
              : "অ্যাকাউন্ট: developerbdSohag"}
          </p>
        </div>

        {/* Collapsible Real OAuth Setup Guide */}
        <div className="mt-4 border-t border-base-200 pt-3">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex w-full items-center justify-between py-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>🛠️ লাইভ Google/GitHub OAuth চালু করার পদ্ধতি</span>
            <span>{showGuide ? "▲ লুকান" : "▼ দেখুন"}</span>
          </button>

          {showGuide && (
            <div className="mt-2.5 rounded-xl bg-base-200/70 p-3 text-xs text-base-content/80 space-y-2">
              <p className="font-semibold text-base-content">
                {isGoogle ? "Google Cloud Console ধাপ:" : "GitHub Developer Settings ধাপ:"}
              </p>
              <ol className="list-decimal list-inside space-y-1 text-base-content/75 pl-1">
                <li>
                  {isGoogle ? "Google Cloud Console > Credentials এ যান" : "GitHub Settings > Developer settings > OAuth Apps এ যান"}
                </li>
                <li>
                  নিচের <strong>Callback URL</strong> টি কপি করে পেস্ট করুন:
                </li>
              </ol>

              {/* Callback URL with Copy */}
              <div className="flex items-center gap-1.5 rounded-lg border border-base-300 bg-base-100 p-1.5 font-mono text-[11px]">
                <span className="truncate flex-1 text-base-content/85 select-all">
                  {defaultCallback}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn btn-xs rounded-md bg-base-200 hover:bg-base-300 text-xs shrink-0"
                >
                  {copied ? "কপি হয়েছে!" : "কপি"}
                </button>
              </div>

              <p className="text-base-content/70">
                ৩. Vercel Dashboard এর Settings &gt; Environment Variables এ গিয়ে{" "}
                <code className="rounded bg-base-300 px-1 font-mono">
                  {isGoogle ? "GOOGLE_CLIENT_ID" : "GITHUB_CLIENT_ID"}
                </code>{" "}
                এবং{" "}
                <code className="rounded bg-base-300 px-1 font-mono">
                  {isGoogle ? "GOOGLE_CLIENT_SECRET" : "GITHUB_CLIENT_SECRET"}
                </code>{" "}
                যোগ করুন।
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost rounded-xl text-base-content/70 hover:text-base-content"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
