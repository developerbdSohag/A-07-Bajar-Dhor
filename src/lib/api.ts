import { Product, Category } from "@/types";
import fallbackProductsData from "@/data/products.json";
import fallbackCategoriesData from "@/data/categories.json";

const fallbackProducts: Product[] = fallbackProductsData as unknown as Product[];
const fallbackCategories: Category[] = fallbackCategoriesData as unknown as Category[];

const API_BASE_URLS = [
  process.env.NEXT_PUBLIC_MAIN_API_URL || "https://openapi.programming-hero.com/api/bazardor",
  process.env.NEXT_PUBLIC_BASE_URL_1 || "https://api.api-store.workers.dev/api/bazardor",
  process.env.NEXT_PUBLIC_BASE_URL_2 || "https://api.abcz.workers.dev/api/bazardor",
];

async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let lastError: unknown = null;

  for (const baseUrl of API_BASE_URLS) {
    const url = `${baseUrl}${endpoint}`;
    try {
      const res = await fetch(url, {
        ...options,
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          return (await res.json()) as T;
        }
      }
    } catch (err) {
      lastError = err;
      console.warn(`Fetch from ${baseUrl} failed for ${endpoint}, checking next API:`, err);
    }
  }

  throw new Error(`Failed to fetch from all 3 APIs for ${endpoint}. Last error: ${String(lastError)}`);
}

/**
 * Fetch all products with local fallback
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const prods = await fetchFromApi<Product[]>("/products");
    if (Array.isArray(prods) && prods.length > 0) return prods;
  } catch (err) {
    console.warn("Using fallback products dataset:", err);
  }
  return fallbackProducts;
}

/**
 * Fetch products filtered by category with local fallback
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const decoded = decodeURIComponent(category).trim().toLowerCase();
  try {
    const prods = await fetchFromApi<Product[]>(`/products?category=${encodeURIComponent(category)}`);
    if (Array.isArray(prods) && prods.length > 0) return prods;
  } catch (err) {
    console.warn(`Using fallback products for category ${category}:`, err);
  }

  return fallbackProducts.filter(
    (p) =>
      p.category?.toLowerCase() === decoded ||
      p.categoryNameBn?.toLowerCase() === decoded ||
      p.slug?.toLowerCase() === decoded
  );
}

/**
 * Fetch all categories with local fallback
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const cats = await fetchFromApi<Category[]>("/categories");
    if (Array.isArray(cats) && cats.length > 0) return cats;
  } catch (err) {
    console.warn("Using fallback categories dataset:", err);
  }
  return fallbackCategories;
}

/**
 * Fetch a single category by slug with local fallback
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  try {
    const cat = await fetchFromApi<Category>(`/categories/${encodeURIComponent(slug)}`);
    if (cat && cat.slug) return cat;
  } catch {
    // try fallback list
  }

  const all = await getAllCategories();
  return (
    all.find(
      (c) =>
        c.slug?.toLowerCase() === decoded ||
        c.id?.toLowerCase() === decoded ||
        c.nameBn?.toLowerCase() === decoded
    ) || null
  );
}

/**
 * Fetch a single product by numeric id or slug with local fallback
 */
export async function getProductBySlugOrId(slugOrId: string | number): Promise<Product | null> {
  const isNumeric = !isNaN(Number(slugOrId));
  if (isNumeric) {
    try {
      const prod = await fetchFromApi<Product>(`/products/${slugOrId}`);
      if (prod && prod.id) return prod;
    } catch {
      // fallback to list lookup
    }
  }

  try {
    const all = await getAllProducts();
    const str = decodeURIComponent(String(slugOrId)).trim().toLowerCase();
    const found = all.find(
      (p) =>
        p.slug?.toLowerCase() === str ||
        String(p.id) === str ||
        p.nameBn?.toLowerCase() === str
    );
    if (found) return found;
  } catch (err) {
    console.error(`Error fetching product ${slugOrId}:`, err);
  }

  const str = decodeURIComponent(String(slugOrId)).trim().toLowerCase();
  return (
    fallbackProducts.find(
      (p) =>
        p.slug?.toLowerCase() === str ||
        String(p.id) === str ||
        p.nameBn?.toLowerCase() === str
    ) || null
  );
}
