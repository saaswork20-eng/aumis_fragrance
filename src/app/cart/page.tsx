"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();

  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const estimatedTax = subtotal * 0.05; // 5% luxury goods tax
  const orderTotal = subtotal + shipping + estimatedTax;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-accent">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h1 className="mt-6 font-heading text-3xl font-bold text-text-main">
          Your Shopping Bag is Empty
        </h1>
        <p className="mt-2 max-w-md text-sm text-text-muted">
          Your luxury fragrance curation awaits. Explore our collection of artisanal perfumes, pure attars, and rare oud.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-accent px-8 py-3 text-sm font-semibold tracking-wider text-white transition hover:bg-accent-hover shadow-md"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Shopping Bag
            </span>
            <h1 className="mt-1 font-heading text-3xl font-bold text-text-main md:text-4xl">
              Your Curated Scents ({totalItems})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-red-600 transition self-start sm:self-auto"
          >
            Clear Bag
          </button>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Items List */}
          <div className="space-y-4 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
              <div className="divide-y divide-border-subtle">
                {items.map((item) => (
                  <div key={item.variantId} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                    {/* Item Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-primary">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
                      <div>
                        <Link
                          href={`/products/${item.sku.replace("SKU-", "").toLowerCase()}`}
                          className="font-heading text-lg font-bold text-text-main hover:text-accent transition"
                        >
                          {item.productName}
                        </Link>
                        <p className="mt-0.5 text-xs text-text-muted font-medium">
                          Formulation: <span className="text-text-main">{item.variantName}</span>
                        </p>
                        <p className="mt-1 text-sm font-semibold text-accent">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity Selector & Removal */}
                      <div className="mt-4 flex items-center justify-between gap-6 sm:mt-0">
                        <div className="flex h-9 items-center rounded-full border border-border-subtle bg-primary/40 px-3">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="text-base font-bold text-text-muted hover:text-text-main"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-text-main">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="text-base font-bold text-text-muted hover:text-text-main disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        <div className="w-24 text-right font-heading text-base font-bold text-text-main">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>

                        <button
                          onClick={() => removeItem(item.variantId)}
                          aria-label={`Remove ${item.productName}`}
                          className="text-text-muted hover:text-red-600 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/shop"
                className="text-xs font-semibold uppercase tracking-wider text-accent hover:underline"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-heading text-xl font-bold text-text-main">
                Order Summary
              </h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-main">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? "Free (Orders > $150)" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Estimated Tax (5%)</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border-subtle pt-4">
                  <div className="flex justify-between font-heading text-xl font-bold text-text-main">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-accent-hover shadow-md"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>Secure Checkout with Guaranteed Authentic Fragrances</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
