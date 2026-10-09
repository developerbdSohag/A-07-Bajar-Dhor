"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateUser, useSession } from "@/lib/auth-client";

interface UserInfo {
  name: string;
  email: string;
  image?: string | null;
}

export default function UpdateProfileClient({ user }: { user: UserInfo }) {
  const router = useRouter();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Tab: "profile" | "password"
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile Information State
  const [name, setName] = useState(user.name || "");
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "password" || window.location.hash === "#password") {
        setActiveTab("password");
      }
    }
  }, []);

  useEffect(() => {
    const email = user.email || session?.user?.email;
    const cached =
      (email && localStorage.getItem(`bazardor_avatar_${email}`)) ||
      user.image ||
      session?.user?.image ||
      localStorage.getItem("bazardor_avatar") ||
      null;
    setAvatarImage(cached);
  }, [user.email, user.image, session?.user]);

  const compressAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = 180;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("ছবিটি লোড করতে সমস্যা হয়েছে।"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("ফাইলটি পড়তে সমস্যা হয়েছে।"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("অনুগ্রহ করে একটি ছবি ফাইল (.jpg, .png, .webp) নির্বাচন করুন।");
      return;
    }

    try {
      const compressedDataUrl = await compressAndResizeImage(file);
      setAvatarImage(compressedDataUrl);

      const email = user.email || session?.user?.email;
      if (email) {
        localStorage.setItem(`bazardor_avatar_${email}`, compressedDataUrl);
      }
      localStorage.setItem("bazardor_avatar", compressedDataUrl);

      window.dispatchEvent(
        new CustomEvent("bazardor-avatar-updated", {
          detail: { image: compressedDataUrl, email },
        })
      );
      toast.success("প্রোফাইল ছবি নির্বাচিত হয়েছে!");
    } catch (err: any) {
      toast.error(err?.message || "ছবি প্রক্রিয়াকরণে সমস্যা হয়েছে।");
    }
  };

  const handleRemoveImage = () => {
    setAvatarImage(null);
    const email = user.email || session?.user?.email;
    if (email) {
      localStorage.removeItem(`bazardor_avatar_${email}`);
    }
    localStorage.removeItem("bazardor_avatar");

    window.dispatchEvent(
      new CustomEvent("bazardor-avatar-updated", {
        detail: { image: null, email },
      })
    );
    toast.success("প্রোফাইল ছবি অপসারিত হয়েছে।");
  };

  // Submit Profile Information
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");

    if (!name.trim()) {
      setProfileError("অনুগ্রহ করে আপনার নাম লিখুন।");
      toast.error("নাম খালি রাখা যাবে না।");
      return;
    }

    setProfileLoading(true);
    try {
      const res = await updateUser({
        name: name.trim(),
        image: avatarImage || "",
      });

      if (res?.error) {
        const msg = res.error.message || "তথ্য হালনাগাদ করতে সমস্যা হয়েছে।";
        setProfileError(msg);
        toast.error(msg);
      } else {
        toast.success("প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!");
        router.push("/profile");
        router.refresh();
      }
    } catch (err: any) {
      const msg = err?.message || "তথ্য আপডেট করা যায়নি।";
      setProfileError(msg);
      toast.error(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("অনুগ্রহ করে আপনার বর্তমান পাসওয়ার্ডটি প্রদান করুন।");
      toast.error("বর্তমান পাসওয়ার্ড দিন।");
      return;
    }

    if (!newPassword) {
      setPasswordError("অনুগ্রহ করে নতুন পাসওয়ার্ড প্রদান করুন।");
      toast.error("নতুন পাসওয়ার্ড দিন।");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে।");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি।");
      toast.error("উভয় পাসওয়ার্ড এক হতে হবে।");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("নতুন পাসওয়ার্ডটি বর্তমান পাসওয়ার্ড থেকে ভিন্ন হতে হবে।");
      toast.error("নতুন পাসওয়ার্ডটি ভিন্ন হতে হবে।");
      return;
    }

    setPasswordLoading(true);
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
        setPasswordError(msg);
        toast.error(msg);
      } else {
        toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        router.push("/profile");
      }
    } catch (err: any) {
      const msg = err?.message || "সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে।";
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const userInitial = (name || user.name || "ব").charAt(0);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", color: "" };
    if (pwd.length < 8) return { label: "দুর্বল (কমপক্ষে ৮ অক্ষর)", color: "text-error" };
    const hasNum = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    if (hasNum && hasSpecial && pwd.length >= 10) {
      return { label: "খুব শক্তিশালী ✓", color: "text-success" };
    }
    if (hasNum || hasSpecial) {
      return { label: "মাঝারি", color: "text-warning" };
    }
    return { label: "সাধারণ", color: "text-info" };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      {/* Breadcrumb navigation */}
      <nav aria-label="ব্রেডক্রাম্ব" className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/" className="hover:underline text-base-content/70 hover:text-base-content">
              হোম
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:underline text-base-content/70 hover:text-base-content">
              প্রোফাইল
            </Link>
          </li>
          <li className="font-semibold text-base-content">তথ্য ও নিরাপত্তা হালনাগাদ</li>
        </ul>
      </nav>

      {/* Main Settings Card */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-9 shadow-sm">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                তথ্য হালনাগাদ ও নিরাপত্তা
              </h1>
              <p className="text-sm sm:text-base text-base-content/75 mt-1">
                আপনার ব্যক্তিগত তথ্য, প্রোফাইল ছবি এবং পাসওয়ার্ড সেটিংস পরিচালনা করুন
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline self-start sm:self-auto"
            >
              <span>← প্রোফাইলে ফিরুন</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Segmented Control Tabs */}
        <div className="mb-6 inline-flex p-1 rounded-full bg-base-200/80 border border-base-300/80 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 ${
              activeTab === "profile"
                ? "bg-primary text-primary-content shadow-xs shadow-primary/25"
                : "text-base-content/70 hover:text-base-content hover:bg-base-100/50"
            }`}
          >
            <span>👤 প্রোফাইল তথ্য</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 ${
              activeTab === "password"
                ? "bg-primary text-primary-content shadow-xs shadow-primary/25"
                : "text-base-content/70 hover:text-base-content hover:bg-base-100/50"
            }`}
          >
            <span>🔐 পাসওয়ার্ড পরিবর্তন</span>
          </button>
        </div>

        {/* TAB 1: Profile Information */}
        {activeTab === "profile" && (
          <div className="animate-in fade-in duration-200">
            {profileError && (
              <div className="alert alert-error text-sm mb-5 py-2.5 rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} noValidate className="flex flex-col gap-5">
              {/* Profile Picture Option */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-base-200/50 border border-base-200/80">
                <div className="size-16 sm:size-20 rounded-full overflow-hidden bg-primary text-primary-content font-bold grid place-items-center text-2xl shrink-0 shadow-xs ring-2 ring-primary/20">
                  {avatarImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarImage} alt={name} className="size-full object-cover" />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-base-content">প্রোফাইল ছবি</p>
                  <p className="text-xs text-base-content/65 mt-0.5">
                    ছবি নির্বাচন করলে তা সঙ্গে সঙ্গে অবতার হিসেবে সেভ হবে
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-4 py-1.5 text-xs sm:text-sm font-semibold text-base-content shadow-2xs hover:bg-base-200 hover:border-primary/40 active:scale-95 transition"
                    >
                      <span>📷 নতুন ছবি নির্বাচন</span>
                    </button>
                    {avatarImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-1 rounded-full border border-error/30 bg-base-100 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-error hover:bg-error/10 active:scale-95 transition"
                      >
                        ছবি মুছুন
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Name Field */}
              <label className="form-control w-full">
                <span className="label-text mb-1 block font-semibold text-sm sm:text-base text-base-content">
                  পুরো নাম
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  className="input input-bordered w-full rounded-xl text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="যেমন: রহিম উদ্দিন"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              {/* Email Field (Read-only) */}
              <label className="form-control w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="label-text block font-semibold text-sm sm:text-base text-base-content">
                    ইমেইল ঠিকানা
                  </span>
                  <span className="badge badge-success badge-sm font-medium">✓ ভেরিফায়েড</span>
                </div>
                <input
                  type="email"
                  disabled
                  className="input input-bordered w-full bg-base-200 opacity-75 cursor-not-allowed rounded-xl text-sm sm:text-base"
                  value={user.email}
                />
                <span className="text-xs text-base-content/60 mt-1">
                  অ্যাকাউন্টের নিরাপত্তার স্বার্থে ইমেইল ঠিকানা অপরিবর্তনীয়।
                </span>
              </label>

              {/* Foam-Smooth Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-2 border-t border-base-200/80">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-primary-content shadow-sm shadow-primary/25 hover:bg-primary/95 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 flex-1 sm:flex-initial"
                >
                  {profileLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <span>তথ্য সংরক্ষণ করুন</span>
                  )}
                </button>

                <Link
                  href="/profile"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-base-300 bg-base-100 px-6 py-2.5 text-sm font-medium text-base-content/80 hover:bg-base-200 active:scale-[0.98] transition-all duration-200"
                >
                  বাতিল করুন
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: Security & Password */}
        {activeTab === "password" && (
          <div className="animate-in fade-in duration-200">
            {passwordError && (
              <div className="alert alert-error text-sm mb-5 py-2.5 rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} noValidate className="flex flex-col gap-5">
              {/* Current Password */}
              <label className="form-control w-full">
                <span className="label-text mb-1 block font-semibold text-sm sm:text-base text-base-content">
                  বর্তমান পাসওয়ার্ড
                </span>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    autoComplete="current-password"
                    className="input input-bordered w-full rounded-xl pr-11 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content select-none p-1 text-sm"
                    title={showCurrent ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                  >
                    {showCurrent ? "🙈" : "👁️"}
                  </button>
                </div>
              </label>

              {/* New Password */}
              <label className="form-control w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="label-text block font-semibold text-sm sm:text-base text-base-content">
                    নতুন পাসওয়ার্ড
                  </span>
                  {newPassword && (
                    <span className={`text-xs font-semibold ${strength.color}`}>
                      {strength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    autoComplete="new-password"
                    className="input input-bordered w-full rounded-xl pr-11 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="কমপক্ষে ৮ অক্ষরের শক্তিশালী পাসওয়ার্ড"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content select-none p-1 text-sm"
                    title={showNew ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                  >
                    {showNew ? "🙈" : "👁️"}
                  </button>
                </div>
              </label>

              {/* Confirm New Password */}
              <label className="form-control w-full">
                <span className="label-text mb-1 block font-semibold text-sm sm:text-base text-base-content">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন
                </span>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    className="input input-bordered w-full rounded-xl pr-11 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="নতুন পাসওয়ার্ডটি আবার লিখুন"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content select-none p-1 text-sm"
                    title={showConfirm ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
              </label>

              {/* Foam-Smooth Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-2 border-t border-base-200/80">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-primary-content shadow-sm shadow-primary/25 hover:bg-primary/95 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 flex-1 sm:flex-initial"
                >
                  {passwordLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <span>পাসওয়ার্ড আপডেট করুন</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-base-300 bg-base-100 px-6 py-2.5 text-sm font-medium text-base-content/80 hover:bg-base-200 active:scale-[0.98] transition-all duration-200"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
