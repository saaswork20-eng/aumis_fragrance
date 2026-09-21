import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { updateSellerProductAction } from "../../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { include: { inventory: true }, take: 1 },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  // Strict IDOR Check: Ensure product exists and belongs to the seller (or user is ADMIN)
  if (!product || (product.sellerId !== session.user.id && session.user.role !== "ADMIN")) {
    notFound();
  }

  const defaultStock = product.variants[0]?.inventory?.availableQuantity ?? 0;
  const defaultImage = product.images[0]?.url ?? "";

  const updateActionWithId = updateSellerProductAction.bind(null, product.id);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/seller/products"
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-main"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Fragrances
      </Link>

      <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm sm:p-10">
        <div className="border-b border-border-subtle pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Edit Formulation</span>
          <h1 className="mt-1 font-heading text-2xl font-bold text-text-main">
            Edit Fragrance: {product.name}
          </h1>
        </div>

        <form action={updateActionWithId} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                Fragrance Title
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={product.name}
                className="w-full rounded-lg border border-border-subtle p-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue={product.categoryId}
                className="w-full rounded-lg border border-border-subtle bg-white p-2.5 text-sm focus:border-accent focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="basePrice" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                Base Price ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                id="basePrice"
                name="basePrice"
                required
                defaultValue={Number(product.basePrice)}
                className="w-full rounded-lg border border-border-subtle p-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                Description & Scent Notes
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                defaultValue={product.description}
                className="w-full rounded-lg border border-border-subtle p-2.5 text-sm focus:border-accent focus:outline-none"
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="imageUrl" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                required
                defaultValue={defaultImage}
                className="w-full rounded-lg border border-border-subtle p-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="stock" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                Adjust Inventory Stock (Bottles available)
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                defaultValue={defaultStock}
                min={0}
                className="w-full rounded-lg border border-border-subtle p-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-border-subtle pt-6">
            <Link
              href="/seller/products"
              className="rounded-full px-6 py-2.5 text-xs font-semibold text-text-muted hover:text-text-main"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-full bg-accent px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-md"
            >
              Update Fragrance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
