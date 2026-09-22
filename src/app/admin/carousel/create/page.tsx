import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { adminCreateCarouselSlideAction } from "../actions";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CreateCarouselSlidePage() {
  const [products, categories, maxOrderSlide] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.carouselSlide.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    }),
  ]);

  const defaultOrder = (maxOrderSlide?.displayOrder ?? 0) + 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/carousel"
          className="rounded-full border border-border-subtle bg-white p-2 text-text-muted hover:text-text-main transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Homepage Merchandising</span>
          <h1 className="font-heading text-2xl font-bold text-text-main">Create Carousel Slide</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <form action={adminCreateCarouselSlideAction} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
              Slide Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Discover Our Signature Oud Collection"
              className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
              Description / Subtitle *
            </label>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="e.g. Meticulously distilled pure attars and luxury perfumes formulated with rare aged extracts."
              className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
              Slide Background Image URL *
            </label>
            <input
              type="url"
              name="imageUrl"
              required
              placeholder="https://images.unsplash.com/... (High-res landscape recommended)"
              className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                name="ctaText"
                defaultValue="Shop Now"
                className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
                Discount / Badge Text (Optional)
              </label>
              <input
                type="text"
                name="discountText"
                placeholder="e.g. 15% OFF or UP TO 20% OFF"
                className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
                Link to Product (Optional)
              </label>
              <select
                name="productId"
                className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
              >
                <option value="">None (Generic Link)</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
                Link to Category (Optional)
              </label>
              <select
                name="categoryId"
                className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                defaultValue={defaultOrder}
                className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-xs font-bold text-text-main cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked
                  className="h-4 w-4 rounded text-accent focus:ring-accent"
                />
                <span>Active & Visible to Customers</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle">
            <Link
              href="/admin/carousel"
              className="rounded-full border border-border-subtle px-5 py-2.5 text-xs font-semibold text-text-muted hover:text-text-main transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-accent-hover transition"
            >
              Publish Slide
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
