import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, AlertTriangle, ShoppingCart, DollarSign, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const sellerId = session.user.id;

  // Real database metrics for this seller
  const [totalProducts, activeProducts, sellerOrderItems, lowStockVariants] = await Promise.all([
    prisma.product.count({ where: { sellerId } }),
    prisma.product.count({ where: { sellerId, isActive: true } }),
    prisma.orderItem.findMany({
      where: { sellerId },
      include: { order: true },
    }),
    prisma.inventory.findMany({
      where: {
        availableQuantity: { lt: 10 },
        variant: {
          product: { sellerId },
        },
      },
      include: {
        variant: {
          include: { product: true },
        },
      },
      take: 5,
    }),
  ]);

  const totalRevenue = sellerOrderItems.reduce((acc, i) => acc + Number(i.totalPrice), 0);
  const totalUnitsSold = sellerOrderItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Distiller Overview</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-text-main">
            Seller Dashboard
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Welcome, <span className="font-semibold text-text-main">{session.user.name}</span>. Here is your fragrance sales performance.
          </p>
        </div>

        <Link
          href="/seller/products/create"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          List New Perfume
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Total Catalog</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-accent">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-heading text-3xl font-bold text-text-main">{totalProducts}</div>
          <p className="mt-1 text-xs text-text-muted">{activeProducts} actively listed on storefront</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Units Sold</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-heading text-3xl font-bold text-text-main">{totalUnitsSold}</div>
          <p className="mt-1 text-xs text-text-muted">Across {sellerOrderItems.length} order items</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Total Earnings</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-heading text-3xl font-bold text-text-main">
            ${totalRevenue.toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-text-muted">Gross sales generated from your scents</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Low Stock Alerts</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-heading text-3xl font-bold text-text-main">{lowStockVariants.length}</div>
          <p className="mt-1 text-xs text-text-muted">Formulations with fewer than 10 bottles</p>
        </div>
      </div>

      {/* Low Stock Alerts Table */}
      {lowStockVariants.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-amber-900">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Inventory Restock Recommendations
          </h2>
          <div className="mt-4 divide-y divide-amber-200/60 rounded-xl border border-amber-200 bg-white">
            {lowStockVariants.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4 text-xs">
                <div>
                  <span className="font-bold text-text-main">{inv.variant.product.name}</span>
                  <span className="text-text-muted"> ({inv.variant.name} - SKU: {inv.variant.sku})</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-amber-700">Only {inv.availableQuantity} remaining</span>
                  <Link
                    href={`/seller/products/${inv.variant.product.id}/edit`}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Update Stock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/seller/products"
          className="group rounded-2xl border border-border-subtle bg-white p-6 shadow-sm transition hover:border-accent hover:shadow-md"
        >
          <h3 className="font-heading text-lg font-bold text-text-main group-hover:text-accent">
            Manage Product Catalog &rarr;
          </h3>
          <p className="mt-1 text-xs text-text-muted">
            Add bottles, adjust variant prices, upload imagery, and toggle live availability.
          </p>
        </Link>

        <Link
          href="/seller/orders"
          className="group rounded-2xl border border-border-subtle bg-white p-6 shadow-sm transition hover:border-accent hover:shadow-md"
        >
          <h3 className="font-heading text-lg font-bold text-text-main group-hover:text-accent">
            Review Customer Orders &rarr;
          </h3>
          <p className="mt-1 text-xs text-text-muted">
            View orders containing your handcrafted fragrance creations and dispatch statuses.
          </p>
        </Link>
      </div>
    </div>
  );
}
