"use client";

import Link from "next/link";
import { Product } from "@/types";
import { formatBengaliNumber, formatUnit, getChangeClass, getChangeIcon } from "@/lib/format";

interface PriceTickerProps {
  products: Product[];
}

export default function PriceTicker({ products }: PriceTickerProps) {
  if (!products || products.length === 0) return null;

  // Duplicate items for continuous seamless loop
  const displayItems = [...products, ...products];

  // Calculate comfortable, readable scroll duration (~3.8s per product, min 110s)
  const durationSec = Math.max(110, Math.round(products.length * 3.8));

  return (
    <div
      className="ticker overflow-hidden border-b border-base-300 bg-base-100"
      role="marquee"
      aria-label="আজকের দাম পরিবর্তনের তালিকা"
    >
      <div
        className="ticker-track"
        style={{ animationDuration: `${durationSec}s` }}
      >
        <ul className="flex shrink-0 items-center">
          {displayItems.map((prod, idx) => {
            const changeClass = getChangeClass(prod.change.dir);
            const changeIcon = getChangeIcon(prod.change.dir);
            const changePct = formatBengaliNumber(Math.abs(prod.change.pct), 1);
            const todayPrice = formatBengaliNumber(prod.today);
            const unit = formatUnit(prod.unit);

            return (
              <li
                key={`${prod.slug || prod.id}-${idx}`}
                className="flex items-center gap-2 border-e border-base-200 px-4 py-2 text-sm sm:text-base whitespace-nowrap"
              >
                <Link
                  href={`/product/${prod.slug || prod.id}`}
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <span aria-hidden="true" className="text-base sm:text-lg">{prod.image || prod.categoryIcon}</span>
                  <span className="font-semibold text-base-content">{prod.nameBn}</span>
                  <span className="text-base-content/75 font-medium">
                    {todayPrice} টাকা/{unit}
                  </span>
                  <span className={`font-bold ${changeClass}`}>
                    {changeIcon} {changePct}%
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
