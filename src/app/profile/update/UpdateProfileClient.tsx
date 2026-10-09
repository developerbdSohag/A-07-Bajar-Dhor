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

  const [name, setName] = useState(user.name || "");
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      toast.error("অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন।");
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
        image: avatarImage || "",
      });

      if (res?.error) {
        const msg = res.error.message || "তথ্য হালনাগাদ করতে সমস্যা হয়েছে।";
        setErrorMessage(msg);
        toast.error(msg);
      } else {
        toast.success("তথ্য সফলভাবে হালনাগাদ করা হয়েছে!");
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

  const userInitial = (name || user.name || "ব").charAt(0);

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
            আপনার অ্যাকাউন্টের নাম ও প্রোফাইল ছবি পরিবর্তন করতে নিচের ফর্মটি ব্যবহার করুন।
          </p>
        </header>

        {errorMessage && (
          <div className="alert alert-error text-sm mb-4 py-2 rounded-xl">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Profile Picture Option */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-base-200/50 border border-base-200">
            <div className="size-16 sm:size-18 rounded-full overflow-hidden bg-primary text-primary-content font-bold grid place-items-center text-2xl shrink-0 shadow-xs ring-2 ring-base-300">
              {avatarImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarImage} alt={name} className="size-full object-cover" />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-base-content">প্রোফাইল ছবি</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-3.5 py-1.5 text-xs font-semibold text-base-content hover:bg-base-200 hover:border-primary/40 active:scale-95 transition"
                >
                  <span>📷 ছবি নির্বাচন</span>
                </button>
                {avatarImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-1 rounded-full border border-error/30 bg-base-100 px-3 py-1.5 text-xs font-medium text-error hover:bg-error/10 active:scale-95 transition"
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
              className="input input-bordered w-full bg-base-200 opacity-70 cursor-not-allowed rounded-xl"
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
