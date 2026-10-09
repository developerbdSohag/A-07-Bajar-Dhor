"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

function ToastListener() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Check sessionStorage for pending flash toasts across navigation/reloads
    try {
      const pendingToast = sessionStorage.getItem("bazardor_toast");
      if (pendingToast) {
        sessionStorage.removeItem("bazardor_toast");
        const data = JSON.parse(pendingToast);
        if (data?.type === "success" && data?.message) {
          toast.success(data.message, { id: "auth-toast", duration: 4000 });
        } else if (data?.type === "error" && data?.message) {
          toast.error(data.message, { id: "auth-toast", duration: 4000 });
        }
      }
    } catch {
      // ignore
    }

    // 2. Check query param ?auth=signin or ?auth=signout
    const authStatus = searchParams.get("auth");
    if (authStatus) {
      if (authStatus === "signin" || authStatus === "signed_in") {
        toast.success("সফল ভাবে সাইন ইন হয়েছে", { id: "auth-toast", duration: 4000 });
      } else if (authStatus === "signout" || authStatus === "signed_out") {
        toast.success("সফল ভাবে সাইন আউট হয়েছে", { id: "auth-toast", duration: 4000 });
      }

      // Clean query parameter from URL without page reload
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("auth");
      const newQuery = newParams.toString();
      const newUrl = pathname + (newQuery ? `?${newQuery}` : "");
      window.history.replaceState(null, "", newUrl);
    }
  }, [searchParams, pathname]);

  return null;
}

export default function ToastProvider() {
  return (
    <>
      <Suspense fallback={null}>
        <ToastListener />
      </Suspense>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            padding: "10px 18px",
            fontSize: "0.9375rem",
            fontWeight: "500",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </>
  );
}
