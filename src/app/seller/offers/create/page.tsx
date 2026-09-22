import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { sellerCreateOfferAction } from "../actions";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface CreateOfferPageProps {
  searchParams: Promise<{ productId?: string }>;
}

export default async function SellerCreateOfferPage({ searchParams }: CreateOfferPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const { productId } = await searchParams;

  // Query only this seller's products
  const products = await prisma.product.findMany({
    where: {
      sellerId: session.user.id,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      basePrice: true,
      offer: { select: { id: true, discountPercentage: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/seller/offers"
          className="rounded-full border border-border-subtle bg-white p-2 text-text-muted hover:text-text-main transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Promotions & Discounts</span>
          <h1 className="font-heading text-2xl font-bold text-text-main">Create Product Offer</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-semibold text-text-main">No active fragrances available</p>
            <p className="text-xs text-text-muted mt-1">Please list an active fragrance first before creating an offer.</p>
            <Link
              href="/seller/products/create"
              className="mt-4 inline-block rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white"
            >
              Add Fragrance
            </Link>
          </div>
        ) : (
          <form action={sellerCreateOfferAction} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
                Select Your Fragrance Product *
              </label>
              <select
                name="productId"
                required
                defaultValue={productId || ""}
                className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
              >
                <option value="">Choose one of your fragrances...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${Number(p.basePrice).toFixed(2)})
                    {p.offer ? ` (Currently ${p.offer.discountPercentage}% OFF)` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
                Discount Percentage (%) *
              </label>
              <div className="flex gap-2 mb-2">
                {[5, 10, 15, 20, 25, 30].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("sellerDiscountInput") as HTMLInputElement;
                      if (input) input.value = pct.toString();
                    }}
                    className="rounded-lg border border-border-subtle bg-primary px-3 py-1 text-xs font-bold text-text-main hover:bg-accent hover:text-white transition"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <input
                id="sellerDiscountInput"
                type="number"
                name="discountPercentage"
                required
                min={1}
                max={90}
                defaultValue={15}
                placeholder="e.g. 15"
                className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
                  Start Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-text-main cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked
                  className="h-4 w-4 rounded text-accent focus:ring-accent"
                />
                <span>Activate Offer Immediately</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle">
              <Link
                href="/seller/offers"
                className="rounded-full border border-border-subtle px-5 py-2.5 text-xs font-semibold text-text-muted hover:text-text-main transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-accent-hover transition"
              >
                Apply Offer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
