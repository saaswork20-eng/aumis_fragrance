import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, Trash2, Edit, ExternalLink, Layers } from "lucide-react";
import { adminDeleteCategoryAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Taxonomy & Catalog</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-text-main">
            Product Categories ({categories.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Manage fragrance categories used for customer storefront browsing, filtering, and navigation.
          </p>
        </div>

        <Link
          href="/admin/categories/create"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
        {categories.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <p className="font-heading text-lg font-medium text-text-main">No categories found</p>
            <p className="mt-1 text-xs">Create your first fragrance category to group products.</p>
            <Link
              href="/admin/categories/create"
              className="mt-4 inline-block rounded-full bg-accent px-6 py-2 text-xs font-semibold text-white"
            >
              Create Category
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-muted">
              <thead className="border-b border-border-subtle bg-primary/60 text-[10px] font-bold uppercase tracking-wider text-text-main">
                <tr>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">URL Slug</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Total Fragrances</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-primary/30 transition">
                    <td className="px-6 py-4 font-bold text-text-main">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-accent" />
                        <span>{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-text-muted">
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 hover:text-accent font-sans"
                      >
                        <span>/{cat.slug}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <p className="line-clamp-2 text-text-muted">
                        {cat.description || "No description provided"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-primary px-3 py-1 font-semibold text-text-main">
                        {cat._count.products} products
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/categories/${cat.id}/edit`}
                          title="Edit Category"
                          className="rounded p-1.5 text-text-muted hover:bg-primary hover:text-text-main transition"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>

                        <form action={adminDeleteCategoryAction.bind(null, cat.id)}>
                          <button
                            type="submit"
                            title={
                              cat._count.products > 0
                                ? "Cannot delete category with active products"
                                : "Delete Category"
                            }
                            disabled={cat._count.products > 0}
                            className={`rounded p-1.5 transition ${
                              cat._count.products > 0
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-red-500 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
