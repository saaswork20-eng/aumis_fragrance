import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Shield, Package, Users, ShoppingCart, Megaphone, ArrowLeft, Layers, Sliders, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  // Enforce server-side role check: ONLY ADMIN
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f6f2] md:flex-row">
      {/* Mobile Top Navigation */}
      <header className="border-b border-border-subtle bg-white px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-accent" />
            <span className="font-heading text-lg font-bold tracking-wider text-accent">AUMIS Admin</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text-main"
          >
            <ArrowLeft className="h-3 w-3" />
            Storefront
          </Link>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
          <Link
            href="/admin"
            className="whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-text-main hover:bg-accent hover:text-white transition"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-text-main hover:bg-accent hover:text-white transition"
          >
            Products
          </Link>
          <Link
            href="/admin/categories"
            className="whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-text-main hover:bg-accent hover:text-white transition"
          >
            Categories
          </Link>
          <Link
            href="/admin/carousel"
            className="whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-text-main hover:bg-accent hover:text-white transition"
          >
            Carousel
          </Link>
          <Link
            href="/admin/offers"
            className="whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-text-main hover:bg-accent hover:text-white transition"
          >
            Offers
          </Link>
          <Link
            href="/admin/orders"
            className="whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-text-main hover:bg-accent hover:text-white transition"
          >
            Orders
          </Link>
          <Link
            href="/admin/users"
            className="whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-text-main hover:bg-accent hover:text-white transition"
          >
            Users
          </Link>
          <Link
            href="/admin/ads"
            className="whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-text-main hover:bg-accent hover:text-white transition"
          >
            Ads
          </Link>
        </nav>
      </header>

      {/* Sidebar */}
      <aside className="w-64 border-r border-border-subtle bg-white p-6 shadow-sm hidden md:block">
        <div className="mb-8">
          <Link href="/" className="font-heading text-2xl font-bold tracking-widest text-accent">
            AUMIS
          </Link>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-text-main">
            <Shield className="h-3.5 w-3.5 text-accent" />
            <span>Executive Admin Control</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-text-main transition hover:bg-primary"
          >
            <Shield className="h-4 w-4 text-accent" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-text-main transition hover:bg-primary"
          >
            <Package className="h-4 w-4 text-accent" />
            All Products
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-text-main transition hover:bg-primary"
          >
            <Layers className="h-4 w-4 text-accent" />
            Categories
          </Link>
          <Link
            href="/admin/carousel"
            className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-text-main transition hover:bg-primary"
          >
            <Sliders className="h-4 w-4 text-accent" />
            Carousel Banners
          </Link>
          <Link
            href="/admin/offers"
            className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-text-main transition hover:bg-primary"
          >
            <Tag className="h-4 w-4 text-accent" />
            Offers & Discounts
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-text-main transition hover:bg-primary"
          >
            <ShoppingCart className="h-4 w-4 text-accent" />
            Orders & Statuses
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-text-main transition hover:bg-primary"
          >
            <Users className="h-4 w-4 text-accent" />
            User Management
          </Link>
          <Link
            href="/admin/ads"
            className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-text-main transition hover:bg-primary"
          >
            <Megaphone className="h-4 w-4 text-accent" />
            Ads & Promotions
          </Link>
        </nav>

        <div className="mt-12 border-t border-border-subtle pt-6">
          <div className="mb-3 px-4 text-[11px] text-text-muted">
            Admin: <span className="font-semibold text-text-main">{session.user.name}</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-text-muted hover:text-text-main"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
