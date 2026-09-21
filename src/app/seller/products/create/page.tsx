import { prisma } from "@/lib/prisma";
import { createSellerProductAction } from "../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CreateProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/seller/products"
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-main"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Fragrances
      </Link>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm sm:p-10">
        <div className="border-b border-border-subtle pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">New Formulation</span>
          <h1 className="mt-1 font-heading text-2xl font-bold text-text-main">
            Add Fragrance to Collection
          </h1>
        </div>

        <form action={createSellerProductAction} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                Fragrance Title / Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="e.g. Royal Amber Taif"
                className="w-full rounded-lg border border-border-subtle p-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                Fragrance Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                className="w-full rounded-lg border border-border-subtle bg-white p-2.5 text-sm focus:border-accent focus:outline-none"
              >
                <option value="">Select a category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="basePrice" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                Base Retail Price ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                id="basePrice"
                name="basePrice"
                required
                placeholder="120.00"
                className="w-full rounded-lg border border-border-subtle p-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                Scent Profile & Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                placeholder="Describe the top, heart, and base notes. e.g. Aged Cambodian oud, wild Taif rose, ambergris, and soft Madagascan vanilla..."
                className="w-full rounded-lg border border-border-subtle p-2.5 text-sm focus:border-accent focus:outline-none"
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="imageUrl" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                Bottle Imagery URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                required
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-lg border border-border-subtle p-2.5 text-sm focus:border-accent focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-text-muted">
                Provide a high-resolution HTTPS image URL (Unsplash or Cloudinary hosted).
              </p>
            </div>

            <div className="sm:col-span-2 border-t border-border-subtle pt-6">
              <h3 className="font-heading text-base font-bold text-text-main mb-4">
                Primary Bottle Size & Stock Formulation
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="sku" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-main">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    required
                    placeholder="OUD-AMB-50"
                    className="w-full rounded-lg border border-border-subtle p-2 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="variantName" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-main">
                    Size / Volume Name
                  </label>
                  <input
                    type="text"
                    id="variantName"
                    name="variantName"
                    required
                    placeholder="50ml Spray or 12ml Oil"
                    className="w-full rounded-lg border border-border-subtle p-2 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="variantPrice" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-main">
                    Variant Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="variantPrice"
                    name="variantPrice"
                    required
                    placeholder="120.00"
                    className="w-full rounded-lg border border-border-subtle p-2 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="stock" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-main">
                    Initial Available Stock (Bottles)
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    required
                    defaultValue={50}
                    min={0}
                    className="w-full rounded-lg border border-border-subtle p-2 text-xs focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-border-subtle pt-6">
            <Link
              href="/seller/products"
              className="rounded-full px-6 py-2.5 text-xs font-semibold text-text-muted hover:text-text-main"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-full bg-accent px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-md"
            >
              Publish Fragrance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
