import Link from "next/link";
import { adminCreateCategoryAction } from "../actions";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CreateCategoryPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/categories"
          className="rounded-full border border-border-subtle bg-white p-2 text-text-muted hover:text-text-main transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Taxonomy & Catalog</span>
          <h1 className="font-heading text-2xl font-bold text-text-main">Create Fragrance Category</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <form action={adminCreateCategoryAction} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Attar, Oud, Gift Sets"
              className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
              URL Slug (Optional — auto-generated if left blank)
            </label>
            <input
              type="text"
              name="slug"
              placeholder="e.g. attar, pure-oud, gift-sets"
              className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe this fragrance category or formulation style..."
              className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle">
            <Link
              href="/admin/categories"
              className="rounded-full border border-border-subtle px-5 py-2.5 text-xs font-semibold text-text-muted hover:text-text-main transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-accent-hover transition"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
