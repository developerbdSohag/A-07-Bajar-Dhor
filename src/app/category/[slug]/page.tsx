import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { getAllCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/api";
import { toBengaliDigits } from "@/lib/format";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const [category, products] = await Promise.all([
    getCategoryBySlug(decodedSlug),
    getProductsByCategory(decodedSlug),
  ]);

  if (!category && (!products || products.length === 0)) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <span className="text-6xl select-none" aria-hidden="true">
          🔍
        </span>
        <h1 className="text-2xl font-bold text-base-content">ক্যাটাগরি পাওয়া যায়নি</h1>
        <p className="max-w-md text-base-content/70">
          এই ক্যাটাগরিতে কোনো পণ্য নেই অথবা ক্যাটাগরিটি বিদ্যমান নয়।
        </p>
        <Link href="/" className="btn btn-primary mt-2">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const categoryName = category?.nameBn || decodedSlug;
  const categoryIcon = category?.icon || "🛒";
  const countBn = toBengaliDigits(products.length);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      {/* Category Header */}
      <header className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="text-4xl select-none">
            {categoryIcon}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-base-content">{categoryName}</h1>
            <p className="text-sm text-base-content/70">
              {countBn}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>
      </header>

      {/* Product List with Sorting */}
      <ProductGrid products={products} showSort={true} />
    </div>
  );
}
