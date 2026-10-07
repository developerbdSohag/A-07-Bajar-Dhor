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
      className="card border border-base-300 bg-base-100 transition duration-200 hover:border-primary hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary block"
    >
      <div className="card-body gap-3 p-4">
        {/* Top: Emoji + Title + Unit */}
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-base-200 text-2xl select-none"
          >
            {product.image || product.categoryIcon || "🛒"}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-base-content">
              {product.nameBn}
            </h3>
            <p className="text-xs text-base-content/60">প্রতি {unit}</p>
          </div>
        </div>

        {/* Bottom: Price Row + Change Badge */}
        <div className="flex items-end justify-between gap-2 pt-1 border-t border-base-200/60">
          <div>
            <p className="text-xs text-base-content/60">আজকের দাম</p>
            <p className="text-xl font-bold text-base-content">
              {todayPrice}{" "}
              <span className="text-sm font-medium text-base-content/70">টাকা</span>
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full bg-base-200 px-2 py-1 text-xs font-semibold ${changeClass}`}
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
