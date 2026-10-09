import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import { getAllCategories, getAllProducts } from "@/lib/api";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর — আজকের নিত্যপণ্যের দাম",
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের দাম, বাজারভিত্তিক তুলনা ও দামের পরিবর্তন এক জায়গায়।",
  applicationName: "বাজার দর",
  keywords: ["বাজার দর", "আজকের দাম", "ঢাকা বাজার", "মূল্য তালিকা", "BazarDor"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: any[] = [];
  let products: any[] = [];

  try {
    const results = await Promise.allSettled([getAllCategories(), getAllProducts()]);
    if (results[0].status === "fulfilled") categories = results[0].value;
    if (results[1].status === "fulfilled") products = results[1].value;
  } catch (err) {
    console.error("Error loading layout data:", err);
  }

  return (
    <html lang="bn" data-theme="bazardor" className={notoSansBengali.variable}>
      <body className="bg-base-200 text-base-content antialiased font-sans">
        <ToastProvider />
        <div className="flex min-h-screen flex-col">
          <Navbar categories={categories} />
          <PriceTicker products={products} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
