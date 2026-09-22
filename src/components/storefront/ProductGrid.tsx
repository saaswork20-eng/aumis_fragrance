"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { ShoppingBag, MessageCircle, Check, Sparkles, Flame, Tag } from "lucide-react";
import { useState } from "react";

export type ProductDisplay = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug?: string;
  sellerName?: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  hasDiscount?: boolean;
  isNewLaunch?: boolean;
  isBestSeller?: boolean;
  image: string;
  isAvailable: boolean;
};

interface ProductGridProps {
  products: ProductDisplay[];
  title?: string;
  subtitle?: string;
  id?: string;
}

export function ProductGrid({
  products,
  title = "Our Signature Scents",
  subtitle,
  id = "collection",
}: ProductGridProps) {
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleQuickAdd = (e: React.MouseEvent, product: ProductDisplay) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      variantId: `${product.id}-default`,
      productId: product.id,
      productName: product.name,
      variantName: "Standard Size",
      sku: `SKU-${product.slug.toUpperCase()}`,
      price: product.price, // Uses verified discounted price
      image: product.image,
      maxStock: 50,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id={id} className="mx-auto max-w-7xl px-5 py-12 md:py-16">
      {title && (
        <div className="text-center">
          <h2 className="relative inline-block font-heading text-3xl font-bold text-text-main md:text-4xl after:absolute after:-bottom-4 after:left-1/2 after:h-[2px] after:w-16 after:-translate-x-1/2 after:bg-accent">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-6 text-sm text-text-muted md:text-base max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border-subtle bg-white/60 p-12 text-center text-text-muted">
          <p className="font-heading text-lg font-medium">No fragrances found.</p>
          <p className="mt-1 text-sm">Try adjusting your category filter or search query.</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const isAdded = !!addedIds[product.id];
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
              `Hello AUMIS Fragrance, I would like to inquire about ${product.name} ($${product.price.toFixed(2)}).`
            )}`;

            const showDiscount = !!product.hasDiscount && (product.discountPercentage ?? 0) > 0;
            const originalPrice = product.originalPrice ?? product.price;

            return (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl"
              >
                {/* Clickable Image Container */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block h-72 sm:h-80 w-full overflow-hidden bg-[#f4efe8]"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />

                  {/* Badges Stack (Top Left) */}
                  <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5 z-10">
                    {product.isBestSeller && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                        <Flame className="h-3 w-3" />
                        Best Seller
                      </span>
                    )}

                    {product.isNewLaunch && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-700/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                        <Sparkles className="h-3 w-3" />
                        New Launch
                      </span>
                    )}

                    {showDiscount && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-600/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm animate-pulse">
                        <Tag className="h-3 w-3" />
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {!product.isAvailable && (
                    <div className="absolute right-3 top-3 rounded-md bg-black/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm z-10">
                      Sold Out
                    </div>
                  )}

                  {product.sellerName && (
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-text-muted backdrop-blur-sm">
                      {product.sellerName}
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="flex flex-grow flex-col p-5 sm:p-6">
                  <div className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-accent">
                    {product.category}
                  </div>

                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mb-2 font-heading text-lg font-bold text-text-main transition-colors group-hover:text-accent line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="line-clamp-2 flex-grow text-xs leading-relaxed text-text-muted mb-4">
                    {product.description}
                  </p>

                  <div className="mt-auto border-t border-border-subtle/60 pt-4">
                    <div className="mb-3 flex items-baseline justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-text-muted">Price</span>
                      <div className="flex items-baseline gap-2">
                        {showDiscount && originalPrice > product.price && (
                          <span className="text-xs text-text-muted line-through font-medium">
                            ${originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className={`font-heading text-xl font-bold ${showDiscount ? "text-rose-700" : "text-text-main"}`}>
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        disabled={!product.isAvailable}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold tracking-wide transition ${
                          isAdded
                            ? "bg-green-600 text-white"
                            : "bg-text-main text-white hover:bg-black"
                        } disabled:opacity-50 disabled:hover:bg-text-main`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {product.isAvailable ? "Add to Cart" : "Out of Stock"}
                          </>
                        )}
                      </button>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Inquire about ${product.name} on WhatsApp`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-[#25D366]/10 text-[#25D366] transition hover:bg-[#25D366] hover:text-white"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
