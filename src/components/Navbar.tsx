"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Category } from "@/types";
import { getBanglaDate } from "@/lib/format";
import { useSession, signOut } from "@/lib/auth-client";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
  { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { id: "tel", slug: "tel", nameBn: "তেল", icon: "🛢️" },
  { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

interface NavbarProps {
  categories?: Category[];
}

export default function Navbar({ categories = DEFAULT_CATEGORIES }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [banglaDate, setBanglaDate] = useState("বুধবার, ৭ অক্টোবর, ২০২৬");

  useEffect(() => {
    setBanglaDate(getBanglaDate(new Date()));
  }, []);

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

  const navCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
      {/* Top Bar */}
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
        {/* Logo with Bangla date */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-xl bg-primary text-lg text-primary-content shadow-sm transition group-hover:scale-105"
          >
            🛒
          </span>
          <span className="leading-tight">
            <span className="block text-xl font-bold tracking-tight text-base-content">
              বাজার দর
            </span>
            <span className="block text-xs text-base-content/60">{banglaDate}</span>
          </span>
        </Link>

        {/* Auth Buttons */}
        <div className="ms-auto flex items-center gap-2">
          {isPending ? (
            <div className="skeleton h-9 w-24 rounded-lg"></div>
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="btn btn-ghost btn-sm sm:btn-md flex items-center gap-2"
                title="প্রোফাইল দেখুন"
              >
                <span className="avatar avatar-placeholder">
                  <span className="size-8 rounded-full bg-primary text-xs font-bold text-primary-content">
                    {session.user.name?.charAt(0) || "ব"}
                  </span>
                </span>
                <span className="hidden sm:inline font-medium text-sm">
                  {session.user.name}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="btn btn-outline btn-error btn-sm sm:btn-md"
              >
                সাইন আউট
              </button>
            </div>
          ) : (
            <>
              <Link href="/signin" className="btn btn-ghost btn-sm sm:btn-md">
                সাইন ইন
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm sm:btn-md">
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Category Navigation Bar (Second Row) */}
      <div className="border-t border-base-200 bg-base-100">
        <nav aria-label="পণ্য ক্যাটাগরি" className="mx-auto w-full max-w-6xl px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-2 text-sm scrollbar-none">
            <li className="shrink-0">
              <Link
                href="/"
                className={`btn btn-sm whitespace-nowrap ${
                  pathname === "/" ? "btn-primary" : "btn-ghost"
                }`}
              >
                সব
              </Link>
            </li>
            {navCategories.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <li key={cat.slug || cat.id} className="shrink-0">
                  <Link
                    href={`/category/${cat.slug}`}
                    className={`btn btn-sm whitespace-nowrap ${
                      isActive ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    <span aria-hidden="true">{cat.icon}</span>
                    {cat.nameBn}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
