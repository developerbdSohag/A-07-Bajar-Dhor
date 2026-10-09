"use client";

import { useState, useMemo } from "react";
import { Product, SortOption } from "@/types";
import ProductCard from "./ProductCard";
import { toBengaliDigits } from "@/lib/format";

interface ProductGridProps {
  products: Product[];
  showSort?: boolean;
}

export default function ProductGrid({ products, showSort = true }: ProductGridProps) {
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    const list = [...products];
    if (sortOption === "price-asc") {
      return list.sort((a, b) => Number(a.today) - Number(b.today));
    }
    if (sortOption === "price-desc") {
      return list.sort((a, b) => Number(b.today) - Number(a.today));
    }
    return list;
  }, [products, sortOption]);

  const countBn = toBengaliDigits(sortedProducts.length);

  return (
    <div className="flex flex-col gap-4">
      {showSort && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm sm:text-base font-medium text-base-content/75" aria-live="polite">
            মোট <span className="font-bold text-base-content">{countBn}</span>টি পণ্য দেখানো হচ্ছে
          </p>

          <div className="flex items-center gap-2.5">
            <label htmlFor="sort-products" className="text-sm sm:text-base font-semibold text-base-content/80">
              সাজান:
            </label>
            <div className="relative inline-flex items-center">
              <select
                id="sort-products"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none rounded-full border border-base-300/80 bg-base-100 py-2 pl-4 pr-9 text-sm sm:text-base font-semibold text-base-content shadow-xs hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value="default">ডিফল্ট</option>
                <option value="price-asc">দাম: কম থেকে বেশি</option>
                <option value="price-desc">দাম: বেশি থেকে কম</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="pointer-events-none absolute right-3 size-4.5 text-base-content/50"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {sortedProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-base-300 p-12 text-center text-base-content/60">
          কোনো পণ্য পাওয়া যায়নি।
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((prod) => (
            <li key={prod.slug || prod.id} className="contents">
              <ProductCard product={prod} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
