import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminUpdateCarouselSlideAction } from "../../actions";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface EditCarouselSlidePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCarouselSlidePage({ params }: EditCarouselSlidePageProps) {
  const { id } = await params;

  const [slide, products, categories] = await Promise.all([
    prisma.carouselSlide.findUnique({
      where: { id },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!slide) {
    notFound();
  }

  const updateWithId = adminUpdateCarouselSlideAction.bind(null, slide.id);

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
          <h1 className="font-heading text-2xl font-bold text-text-main">Edit Carousel Slide</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <form action={updateWithId} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
              Slide Title *
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={slide.title}
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
              defaultValue={slide.description}
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
              defaultValue={slide.imageUrl}
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
                defaultValue={slide.ctaText}
                className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
                Discount / Promo Badge (Optional)
              </label>
              <input
                type="text"
                name="discountText"
                defaultValue={slide.discountText || ""}
                placeholder="e.g. 15% OFF"
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
                defaultValue={slide.productId || ""}
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
                defaultValue={slide.categoryId || ""}
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
                defaultValue={slide.displayOrder}
                className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-xs font-bold text-text-main cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={slide.isActive}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
