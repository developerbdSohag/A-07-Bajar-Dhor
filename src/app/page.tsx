import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import { getAllProducts } from "@/lib/api";
import { Product } from "@/types";

export const revalidate = 60;

export default async function HomePage() {
  const products: Product[] = await getAllProducts();

  // Top 6 risers: change.dir === 'up', sorted descending by pct
  const risers = products
    .filter((p) => p.change && p.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  // Top 6 fallers: change.dir === 'down', sorted descending by drop pct
  const fallers = products
    .filter((p) => p.change && p.change.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-6">
      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Section A: আজ দাম বেড়েছে ▲ */}
      {risers.length > 0 && (
        <section aria-labelledby="heading-risers">
          <div className="mb-3 flex items-center gap-2">
            <span aria-hidden="true" className="text-error text-lg font-bold">
              ▲
            </span>
            <h2 id="heading-risers" className="text-xl font-bold text-base-content">
              আজ দাম বেড়েছে
            </h2>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {risers.map((prod) => (
              <li key={`riser-${prod.slug || prod.id}`} className="contents">
                <ProductCard product={prod} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3. Section B: আজ দাম কমেছে ▼ */}
      {fallers.length > 0 && (
        <section aria-labelledby="heading-fallers">
          <div className="mb-3 flex items-center gap-2">
            <span aria-hidden="true" className="text-success text-lg font-bold">
              ▼
            </span>
            <h2 id="heading-fallers" className="text-xl font-bold text-base-content">
              আজ দাম কমেছে
            </h2>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fallers.map((prod) => (
              <li key={`faller-${prod.slug || prod.id}`} className="contents">
                <ProductCard product={prod} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3. Section C: সব পণ্য */}
      <section id="সব-পণ্য" className="scroll-mt-32" aria-labelledby="heading-all-products">
        <h2 id="heading-all-products" className="mb-3 text-xl font-bold text-base-content">
          সব পণ্য
        </h2>
        <ProductGrid products={products} showSort={true} />
      </section>
    </div>
  );
}
