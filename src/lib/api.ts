import { Product, Category } from "@/types";

const BASE_URL_1 = process.env.NEXT_PUBLIC_BASE_URL_1 || "https://api.api-store.workers.dev/api/bazardor";
const BASE_URL_2 = process.env.NEXT_PUBLIC_BASE_URL_2 || "https://api.abcz.workers.dev/api/bazardor";

async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url1 = `${BASE_URL_1}${endpoint}`;
  try {
    const res = await fetch(url1, {
      ...options,
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch (err) {
    console.warn(`Fetch from BASE_URL_1 failed for ${endpoint}, falling back to BASE_URL_2`, err);
  }

  const url2 = `${BASE_URL_2}${endpoint}`;
  const res = await fetch(url2, {
    ...options,
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch from both APIs for ${endpoint}. Status: ${res.status}`);
  }
  return (await res.json()) as T;
}

/**
 * Fetch all products
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    return await fetchFromApi<Product[]>("/products");
  } catch (err) {
    console.error("Error fetching all products:", err);
    return [];
  }
}

/**
 * Fetch products filtered by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    return await fetchFromApi<Product[]>(`/products?category=${encodeURIComponent(category)}`);
  } catch (err) {
    console.error(`Error fetching products for category ${category}:`, err);
    return [];
  }
}

/**
 * Fetch all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    return await fetchFromApi<Category[]>("/categories");
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await fetchFromApi<Category>(`/categories/${encodeURIComponent(slug)}`);
  } catch {
    // If single category endpoint 404s, try finding in all categories
    try {
      const all = await getAllCategories();
      return all.find((c) => c.slug === slug || c.id === slug) || null;
    } catch {
      return null;
    }
  }
}

/**
 * Fetch a single product by numeric id or slug.
 * The API natively supports /products/:id.
 * If given a slug, we look it up from /products.
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

  // Look up in all products by slug or id
  try {
    const all = await getAllProducts();
    const str = String(slugOrId);
    const found = all.find((p) => p.slug === str || String(p.id) === str);
    return found || null;
  } catch (err) {
    console.error(`Error fetching product ${slugOrId}:`, err);
    return null;
  }
}
