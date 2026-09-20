import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminAdsPage() {
  const ads = await prisma.advertisement.findMany({
    include: { advertiser: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="rounded-xl border border-border-subtle bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-main">All Advertisements</h2>
        <Link 
          href="/admin/ads/create"
          className="rounded-full bg-text-main px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-black"
        >
          + Create New Ad
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-text-muted">
          <thead className="bg-primary text-xs uppercase text-text-main">
            <tr>
              <th className="px-6 py-3">Ad Title</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Placement</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Schedule</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                  No advertisements found. Create one to get started.
                </td>
              </tr>
            ) : (
              ads.map((ad) => (
                <tr key={ad.id} className="border-b border-border-subtle hover:bg-primary/50">
                  <td className="px-6 py-4 font-medium text-text-main">
                    {ad.title}
                  </td>
                  <td className="px-6 py-4">{ad.advertiser.name}</td>
                  <td className="px-6 py-4">{ad.placement.replace(/_/g, " ")}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                      ad.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      ad.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                      ad.status === 'EXPIRED' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(ad.startDate), "MMM d, yyyy")} - <br/>
                    {format(new Date(ad.endDate), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-accent hover:underline">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
