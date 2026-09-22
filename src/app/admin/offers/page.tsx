import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, Power, Trash2, Edit, Tag, ExternalLink } from "lucide-react";
import {
  adminToggleOfferStatusAction,
  adminDeleteOfferAction,
} from "./actions";
import { isOfferActive, computeDiscountedPrice } from "@/services/product.service";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const offers = await prisma.productOffer.findMany({
    include: {
      product: {
        include: {
          seller: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Pricing & Merchandising</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-text-main">
            Platform Offers & Discounts ({offers.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Manage promotional discounts applied to fragrances across the platform. Final prices are strictly calculated server-side.
          </p>
        </div>

        <Link
          href="/admin/offers/create"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Offer
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
        {offers.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <p className="font-heading text-lg font-medium text-text-main">No product offers active</p>
            <p className="mt-1 text-xs">Create promotional discounts for fragrances to drive merchandising campaigns.</p>
            <Link
              href="/admin/offers/create"
              className="mt-4 inline-block rounded-full bg-accent px-6 py-2 text-xs font-semibold text-white"
            >
              Create First Offer
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-muted">
              <thead className="border-b border-border-subtle bg-primary/60 text-[10px] font-bold uppercase tracking-wider text-text-main">
                <tr>
                  <th className="px-6 py-4">Fragrance</th>
                  <th className="px-6 py-4">Distiller / Seller</th>
                  <th className="px-6 py-4">Discount %</th>
                  <th className="px-6 py-4">Base vs Discounted Price</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {offers.map((offer) => {
                  const basePrice = Number(offer.product.basePrice);
                  const discountedPrice = computeDiscountedPrice(basePrice, offer.discountPercentage);
                  const isCurrentlyActive = isOfferActive(offer);

                  return (
                    <tr key={offer.id} className="hover:bg-primary/30 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/products/${offer.product.slug}`}
                            target="_blank"
                            className="font-bold text-text-main hover:text-accent flex items-center gap-1"
                          >
                            <span>{offer.product.name}</span>
                            <ExternalLink className="h-3 w-3 text-text-muted" />
                          </Link>
                        </div>
                        <p className="text-[10px] text-text-muted">{offer.product.category.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-text-main">{offer.product.seller.name || "AUMIS Reserve"}</span>
                        <p className="text-[10px] text-text-muted">{offer.product.seller.email}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-rose-700">
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                          <Tag className="h-3 w-3" />
                          {offer.discountPercentage}% OFF
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="line-through text-text-muted mr-1.5">${basePrice.toFixed(2)}</span>
                        <span className="font-bold text-text-main">${discountedPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-text-muted">
                        {offer.startDate || offer.endDate ? (
                          <span>
                            {offer.startDate ? new Date(offer.startDate).toLocaleDateString() : "Immediate"} -{" "}
                            {offer.endDate ? new Date(offer.endDate).toLocaleDateString() : "Indefinite"}
                          </span>
                        ) : (
                          <span className="text-gray-400">Always active</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isCurrentlyActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {isCurrentlyActive ? "ACTIVE" : "INACTIVE / EXPIRED"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/offers/${offer.id}/edit`}
                            title="Edit Offer"
                            className="rounded p-1.5 text-text-muted hover:bg-primary hover:text-text-main transition"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          <form action={adminToggleOfferStatusAction.bind(null, offer.id)}>
                            <button
                              type="submit"
                              title={offer.isActive ? "Deactivate Offer" : "Activate Offer"}
                              className={`rounded p-1.5 transition ${
                                offer.isActive ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                              }`}
                            >
                              <Power className="h-4 w-4" />
                            </button>
                          </form>

                          <form action={adminDeleteOfferAction.bind(null, offer.id)}>
                            <button
                              type="submit"
                              title="Delete Offer"
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
