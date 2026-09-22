import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { deleteAdAction } from "./actions";
import { Edit, Trash2, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  const ads = await prisma.advertisement.findMany({
    include: { advertiser: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Marketing & Campaigns</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-text-main">
            All Advertisements ({ads.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Manage promotional campaigns and placements across the storefront.
          </p>
        </div>

        <Link
          href="/admin/ads/create"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Ad
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-muted">
            <thead className="border-b border-border-subtle bg-primary/60 text-[10px] font-bold uppercase tracking-wider text-text-main">
              <tr>
                <th className="px-6 py-4">Ad Title</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Placement</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {ads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    <p className="font-heading text-lg font-medium text-text-main">No advertisements found</p>
                    <p className="mt-1 text-xs">Create an ad to display banners across customer portals.</p>
                    <Link
                      href="/admin/ads/create"
                      className="mt-4 inline-block rounded-full bg-accent px-6 py-2 text-xs font-semibold text-white"
                    >
                      Create First Ad
                    </Link>
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-primary/30 transition">
                    <td className="px-6 py-4 font-bold text-text-main">
                      {ad.title}
                    </td>
                    <td className="px-6 py-4">{ad.advertiser.name}</td>
                    <td className="px-6 py-4 font-medium text-text-main">{ad.placement.replace(/_/g, " ")}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          ad.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : ad.status === "PAUSED"
                            ? "bg-yellow-100 text-yellow-700"
                            : ad.status === "EXPIRED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(ad.startDate), "MMM d, yyyy")} &mdash; <br />
                      {format(new Date(ad.endDate), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/ads/${ad.id}/edit`}
                          title="Edit Advertisement"
                          className="rounded p-1.5 text-text-muted hover:bg-primary hover:text-text-main transition"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <form action={deleteAdAction.bind(null, ad.id)}>
                          <button
                            type="submit"
                            title="Delete Advertisement"
                            className="rounded p-1.5 text-red-500 hover:bg-red-50 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
