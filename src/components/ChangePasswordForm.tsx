"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export default function ChangePasswordForm({
  onSuccess,
  onCancel,
  showCancel = false,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPassword) {
      setErrorMessage("অনুগ্রহ করে আপনার বর্তমান পাসওয়ার্ডটি প্রদান করুন।");
      toast.error("বর্তমান পাসওয়ার্ড দিন।");
      return;
    }

    if (!newPassword) {
      setErrorMessage("অনুগ্রহ করে নতুন পাসওয়ার্ড প্রদান করুন।");
      toast.error("নতুন পাসওয়ার্ড দিন।");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে।");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি।");
      toast.error("উভয় পাসওয়ার্ড এক হতে হবে।");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage("নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ড থেকে ভিন্ন হতে হবে।");
      toast.error("নতুন পাসওয়ার্ডটি ভিন্ন হতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const msg = data.error || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।";
        setErrorMessage(msg);
        toast.error(msg);
      } else {
        const msg = data.message || "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!";
        setSuccessMessage(msg);
        toast.success(msg);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onSuccess?.();
      }
    } catch (err: any) {
      const msg = err?.message || "সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে।";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-7 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-xl text-primary" aria-hidden="true">
          🔑
        </span>
        <div>
          <h2 className="text-xl font-bold text-base-content">পাসওয়ার্ড পরিবর্তন করুন</h2>
          <p className="text-xs sm:text-sm text-base-content/70">
            আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নিয়মিত পাসওয়ার্ড পরিবর্তন করুন
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-error text-sm mb-4 py-2.5 rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success text-sm mb-4 py-2.5 rounded-xl flex items-center gap-2">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Current Password */}
        <label className="form-control w-full">
          <span className="label-text mb-1 block font-semibold text-sm">বর্তমান পাসওয়ার্ড</span>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              autoComplete="current-password"
              className="input input-bordered w-full rounded-xl pr-10 text-sm"
              placeholder="বর্তমান পাসওয়ার্ড লিখুন"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content select-none p-1"
              title={showCurrent ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            >
              {showCurrent ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        {/* New Password */}
        <label className="form-control w-full">
          <span className="label-text mb-1 block font-semibold text-sm">নতুন পাসওয়ার্ড</span>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              className="input input-bordered w-full rounded-xl pr-10 text-sm"
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNew((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content select-none p-1"
              title={showNew ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            >
              {showNew ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        {/* Confirm New Password */}
        <label className="form-control w-full">
          <span className="label-text mb-1 block font-semibold text-sm">নতুন পাসওয়ার্ড নিশ্চিত করুন</span>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              className="input input-bordered w-full rounded-xl pr-10 text-sm"
              placeholder="আবার লিখুন"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content select-none p-1"
              title={showConfirm ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            >
              {showConfirm ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 px-6 text-sm font-semibold text-primary-content shadow-md shadow-primary/20 hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-60 flex-1"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <span>পাসওয়ার্ড আপডেট করুন</span>
            )}
          </button>

          {showCancel && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-base-content/75 hover:bg-base-200 active:scale-[0.98] transition-all duration-200"
            >
              বাতিল
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
