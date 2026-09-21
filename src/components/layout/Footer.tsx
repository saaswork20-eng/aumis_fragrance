"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border-subtle bg-white px-5 pb-8 pt-16 md:px-10">
      <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand Info */}
        <div className="flex flex-col">
          <Link href="/" className="mb-4 font-heading text-2xl font-bold tracking-widest text-accent">
            AUMIS
          </Link>
          <p className="text-sm text-text-muted leading-relaxed">
            Elevating your presence with unparalleled fragrances crafted from the world&apos;s finest natural agarwood, rare florals, and pure perfume oils.
          </p>
        </div>

        {/* Shop Navigation */}
        <div>
          <h3 className="mb-5 font-heading text-base font-bold text-text-main">Fragrance Vault</h3>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li>
              <Link href="/shop" className="text-text-muted transition-colors hover:text-accent">
                All Collections
              </Link>
            </li>
            <li>
              <Link href="/shop?category=oud" className="text-text-muted transition-colors hover:text-accent">
                Pure Aged Oud
              </Link>
            </li>
            <li>
              <Link href="/shop?category=attar" className="text-text-muted transition-colors hover:text-accent">
                Concentrated Attars
              </Link>
            </li>
            <li>
              <Link href="/shop?category=perfume" className="text-text-muted transition-colors hover:text-accent">
                Artisanal Spray Perfumes
              </Link>
            </li>
          </ul>
        </div>

        {/* Marketplace & Accounts */}
        <div>
          <h3 className="mb-5 font-heading text-base font-bold text-text-main">Marketplace</h3>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li>
              <Link href="/auth/login" className="text-text-muted transition-colors hover:text-accent">
                Account Sign In
              </Link>
            </li>
            <li>
              <Link href="/auth/register" className="text-text-muted transition-colors hover:text-accent">
                Register as Buyer or Seller
              </Link>
            </li>
            <li>
              <Link href="/seller" className="text-text-muted transition-colors hover:text-accent">
                Distiller & Seller Hub
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-text-muted transition-colors hover:text-accent">
                Executive Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="mb-5 font-heading text-base font-bold text-text-main">VIP Fragrance Circle</h3>
          <p className="mb-4 text-xs text-text-muted leading-relaxed">
            Subscribe for private releases, seasonal attar batches, and luxury fragrance guides.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-xs font-medium text-green-800">
              <Check className="h-4 w-4 text-green-600" />
              <span>Thank you for joining our private circle.</span>
            </div>
          ) : (
            <form className="flex" onSubmit={handleSubscribe}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-l-lg border border-border-subtle bg-primary/40 px-3 py-2 text-xs text-text-main focus:border-accent focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-r-lg bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-border-subtle pt-8 text-center text-xs text-text-muted">
        &copy; {new Date().getFullYear()} AUMIS Fragrance. All rights reserved. Crafted for timeless elegance.
      </div>
    </footer>
  );
}
