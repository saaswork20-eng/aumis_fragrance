import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle, Power, Trash2, Edit, ExternalLink } from "lucide-react";
import {
  adminToggleCarouselSlideStatusAction,
  adminDeleteCarouselSlideAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCarouselPage() {
  const slides = await prisma.carouselSlide.findMany({
    include: {
      product: { select: { id: true, name: true, slug: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Storefront Merchandising</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-text-main">
            Homepage Carousel Slides ({slides.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Manage promotional hero slides displayed to customers on the homepage.
          </p>
        </div>

        <Link
          href="/admin/carousel/create"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Add Carousel Slide
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
        {slides.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <p className="font-heading text-lg font-medium text-text-main">No carousel slides created</p>
            <p className="mt-1 text-xs">Create your first slide to display a luxury hero banner on the homepage.</p>
            <Link
              href="/admin/carousel/create"
              className="mt-4 inline-block rounded-full bg-accent px-6 py-2 text-xs font-semibold text-white"
            >
              Create First Slide
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-muted">
              <thead className="border-b border-border-subtle bg-primary/60 text-[10px] font-bold uppercase tracking-wider text-text-main">
                <tr>
                  <th className="px-6 py-4">Slide Image</th>
                  <th className="px-6 py-4">Title & Description</th>
                  <th className="px-6 py-4">Destination Link</th>
                  <th className="px-6 py-4">Discount Promo</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {slides.map((slide) => {
                  let destinationLabel = "Store Catalog (/shop)";
                  let destinationUrl = "/shop";

                  if (slide.product) {
                    destinationLabel = `Product: ${slide.product.name}`;
                    destinationUrl = `/products/${slide.product.slug}`;
                  } else if (slide.category) {
                    destinationLabel = `Category: ${slide.category.name}`;
                    destinationUrl = `/shop?category=${slide.category.slug}`;
                  }

                  return (
                    <tr key={slide.id} className="hover:bg-primary/30 transition">
                      <td className="px-6 py-4">
                        <div className="relative h-14 w-24 overflow-hidden rounded-lg bg-primary">
                          <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <span className="font-bold text-text-main">{slide.title}</span>
                        <p className="line-clamp-1 text-[11px] text-text-muted">{slide.description}</p>
                        <p className="text-[10px] text-accent font-medium mt-0.5">CTA: &ldquo;{slide.ctaText}&rdquo;</p>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={destinationUrl}
                          target="_blank"
                          className="inline-flex items-center gap-1 font-semibold text-text-main hover:text-accent"
                        >
                          <span>{destinationLabel}</span>
                          <ExternalLink className="h-3 w-3 text-text-muted" />
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {slide.discountText ? (
                          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800">
                            {slide.discountText}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-text-main">{slide.displayOrder}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            slide.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {slide.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/carousel/${slide.id}/edit`}
                            title="Edit Slide"
                            className="rounded p-1.5 text-text-muted hover:bg-primary hover:text-text-main transition"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          <form action={adminToggleCarouselSlideStatusAction.bind(null, slide.id)}>
                            <button
                              type="submit"
                              title={slide.isActive ? "Deactivate Slide" : "Activate Slide"}
                              className={`rounded p-1.5 transition ${
                                slide.isActive ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                              }`}
                            >
                              <Power className="h-4 w-4" />
                            </button>
                          </form>

                          <form action={adminDeleteCarouselSlideAction.bind(null, slide.id)}>
                            <button
                              type="submit"
                              title="Delete Slide"
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
