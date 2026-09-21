"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, MessageCircle, Store } from "lucide-react";

type Variant = {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
};

type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
};

type ProductData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  category: {
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    name: string | null;
  };
  images: ProductImage[];
  variants: Variant[];
};

export function ProductDetailClient({ product }: { product: ProductData }) {
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0] || {
      id: `${product.id}-default`,
      sku: `SKU-${product.slug}`,
      name: "Standard",
      price: product.basePrice,
      stock: 50,
    }
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    product.images[0]?.url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800"
  );
  const [isAdded, setIsAdded] = useState(false);

  const isAvailable = selectedVariant.stock > 0;

  const handleAddToCart = () => {
    if (!isAvailable) return;

    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        variantName: selectedVariant.name,
        sku: selectedVariant.sku,
        price: selectedVariant.price,
        image: selectedImage,
        maxStock: selectedVariant.stock,
      },
      quantity
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hello, I would like to inquire about ${product.name} (${selectedVariant.name}) priced at $${selectedVariant.price.toFixed(2)}.`
  )}`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
      {/* Breadcrumb Navigation */}
      <div className="mb-8 flex items-center gap-2 text-xs font-medium text-text-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-accent">Collection</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-accent">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-text-main">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border-subtle bg-[#f5f1ea] shadow-sm">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-cover transition-all duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {!isAvailable && (
              <div className="absolute left-4 top-4 rounded-md bg-black/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                Sold Out
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    selectedImage === img.url ? "border-accent shadow-md" : "border-border-subtle opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={img.altText || product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Purchase Section */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  {product.category.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Store className="h-3.5 w-3.5 text-accent" />
                  Sold by: <span className="font-semibold text-text-main">{product.seller.name || "AUMIS Master Distiller"}</span>
                </span>
              </div>
              <h1 className="font-heading text-3xl font-bold text-text-main md:text-4xl">
                {product.name}
              </h1>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-heading text-3xl font-bold text-text-main">
                  ${selectedVariant.price.toFixed(2)}
                </span>
                <span className="text-xs text-text-muted">Taxes included. Free luxury packaging.</span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-border-subtle pt-6">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-text-main">
                The Fragrance Profile
              </h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {product.description}
              </p>
            </div>

            {/* Variant / Size Selector */}
            {product.variants.length > 0 && (
              <div className="border-t border-border-subtle pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-main">
                    Select Formulation / Size
                  </label>
                  <span className="text-xs text-text-muted">
                    {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setQuantity(1);
                      }}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition ${
                        selectedVariant.id === variant.id
                          ? "border-accent bg-accent/10 shadow-sm"
                          : "border-border-subtle hover:border-accent"
                      }`}
                    >
                      <span className="text-xs font-bold text-text-main">{variant.name}</span>
                      <span className="mt-1 text-xs font-semibold text-accent">
                        ${variant.price.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="border-t border-border-subtle pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Quantity Buttons */}
                <div className="flex h-12 items-center rounded-full border border-border-subtle bg-primary/40 px-4">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || !isAvailable}
                    className="text-lg font-bold text-text-main hover:text-accent disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-text-main">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                    disabled={quantity >= selectedVariant.stock || !isAvailable}
                    className="text-lg font-bold text-text-main hover:text-accent disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold tracking-wide transition ${
                    isAdded
                      ? "bg-green-600 text-white"
                      : "bg-accent text-white hover:bg-accent-hover shadow-md"
                  } disabled:opacity-50`}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-5 w-5" /> Added to Your Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      {isAvailable ? "Add to Cart" : "Out of Stock"}
                    </>
                  )}
                </button>

                {/* WhatsApp Chat Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-border-subtle bg-[#25D366]/10 px-5 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366] hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Inquire
                </a>
              </div>
            </div>

            {/* Value Props & Guarantees */}
            <div className="grid grid-cols-3 gap-4 border-t border-border-subtle pt-6 text-center">
              <div className="flex flex-col items-center gap-1 text-text-muted">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <span className="text-[11px] font-semibold">100% Authentic Pure Extract</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-text-muted">
                <Truck className="h-5 w-5 text-accent" />
                <span className="text-[11px] font-semibold">Complimentary Worldwide Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-text-muted">
                <RefreshCw className="h-5 w-5 text-accent" />
                <span className="text-[11px] font-semibold">Luxury Bottle Presentation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
