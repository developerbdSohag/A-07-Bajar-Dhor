import Link from "next/link";
import { Product } from "@/types";
import {
  formatBengaliNumber,
  formatUnit,
  getChangeClass,
  getChangeIcon,
  getChangeText,
} from "@/lib/format";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const changeClass = getChangeClass(product.change.dir);
  const changeIcon = getChangeIcon(product.change.dir);
  const changePct = formatBengaliNumber(Math.abs(product.change.pct), 1);
  const changeText = getChangeText(product.change.dir);
  const todayPrice = formatBengaliNumber(product.today);
  const unit = formatUnit(product.unit);

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="group block rounded-2xl border border-base-200/90 bg-base-100 p-4 shadow-xs hover:border-primary/40 hover:shadow-md hover:shadow-base-content/5 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="flex flex-col gap-3">
        {/* Top: Emoji + Title + Unit */}
        <div className="flex items-start gap-3.5">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-2xl bg-base-200/70 text-2xl select-none group-hover:scale-105 transition-transform duration-200"
          >
            {product.image || product.categoryIcon || "🛒"}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-base-content group-hover:text-primary transition-colors">
              {product.nameBn}
            </h3>
            <p className="text-sm text-base-content/70 mt-0.5">প্রতি {unit}</p>
          </div>
        </div>

        {/* Bottom: Price Row + Change Badge */}
        <div className="flex items-end justify-between gap-2 pt-2.5 border-t border-base-200/70">
          <div>
            <p className="text-xs sm:text-sm text-base-content/65">আজকের দাম</p>
            <p className="text-2xl font-bold text-base-content leading-tight">
              {todayPrice}{" "}
              <span className="text-sm font-normal text-base-content/70">টাকা</span>
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold shadow-xs ${changeClass}`}
            title={`গতকালের তুলনায় ${changeText}`}
          >
            <span aria-hidden="true">{changeIcon}</span>
            <span>{changePct}%</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
