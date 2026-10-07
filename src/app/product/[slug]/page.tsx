import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getProductBySlugOrId, getAllProducts } from "@/lib/api";
import {
  formatBengaliNumber,
  formatUnit,
  getChangeClass,
  getChangeIcon,
  getChangeText,
} from "@/lib/format";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Protected route: check authentication session
  const reqHeaders = await headers();
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: reqHeaders,
    });
  } catch {
    // fallback to cookie inspection
  }

  const cookieHeader = reqHeaders.get("cookie") || "";
  const hasAuthCookie =
    cookieHeader.includes("better-auth.session_token") ||
    cookieHeader.includes("__Secure-better-auth.session_token") ||
    cookieHeader.includes("better-auth.session_data") ||
    cookieHeader.includes("__Secure-better-auth.session_data");

  if (!session?.user && !hasAuthCookie) {
    redirect(`/signin?callbackURL=${encodeURIComponent(`/product/${decodedSlug}`)}&protected=1`);
  }

  const product = await getProductBySlugOrId(decodedSlug);

  if (!product) {
    notFound();
  }

  const unit = formatUnit(product.unit);
  const changeClass = getChangeClass(product.change.dir);
  const changeIcon = getChangeIcon(product.change.dir);
  const changePct = formatBengaliNumber(Math.abs(product.change.pct), 1);
  const changeText = getChangeText(product.change.dir);
  const todayPrice = formatBengaliNumber(product.today);

  // Compute market price statistics
  const markets = product.markets || [];
  let minPrice = product.today;
  let maxPrice = product.today;
  let avgPrice = product.today;

  if (markets.length > 0) {
    const mins = markets.map((m) => m.min);
    const maxs = markets.map((m) => m.max);
    minPrice = Math.min(...mins);
    maxPrice = Math.max(...maxs);
    const sumAverages = markets.reduce((acc, m) => acc + (m.min + m.max) / 2, 0);
    avgPrice = Math.round(sumAverages / markets.length);
  }

  // Sorted markets (cheapest first)
  const sortedMarkets = [...markets].sort((a, b) => a.min - b.min);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      {/* Breadcrumbs */}
      <nav aria-label="ব্রেডক্রাম্ব" className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/" className="hover:underline">
              হোম
            </Link>
          </li>
          <li>
            <Link
              href={`/category/${product.category}`}
              className="hover:underline"
            >
              {product.categoryNameBn || product.category}
            </Link>
          </li>
          <li className="font-medium text-base-content">{product.nameBn}</li>
        </ul>
      </nav>

      {/* Product Summary Header */}
      <header className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start sm:items-center gap-4">
            <span
              aria-hidden="true"
              className="grid size-20 shrink-0 place-items-center rounded-2xl bg-base-200 text-4xl select-none"
            >
              {product.image || product.categoryIcon || "🛒"}
            </span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold sm:text-3xl text-base-content">
                {product.nameBn}
              </h1>
              <p className="text-sm text-base-content/70 mt-1">
                প্রতি {unit} · {product.categoryNameBn || product.category}
              </p>
              <p className="mt-2 text-sm text-base-content/70">
                গতকালের তুলনায় আজ দাম{" "}
                <span className="font-semibold text-base-content">{changeText}</span>{" "}
                {changePct}%
              </p>
            </div>
          </div>

          {/* Today's Price Box */}
          <div className="rounded-box bg-base-200 px-6 py-4 text-center sm:min-w-[160px]">
            <p className="text-xs text-base-content/70 font-medium">আজকের দাম</p>
            <p className="text-3xl font-bold text-base-content my-1">{todayPrice}</p>
            <p className="text-xs text-base-content/70">টাকা / {unit}</p>
            <span
              className={`inline-flex items-center gap-1 font-semibold text-xs mt-2 ${changeClass}`}
              title={changeText}
            >
              <span aria-hidden="true">{changeIcon}</span>
              <span>{changePct}%</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Details Card */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-8">
          {/* Price Summary Stats */}
          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="mb-3 text-lg font-bold text-base-content">
              দামের সারসংক্ষেপ
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="stat rounded-box border border-base-300 bg-base-100 p-4">
                <div className="stat-title text-sm">সর্বনিম্ন দাম</div>
                <div className="stat-value text-2xl text-success font-bold mt-1">
                  {formatBengaliNumber(minPrice)}
                  <span className="text-sm font-medium"> টাকা</span>
                </div>
                <div className="stat-desc text-xs mt-1">সবচেয়ে কম দামের বাজার</div>
              </div>

              <div className="stat rounded-box border border-base-300 bg-base-100 p-4">
                <div className="stat-title text-sm">সর্বাধিক দাম</div>
                <div className="stat-value text-2xl text-error font-bold mt-1">
                  {formatBengaliNumber(maxPrice)}
                  <span className="text-sm font-medium"> টাকা</span>
                </div>
                <div className="stat-desc text-xs mt-1">সবচেয়ে বেশি দামের বাজার</div>
              </div>

              <div className="stat rounded-box border border-base-300 bg-base-100 p-4">
                <div className="stat-title text-sm">গড় দাম</div>
                <div className="stat-value text-2xl text-primary font-bold mt-1">
                  {formatBengaliNumber(avgPrice)}
                  <span className="text-sm font-medium"> টাকা</span>
                </div>
                <div className="stat-desc text-xs mt-1">প্রতি {unit}-এর হিসাবে</div>
              </div>
            </div>
          </section>

          {/* Bazar-wise Price Table */}
          <section aria-labelledby="bazar-table-heading">
            <h2 id="bazar-table-heading" className="mb-3 text-lg font-bold text-base-content">
              বাজারভিত্তিক আজকের দাম
            </h2>

            {sortedMarkets.length === 0 ? (
              <p className="text-sm text-base-content/60">বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
            ) : (
              <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
                <table className="table table-zebra w-full text-sm">
                  <thead>
                    <tr className="bg-base-200/50">
                      <th>বাজার</th>
                      <th>বিভাগ</th>
                      <th className="text-right">সর্বনিম্ন</th>
                      <th className="text-right">সর্বাধিক</th>
                      <th className="text-right">গড়</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMarkets.map((m, idx) => {
                      const avg = (m.min + m.max) / 2;
                      return (
                        <tr key={`${m.market}-${idx}`} className="hover">
                          <td className="font-medium text-base-content">{m.market}</td>
                          <td className="text-base-content/70">{m.division}</td>
                          <td className="text-right font-medium">
                            {formatBengaliNumber(m.min)} টাকা
                          </td>
                          <td className="text-right font-medium">
                            {formatBengaliNumber(m.max)} টাকা
                          </td>
                          <td className="text-right font-semibold text-primary">
                            {formatBengaliNumber(avg, Number.isInteger(avg) ? 0 : 2)} টাকা
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
