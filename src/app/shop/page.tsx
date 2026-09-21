import { getActiveProducts, getCategories } from "@/services/product.service";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import Link from "next/link";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, search, sort } = await searchParams;

  const [categories, rawProducts] = await Promise.all([
    getCategories(),
    getActiveProducts(category, search),
  ]);

  const products = [...rawProducts];

  if (sort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  }

  const activeCategory = category || "all";

  return (
    <div className="min-h-screen bg-primary/40 pb-24">
      {/* Header Banner */}
      <div className="border-b border-border-subtle bg-white py-12 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="font-heading text-4xl font-bold text-text-main md:text-5xl">
            Fragrance Collection
          </h1>
          <p className="mt-3 text-sm text-text-muted md:text-base">
            Discover artisanal attars, pure aged oud, and signature perfumes crafted for discerning collectors.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mx-auto max-w-7xl px-5 pt-10">
        <div className="flex flex-col gap-6 rounded-2xl border border-border-subtle bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/shop"
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider transition ${
                activeCategory === "all"
                  ? "bg-accent text-white"
                  : "bg-primary text-text-muted hover:text-text-main"
              }`}
            >
              All Scents ({rawProducts.length})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}${search ? `&search=${encodeURIComponent(search)}` : ""}${sort ? `&sort=${sort}` : ""}`}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider transition ${
                  activeCategory === cat.slug
                    ? "bg-accent text-white"
                    : "bg-primary text-text-muted hover:text-text-main"
                }`}
              >
                {cat.name} ({cat._count.products})
              </Link>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input Form */}
            <form method="GET" action="/shop" className="relative">
              {category && <input type="hidden" name="category" value={category} />}
              {sort && <input type="hidden" name="sort" value={sort} />}
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Search perfumes..."
                className="w-full rounded-full border border-border-subtle bg-primary py-2 pl-9 pr-4 text-xs text-text-main placeholder-text-muted focus:border-accent focus:bg-white focus:outline-none sm:w-56"
              />
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            </form>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-muted">Sort:</span>
              <div className="flex gap-1">
                <Link
                  href={`/shop?${category ? `category=${category}&` : ""}${search ? `search=${encodeURIComponent(search)}&` : ""}sort=featured`}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    !sort || sort === "featured"
                      ? "bg-text-main text-white"
                      : "text-text-muted hover:bg-primary"
                  }`}
                >
                  Featured
                </Link>
                <Link
                  href={`/shop?${category ? `category=${category}&` : ""}${search ? `search=${encodeURIComponent(search)}&` : ""}sort=price-asc`}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    sort === "price-asc"
                      ? "bg-text-main text-white"
                      : "text-text-muted hover:bg-primary"
                  }`}
                >
                  Price ↑
                </Link>
                <Link
                  href={`/shop?${category ? `category=${category}&` : ""}${search ? `search=${encodeURIComponent(search)}&` : ""}sort=price-desc`}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    sort === "price-desc"
                      ? "bg-text-main text-white"
                      : "text-text-muted hover:bg-primary"
                  }`}
                >
                  Price ↓
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          title=""
          subtitle=""
        />
      </div>
    </div>
  );
}
