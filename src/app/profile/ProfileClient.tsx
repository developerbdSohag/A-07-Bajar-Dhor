"use client";

import ChangePasswordForm from "@/components/ChangePasswordForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { signOut, updateUser, useSession } from "@/lib/auth-client";

interface UserInfo {
  name: string;
  email: string;
  image?: string | null;
}

export default function ProfileClient({ user }: { user: UserInfo }) {
  const router = useRouter();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = session?.user || user;
  const userInitial = currentUser.name?.charAt(0) || "ব";

  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const email = currentUser.email;
    const cached =
      (email && localStorage.getItem(`bazardor_avatar_${email}`)) ||
      currentUser.image ||
      localStorage.getItem("bazardor_avatar") ||
      null;
    setAvatarImage(cached);
  }, [currentUser.email, currentUser.image]);

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

          // Crop and center square
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("অনুগ্রহ করে একটি ছবি ফাইল (.jpg, .png, .webp) নির্বাচন করুন।");
      return;
    }

    setUploading(true);
    try {
      const compressedDataUrl = await compressAndResizeImage(file);
      setAvatarImage(compressedDataUrl);

      if (currentUser.email) {
        localStorage.setItem(`bazardor_avatar_${currentUser.email}`, compressedDataUrl);
      }
      localStorage.setItem("bazardor_avatar", compressedDataUrl);

      // Real-time synchronization event for Navbar and other components
      window.dispatchEvent(
        new CustomEvent("bazardor-avatar-updated", {
          detail: { image: compressedDataUrl, email: currentUser.email },
        })
      );

      // Sync with BetterAuth user record
      try {
        await updateUser({ image: compressedDataUrl });
      } catch {
        // Local state & storage already active
      }

      toast.success("প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "ছবি আপলোড করতে সমস্যা হয়েছে।");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    setAvatarImage(null);
    if (currentUser.email) {
      localStorage.removeItem(`bazardor_avatar_${currentUser.email}`);
    }
    localStorage.removeItem("bazardor_avatar");

    window.dispatchEvent(
      new CustomEvent("bazardor-avatar-updated", {
        detail: { image: null, email: currentUser.email },
      })
    );

    try {
      await updateUser({ image: "" });
    } catch {
      // Local state reset
    }

    toast.success("প্রোফাইল ছবি মুছে ফেলা হয়েছে।");
    router.refresh();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছেন।");
      window.location.href = "/";
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">আমার প্রোফাইল</h1>
        <p className="text-sm sm:text-base text-base-content/75 mt-1">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন এবং ব্যবস্থাপনা করুন।
        </p>
      </header>

      {/* Profile Card */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-base-300 bg-base-100 p-6 sm:flex-row sm:items-start shadow-sm">
        {/* Interactive Avatar with Camera Upload */}
        <div className="relative group shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative size-20 sm:size-24 rounded-full ring-2 ring-primary/25 ring-offset-2 ring-offset-base-100 overflow-hidden bg-primary text-primary-content font-bold shadow-md hover:ring-primary/60 transition-all duration-200 cursor-pointer block select-none focus:outline-none focus:ring-4 focus:ring-primary/40 active:scale-95"
            title="প্রোফাইল ছবি পরিবর্তন করতে ক্লিক করুন"
          >
            {avatarImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarImage}
                alt={currentUser.name}
                className="size-full object-cover"
              />
            ) : (
              <span className="grid size-full place-items-center text-3xl font-extrabold">
                {userInitial}
              </span>
            )}

            {/* Hover overlay with Camera Icon */}
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="20"
                height="20"
                className="size-5 mb-0.5"
                aria-hidden="true"
              >
                <path d="M1 8.25a1.25 1.25 0 0 1 1.25-1.25h1.306l.87-1.45A1.25 1.25 0 0 1 5.497 5h9.006c.433 0 .83.224 1.07.6l.87 1.45h1.307A1.25 1.25 0 0 1 19 8.25v7.5A1.25 1.25 0 0 1 17.75 17H2.25A1.25 1.25 0 0 1 1 15.75v-7.5Z" />
                <path d="M10 14a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z" />
              </svg>
              <span className="text-[11px] font-semibold tracking-wide">ছবি পরিবর্তন</span>
            </div>

            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="loading loading-spinner loading-md text-white"></span>
              </div>
            )}
          </button>

          {/* Floating Camera Badge Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 size-7.5 rounded-full bg-primary text-primary-content shadow-md grid place-items-center border-2 border-base-100 hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="ছবি আপলোড করুন"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="15"
              height="15"
              className="size-3.5"
              aria-hidden="true"
            >
              <path d="M1 8.25a1.25 1.25 0 0 1 1.25-1.25h1.306l.87-1.45A1.25 1.25 0 0 1 5.497 5h9.006c.433 0 .83.224 1.07.6l.87 1.45h1.307A1.25 1.25 0 0 1 19 8.25v7.5A1.25 1.25 0 0 1 17.75 17H2.25A1.25 1.25 0 0 1 1 15.75v-7.5Z" />
              <path d="M10 14a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z" />
            </svg>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold text-base-content">{currentUser.name}</h2>
            {avatarImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs text-error/80 hover:text-error hover:underline"
                title="ছবি সরান"
              >
                (ছবি মুছুন)
              </button>
            )}
          </div>
          <p className="truncate text-sm sm:text-base text-base-content/70 mt-0.5">{currentUser.email}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="badge badge-success badge-sm font-medium">সক্রিয় সদস্য</span>
            <span className="badge badge-ghost badge-sm font-medium">বাজার দর অ্যাকাউন্ট</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          {/* Challenge C3: Update button that navigates to another route */}
          <Link
            href="/profile/update"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-content shadow-xs hover:bg-primary/95 hover:shadow-sm active:scale-[0.98] transition-all duration-200"
          >
            <span>✏️ তথ্য পরিবর্তন করুন</span>
          </Link>

          <a
            href="#password-section"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-4 py-2 text-xs sm:text-sm font-semibold text-base-content hover:bg-base-200 hover:border-primary/40 active:scale-[0.98] transition-all duration-200"
          >
            <span>🔑 পাসওয়ার্ড পরিবর্তন</span>
          </a>

          <button
            onClick={handleSignOut}
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-error/40 text-error px-4 py-2 text-xs sm:text-sm font-medium hover:bg-error/10 active:scale-[0.98] transition-all duration-200"
          >
            <span>↩ সাইন আউট</span>
          </button>
        </div>
      </div>

      {/* Password Change Section */}
      <section id="password-section" className="scroll-mt-24">
        <ChangePasswordForm />
      </section>
    </div>
  );
}
