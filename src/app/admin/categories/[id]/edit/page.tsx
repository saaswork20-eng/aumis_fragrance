import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminUpdateCategoryAction } from "../../actions";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const updateWithId = adminUpdateCategoryAction.bind(null, category.id);

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
          <h1 className="font-heading text-2xl font-bold text-text-main">Edit Category: {category.name}</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <form action={updateWithId} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={category.name}
              className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              name="slug"
              required
              defaultValue={category.slug}
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
              defaultValue={category.description || ""}
              placeholder="Describe this fragrance category..."
              className="w-full rounded-xl border border-border-subtle bg-primary/40 px-4 py-2.5 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-primary/30 p-3 text-[11px] text-text-muted">
            <span className="font-semibold text-text-main">Assigned Products: </span>
            {category._count.products} fragrances currently belong to this category.
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
