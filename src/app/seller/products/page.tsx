import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  toggleSellerProductStatusAction,
  deleteSellerProductAction,
  toggleSellerProductNewLaunchAction,
} from "../actions";
import { PlusCircle, Edit, Trash2, Power, Flame, Sparkles, Tag, ExternalLink } from "lucide-react";
import { isOfferActive } from "@/services/product.service";

export const dynamic = "force-dynamic";

export default async function SellerProductsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const products = await prisma.product.findMany({
    where: {
      sellerId: session.user.id,
    },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      variants: {
        include: { inventory: true },
      },
      offer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Catalog Management</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-text-main">
            My Fragrances ({products.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Manage your listed artisanal creations, new launches, discounts, and inventory.
          </p>
        </div>

        <Link
          href="/seller/products/create"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Add Fragrance
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <p className="font-heading text-lg font-medium text-text-main">No fragrances listed yet</p>
            <p className="mt-1 text-xs">Create your first artisanal perfume or attar to start selling.</p>
            <Link
              href="/seller/products/create"
              className="mt-4 inline-block rounded-full bg-accent px-6 py-2 text-xs font-semibold text-white"
            >
              Add First Fragrance
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-muted">
              <thead className="border-b border-border-subtle bg-primary/60 text-[10px] font-bold uppercase tracking-wider text-text-main">
                <tr>
                  <th className="px-6 py-4">Fragrance</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Base Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Merchandising & Offers</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border-subtle">
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
                              <Link
                                href={`/products/${product.slug}`}
                                className="font-bold text-text-main hover:text-accent transition"
                              >
                                {product.name}
                              </Link>
                              <ExternalLink className="h-3 w-3 text-text-muted" />
                            </div>
                            <p className="text-[10px] text-text-muted">Slug: /{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-text-main">{product.category.name}</td>
                      <td className="px-6 py-4 font-bold text-text-main">${Number(product.basePrice).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${totalStock < 10 ? "text-amber-600" : "text-text-main"}`}>
                          {totalStock} units
                        </span>
                      </td>

                      {/* Merchandising & Offers Column */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          {/* Best Seller Status (Read-only for seller, set by admin) */}
                          {product.isBestSeller && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                              <Flame className="h-3 w-3" />
                              Best Seller (Featured by Admin)
                            </span>
                          )}

                          {/* New Launch Toggle (Seller can toggle for own products) */}
                          <form action={toggleSellerProductNewLaunchAction.bind(null, product.id)}>
                            <button
                              type="submit"
                              title={product.isNewLaunch ? "Unmark as New Launch" : "Mark as New Launch"}
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                                product.isNewLaunch
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                  : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                              }`}
                            >
                              <Sparkles className="h-3 w-3" />
                              {product.isNewLaunch ? "NEW LAUNCH ✓" : "+ Mark New Launch"}
                            </button>
                          </form>

                          {/* Active Offer Status / Link */}
                          {hasActiveOffer && product.offer ? (
                            <div className="flex items-center gap-1">
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold">
                                <Tag className="h-3 w-3" />
                                {product.offer.discountPercentage}% OFF
                              </span>
                              <Link
                                href="/seller/offers"
                                className="text-[10px] text-accent hover:underline font-medium"
                              >
                                Edit Offer
                              </Link>
                            </div>
                          ) : (
                            <Link
                              href={`/seller/offers/create?productId=${product.id}`}
                              className="text-[10px] font-semibold text-accent hover:underline"
                            >
                              + Add Offer
                            </Link>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {product.isActive ? "ACTIVE" : "HIDDEN"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/seller/products/${product.id}/edit`}
                            title="Edit Product"
                            className="rounded p-1.5 text-text-muted hover:bg-primary hover:text-text-main transition"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          <form action={toggleSellerProductStatusAction.bind(null, product.id)}>
                            <button
                              type="submit"
                              title={product.isActive ? "Hide from Store" : "Publish to Store"}
                              className={`rounded p-1.5 transition ${
                                product.isActive ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                              }`}
                            >
                              <Power className="h-4 w-4" />
                            </button>
                          </form>

                          <form action={deleteSellerProductAction.bind(null, product.id)}>
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
        )}
      </div>
    </div>
  );
}
