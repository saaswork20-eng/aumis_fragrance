"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { createOrderAction } from "./actions";
import { ShieldCheck, Truck, ArrowRight, AlertCircle, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const estimatedTax = subtotal * 0.05;
  const total = subtotal + shipping + estimatedTax;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <ShoppingBag className="h-12 w-12 text-text-muted" />
        <h2 className="mt-4 font-heading text-2xl font-bold text-text-main">Your Bag is Empty</h2>
        <p className="mt-1 text-sm text-text-muted">Please add products before checking out.</p>
        <Link href="/shop" className="mt-6 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-white">
          Browse Collection
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      ...formData,
      items: items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      })),
    };

    const res = await createOrderAction(payload);
    setIsSubmitting(false);

    if (res.success && res.orderId) {
      clearCart();
      router.push(`/checkout/success?orderId=${res.orderId}`);
    } else {
      setError(res.error || "Failed to place order.");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Order Finalization</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-text-main md:text-4xl">
            Luxury Delivery & Checkout
          </h1>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Shipping Form */}
          <div className="space-y-8 lg:col-span-7">
            <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-text-main">
                <Truck className="h-5 w-5 text-accent" />
                Shipping Destination
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Lord Charles Sterling"
                    className="w-full rounded-lg border border-border-subtle bg-primary/30 p-2.5 text-sm focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                    Contact Telephone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 019-2834"
                    className="w-full rounded-lg border border-border-subtle bg-primary/30 p-2.5 text-sm focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="street" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                    Street Address & Suite
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="450 Fragrance Avenue, Suite 100"
                    className="w-full rounded-lg border border-border-subtle bg-primary/30 p-2.5 text-sm focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className="w-full rounded-lg border border-border-subtle bg-primary/30 p-2.5 text-sm focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                    State / Region
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                    className="w-full rounded-lg border border-border-subtle bg-primary/30 p-2.5 text-sm focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                    Postal / ZIP Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="10001"
                    className="w-full rounded-lg border border-border-subtle bg-primary/30 p-2.5 text-sm focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border-subtle bg-primary/30 p-2.5 text-sm focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-heading text-xl font-bold text-text-main">
                Payment Option
              </h2>
              <p className="mt-1 text-xs text-text-muted">
                Demo Mode: Complimentary Client Preview / Cash on Delivery. No credit card charged.
              </p>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-accent bg-accent/5 p-4">
                <input type="radio" id="demoPayment" name="paymentMethod" defaultChecked className="text-accent" />
                <label htmlFor="demoPayment" className="text-xs font-bold text-text-main">
                  AUMIS Concierge Complimentary Billing (VIP Client Preview)
                </label>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-heading text-xl font-bold text-text-main">
                Order Review ({items.length} items)
              </h2>

              <div className="mt-6 max-h-72 divide-y divide-border-subtle overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-center gap-3 py-3">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-primary">
                      <Image src={item.image} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-text-main">{item.productName}</p>
                      <p className="text-text-muted font-medium">{item.variantName} &times; {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-text-main">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 border-t border-border-subtle pt-4 text-xs">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-main">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Delivery</span>
                  <span>{shipping === 0 ? "Complimentary Free Delivery" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Estimated Tax (5%)</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border-subtle pt-3 text-sm">
                  <div className="flex justify-between font-heading text-lg font-bold text-text-main">
                    <span>Grand Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold tracking-wider text-white transition hover:bg-accent-hover shadow-md disabled:opacity-60"
              >
                {isSubmitting ? "Securing Order..." : "Place Order Now"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>Verified End-to-End Secure Processing</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
