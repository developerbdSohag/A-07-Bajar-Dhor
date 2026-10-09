"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getBanglaDate } from "@/lib/format";

export default function Hero() {
  const [banglaDate, setBanglaDate] = useState("বুধবার, ৭ অক্টোবর, ২০২৬");

  useEffect(() => {
    setBanglaDate(getBanglaDate(new Date()));
  }, []);

  return (
    <section className="hero rounded-3xl border border-base-300 bg-base-100 shadow-sm">
      <div className="hero-content w-full flex-col items-start gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="mb-2.5 inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-sm sm:text-base font-semibold text-primary">
            {banglaDate}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl text-base-content tracking-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="mt-3.5 text-base-content/80 text-base sm:text-lg leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়,
            সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="#সব-পণ্য"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm sm:text-base font-semibold text-primary-content shadow-md shadow-primary/20 hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
            >
              <span>সব পণ্য দেখুন</span>
              <span aria-hidden="true" className="text-base sm:text-lg">↓</span>
            </a>
          </div>
        </div>

        <div className="flex justify-center w-full lg:w-auto">
          <img
            src="/bazar-hero.svg"
            alt="তাজা বাজারের ঝুড়ি"
            width={360}
            height={288}
            className="h-auto w-full max-w-xs shrink-0 sm:max-w-sm drop-shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}
