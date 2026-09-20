"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-white px-5 pb-8 pt-16 md:px-10">
      <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col">
          <Link href="/" className="mb-4 font-heading text-2xl font-bold tracking-widest text-accent">
            AUMIS
          </Link>
          <p className="text-sm text-text-muted">
            Elevating your presence with unparalleled fragrances crafted from the world's finest ingredients.
          </p>
        </div>
        
        <div>
          <h3 className="mb-6 font-heading text-lg font-semibold text-text-main">Shop</h3>
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="#" className="text-sm text-text-muted transition-colors hover:pl-1 hover:text-accent">
                All Perfumes
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-text-muted transition-colors hover:pl-1 hover:text-accent">
                Premium Attars
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-text-muted transition-colors hover:pl-1 hover:text-accent">
                Gift Sets
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-text-muted transition-colors hover:pl-1 hover:text-accent">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="mb-6 font-heading text-lg font-semibold text-text-main">Help</h3>
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="#" className="text-sm text-text-muted transition-colors hover:pl-1 hover:text-accent">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-text-muted transition-colors hover:pl-1 hover:text-accent">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-text-muted transition-colors hover:pl-1 hover:text-accent">
                Returns & Exchanges
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-text-muted transition-colors hover:pl-1 hover:text-accent">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="mb-6 font-heading text-lg font-semibold text-text-main">Newsletter</h3>
          <p className="mb-4 text-sm text-text-muted">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full rounded-l-md border border-border-subtle bg-primary px-4 py-2 text-sm focus:border-accent focus:outline-none"
            />
            <button className="rounded-r-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="border-t border-border-subtle pt-8 text-center text-sm text-text-muted">
        &copy; {new Date().getFullYear()} AUMIS Fragrance. All rights reserved. Built for elegance.
      </div>
    </footer>
  );
}
