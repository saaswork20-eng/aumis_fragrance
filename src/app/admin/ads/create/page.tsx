import { prisma } from "@/lib/prisma";
import { createAdAction } from "../actions";
import Link from "next/link";

export default async function CreateAdPage() {
  const advertisers = await prisma.advertiser.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border-subtle bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-4 border-b border-border-subtle pb-4">
        <Link href="/admin/ads" className="text-text-muted hover:text-text-main">&larr; Back</Link>
        <h2 className="text-xl font-bold text-text-main">Create Advertisement</h2>
      </div>

      <form action={createAdAction} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Basic Info */}
          <div className="space-y-4 sm:col-span-2">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-text-main">Advertisement Title</label>
              <input type="text" id="title" name="title" required className="w-full rounded-md border border-border-subtle p-2 focus:border-accent focus:outline-none" />
            </div>
            
            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-text-main">Description (Optional)</label>
              <textarea id="description" name="description" rows={3} className="w-full rounded-md border border-border-subtle p-2 focus:border-accent focus:outline-none"></textarea>
            </div>
          </div>

          {/* Advertiser & Placement */}
          <div>
            <label htmlFor="advertiserId" className="mb-1 block text-sm font-medium text-text-main">Advertiser Company</label>
            <select id="advertiserId" name="advertiserId" required className="w-full rounded-md border border-border-subtle p-2 focus:border-accent focus:outline-none bg-white">
              <option value="">Select an advertiser...</option>
              {advertisers.map(adv => (
                <option key={adv.id} value={adv.id}>{adv.name}</option>
              ))}
            </select>
            {advertisers.length === 0 && (
              <p className="mt-1 text-xs text-red-500">No advertisers exist. Please create one in the database first.</p>
            )}
          </div>

          <div>
            <label htmlFor="placement" className="mb-1 block text-sm font-medium text-text-main">Placement</label>
            <select id="placement" name="placement" required className="w-full rounded-md border border-border-subtle p-2 focus:border-accent focus:outline-none bg-white">
              <option value="HOMEPAGE_BANNER">Homepage Banner</option>
              <option value="PRODUCT_GRID_INLINE">Product Grid Inline</option>
              <option value="PROMO_MODAL">Promo Modal</option>
            </select>
          </div>

          {/* Media & URL */}
          <div className="sm:col-span-2">
            <label htmlFor="imageUrl" className="mb-1 block text-sm font-medium text-text-main">Image URL</label>
            <input type="url" id="imageUrl" name="imageUrl" placeholder="https://..." required className="w-full rounded-md border border-border-subtle p-2 focus:border-accent focus:outline-none" />
          </div>

          <div>
            <label htmlFor="destinationUrl" className="mb-1 block text-sm font-medium text-text-main">Destination URL (Click link)</label>
            <input type="url" id="destinationUrl" name="destinationUrl" placeholder="https://..." required className="w-full rounded-md border border-border-subtle p-2 focus:border-accent focus:outline-none" />
          </div>

          <div>
            <label htmlFor="ctaText" className="mb-1 block text-sm font-medium text-text-main">Call To Action Text</label>
            <input type="text" id="ctaText" name="ctaText" defaultValue="Learn More" required className="w-full rounded-md border border-border-subtle p-2 focus:border-accent focus:outline-none" />
          </div>

          {/* Scheduling */}
          <div>
            <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-text-main">Start Date</label>
            <input type="datetime-local" id="startDate" name="startDate" required className="w-full rounded-md border border-border-subtle p-2 focus:border-accent focus:outline-none" />
          </div>

          <div>
            <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-text-main">End Date</label>
            <input type="datetime-local" id="endDate" name="endDate" required className="w-full rounded-md border border-border-subtle p-2 focus:border-accent focus:outline-none" />
          </div>

          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium text-text-main">Initial Status</label>
            <select id="status" name="status" required className="w-full rounded-md border border-border-subtle p-2 focus:border-accent focus:outline-none bg-white">
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-border-subtle pt-6">
          <Link href="/admin/ads" className="rounded-full px-6 py-2 text-sm font-medium text-text-muted hover:text-text-main">
            Cancel
          </Link>
          <button type="submit" className="rounded-full bg-accent px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-accent-hover">
            Save Advertisement
          </button>
        </div>
      </form>
    </div>
  );
}
