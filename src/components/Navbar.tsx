"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBanglaDate(getBanglaDate(new Date()));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছেন।");
      window.location.href = "/";
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
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="btn btn-ghost btn-sm sm:btn-md flex items-center gap-2 rounded-full px-2 sm:px-3 hover:bg-base-200 transition"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                title="প্রোফাইল মেনু"
              >
                {/* User avatar circle */}
                <div className="avatar">
                  <div className="size-8 sm:size-9 rounded-full ring-1 ring-base-300 overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.name || "ব্যবহারকারী"}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span>{session.user.name?.charAt(0) || "ব"}</span>
                    )}
                  </div>
                </div>

                {/* First Name */}
                <span className="font-medium text-sm text-base-content max-w-[120px] truncate">
                  {session.user.name?.split(" ")[0] || session.user.name}
                </span>

                {/* Down Caret */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`size-4 text-base-content/60 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown Menu (matching screenshot) */}
              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Header: Full Name & Email */}
                  <div className="mb-3 border-b border-base-200 pb-3">
                    <p className="font-bold text-base text-base-content leading-snug break-words">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-base-content/60 mt-0.5 truncate break-all">
                      {session.user.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-base-content hover:bg-base-200 transition"
                    >
                      <span className="text-base leading-none">👤</span>
                      <span>আমার প্রোফাইল</span>
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleSignOut();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-error hover:bg-error/10 transition"
                    >
                      <span className="text-base leading-none">↩</span>
                      <span>সাইন আউট</span>
                    </button>
                  </div>
                </div>
              )}
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
