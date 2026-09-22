import Link from "next/link";
import { Sparkles, Layers } from "lucide-react";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    products: number;
  };
}

interface CategoryBrowseProps {
  categories: CategoryWithCount[];
  activeCategory?: string;
  totalProductsCount?: number;
}

export function CategoryBrowse({
  categories,
  activeCategory = "all",
  totalProductsCount = 0,
}: CategoryBrowseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
      <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-bold uppercase tracking-widest text-accent">
            <Layers className="h-3.5 w-3.5" />
            <span>Fragrance Families & Formulations</span>
          </div>
          <h2 className="mt-1 font-heading text-3xl font-bold text-text-main md:text-4xl">
            Explore by Category
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-text-muted">
            Select a distillation category to explore artisanal scents curated by our master perfumers.
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-white px-5 py-2 text-xs font-semibold text-text-main shadow-sm transition hover:border-accent hover:text-accent"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span>View Complete Catalog ({totalProductsCount})</span>
        </Link>
      </div>

      {/* Category Pills Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-2.5 pb-2">
        <Link
          href="/shop"
          className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition shadow-sm ${
            activeCategory === "all"
              ? "bg-accent text-white shadow-md scale-105"
              : "bg-white text-text-muted hover:text-text-main hover:bg-primary border border-border-subtle"
          }`}
        >
          All Fragrances ({totalProductsCount})
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition shadow-sm ${
              activeCategory === cat.slug
                ? "bg-accent text-white shadow-md scale-105"
                : "bg-white text-text-muted hover:text-text-main hover:bg-primary border border-border-subtle"
            }`}
          >
            {cat.name} ({cat._count.products})
          </Link>
        ))}
      </div>

      {/* Category Cards Showcase */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Collection
                </span>
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-text-muted">
                  {cat._count.products} {cat._count.products === 1 ? "Product" : "Products"}
                </span>
              </div>
              <h3 className="mt-3 font-heading text-xl font-bold text-text-main transition-colors group-hover:text-accent">
                {cat.name}
              </h3>
              <p className="mt-2 text-xs text-text-muted line-clamp-2 leading-relaxed">
                {cat.description || `Artisanal ${cat.name.toLowerCase()} formulations meticulously crafted by certified distillers.`}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-accent group-hover:underline">
              <span>Browse {cat.name} Scents</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
