import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  adminToggleProductStatusAction,
  adminDeleteProductAction,
  adminToggleBestSellerAction,
  adminToggleNewLaunchAction,
} from "./actions";
import { PlusCircle, Power, Trash2, ExternalLink, Flame, Sparkles, Tag } from "lucide-react";
import { isOfferActive } from "@/services/product.service";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      seller: { select: { name: true, email: true } },
      images: { where: { isPrimary: true }, take: 1 },
      variants: { include: { inventory: true } },
      offer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Catalog Moderation</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-text-main">
            All Platform Products ({products.length})
          </h1>
        </div>

        <Link
          href="/seller/products/create"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Add Platform Fragrance
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-muted">
            <thead className="border-b border-border-subtle bg-primary/60 text-[10px] font-bold uppercase tracking-wider text-text-main">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Seller</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Merchandising Badges</th>
                <th className="px-6 py-4">Active Offer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {products.map((product) => {
                const totalStock = product.variants.reduce(
                  (acc, v) => acc + (v.inventory?.availableQuantity ?? 0),
                  0
                );
                const imageUrl = product.images[0]?.url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400";
                const hasActiveOffer = isOfferActive(product.offer);

                return (
                  <tr key={product.id} className="hover:bg-primary/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-primary">
                          <Image src={imageUrl} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-text-main">{product.name}</span>
                            <Link href={`/products/${product.slug}`} target="_blank" title="View on Storefront">
                              <ExternalLink className="h-3.5 w-3.5 text-text-muted hover:text-accent" />
                            </Link>
                          </div>
                          <p className="text-[10px] text-text-muted">/{product.slug} • {totalStock} in stock</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-text-main">{product.seller.name || "AUMIS Reserve"}</span>
                      <p className="text-[10px] text-text-muted">{product.seller.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-text-main">{product.category.name}</td>
                    <td className="px-6 py-4 font-bold text-text-main">${Number(product.basePrice).toFixed(2)}</td>

                    {/* Merchandising Badges (Best Seller & New Launch toggles) */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        {/* Best Seller Toggle */}
                        <form action={adminToggleBestSellerAction.bind(null, product.id)}>
                          <button
                            type="submit"
                            title={product.isBestSeller ? "Remove Best Seller status" : "Mark as Best Seller"}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                              product.isBestSeller
                                ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                                : "bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-700"
                            }`}
                          >
                            <Flame className="h-3 w-3" />
                            {product.isBestSeller ? "BEST SELLER ✓" : "+ Best Seller"}
                          </button>
                        </form>

                        {/* New Launch Toggle */}
                        <form action={adminToggleNewLaunchAction.bind(null, product.id)}>
                          <button
                            type="submit"
                            title={product.isNewLaunch ? "Remove New Launch status" : "Mark as New Launch"}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                              product.isNewLaunch
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                          >
                            <Sparkles className="h-3 w-3" />
                            {product.isNewLaunch ? "NEW LAUNCH ✓" : "+ New Launch"}
                          </button>
                        </form>
                      </div>
                    </td>

                    {/* Offer column */}
                    <td className="px-6 py-4">
                      {hasActiveOffer && product.offer ? (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800">
                            <Tag className="h-3 w-3" />
                            {product.offer.discountPercentage}% OFF
                          </span>
                          <Link
                            href="/admin/offers"
                            className="text-[10px] text-accent hover:underline font-medium"
                          >
                            Manage
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={`/admin/offers/create?productId=${product.id}`}
                          className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline font-semibold"
                        >
                          + Add Offer
                        </Link>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <form action={adminToggleProductStatusAction.bind(null, product.id)}>
                          <button
                            type="submit"
                            title={product.isActive ? "Deactivate Product" : "Activate Product"}
                            className={`rounded p-1.5 transition ${
                              product.isActive ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                            }`}
                          >
                            <Power className="h-4 w-4" />
                          </button>
                        </form>

                        <form action={adminDeleteProductAction.bind(null, product.id)}>
                          <button
                            type="submit"
                            title="Delete Product"
                            className="rounded p-1.5 text-red-500 hover:bg-red-50 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
