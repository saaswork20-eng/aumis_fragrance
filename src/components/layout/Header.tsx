"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Menu, X, LogOut, Shield, Store, Package } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export function Header() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-50 bg-white/95 px-5 py-4 shadow-sm backdrop-blur-md transition-all md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="font-heading text-2xl font-bold tracking-widest text-accent hover:text-accent-hover transition">
          AUMIS
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            <li>
              <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-text-main transition-colors hover:text-accent">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-xs font-semibold uppercase tracking-widest text-text-main transition-colors hover:text-accent">
                Collection
              </Link>
            </li>
            <li>
              <Link href="/#about" className="text-xs font-semibold uppercase tracking-widest text-text-main transition-colors hover:text-accent">
                Our Story
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Actions: Cart & Auth */}
        <div className="flex items-center gap-5">
          {/* Cart Icon */}
          <Link
            href="/cart"
            aria-label="View Shopping Cart"
            className="relative flex items-center p-1 text-text-main transition-transform hover:scale-110 hover:text-accent"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* User Account / Auth Actions */}
          <div className="hidden items-center gap-3 sm:flex">
            {session?.user ? (
              <div className="flex items-center gap-3">
                {role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-text-main transition hover:bg-accent hover:text-white"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                )}
                {role === "SELLER" && (
                  <Link
                    href="/seller"
                    className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-text-main transition hover:bg-accent hover:text-white"
                  >
                    <Store className="h-3.5 w-3.5" />
                    Seller Hub
                  </Link>
                )}
                {role === "BUYER" && (
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-text-main transition hover:bg-accent hover:text-white"
                  >
                    <Package className="h-3.5 w-3.5" />
                    My Orders
                  </Link>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Sign Out"
                  className="rounded-full p-1.5 text-text-muted hover:bg-primary hover:text-text-main transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-xs font-semibold uppercase tracking-wider text-text-main transition hover:text-accent"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-1.5 text-text-main hover:text-accent md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mt-4 border-t border-border-subtle bg-white pt-4 pb-6 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 text-sm font-semibold uppercase tracking-wider text-text-main hover:text-accent"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 text-sm font-semibold uppercase tracking-wider text-text-main hover:text-accent"
            >
              Collection / Shop
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 text-sm font-semibold uppercase tracking-wider text-text-main hover:text-accent"
            >
              Our Story
            </Link>

            <div className="my-2 border-t border-border-subtle pt-2">
              {session?.user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-2 text-xs text-text-muted">
                    Signed in as <span className="font-semibold text-text-main">{session.user.name}</span> ({role})
                  </div>
                  {role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2 py-1.5 text-sm font-medium text-text-main hover:text-accent"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {role === "SELLER" && (
                    <Link
                      href="/seller"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2 py-1.5 text-sm font-medium text-text-main hover:text-accent"
                    >
                      Seller Portal
                    </Link>
                  )}
                  {role === "BUYER" && (
                    <Link
                      href="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2 py-1.5 text-sm font-medium text-text-main hover:text-accent"
                    >
                      My Orders
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 text-left text-sm font-medium text-red-600 hover:underline"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg border border-border-subtle py-2 text-center text-sm font-semibold text-text-main"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg bg-accent py-2 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
