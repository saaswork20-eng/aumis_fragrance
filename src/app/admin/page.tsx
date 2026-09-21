import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Package, Users, ShoppingCart, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    activeProducts,
    totalUsers,
    totalSellers,
    totalBuyers,
    totalOrders,
    pendingOrders,
    ordersList,
    recentUsers,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.user.count({ where: { role: "BUYER" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true, isActive: true },
    }),
  ]);

  const allOrders = await prisma.order.findMany({ select: { totalAmount: true } });
  const platformRevenue = allOrders.reduce((acc, o) => acc + Number(o.totalAmount), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Platform Analytics</span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-text-main">
          Executive Administration Overview
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Real-time metrics from the AUMIS PostgreSQL database.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Total Revenue</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-heading text-3xl font-bold text-text-main">
            ${platformRevenue.toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-text-muted">Cumulative gross sales</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Total Orders</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-heading text-3xl font-bold text-text-main">{totalOrders}</div>
          <p className="mt-1 text-xs font-semibold text-amber-600">{pendingOrders} orders pending fulfillment</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Catalog Size</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-accent">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-heading text-3xl font-bold text-text-main">{totalProducts}</div>
          <p className="mt-1 text-xs text-text-muted">{activeProducts} live on storefront</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">User Community</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-heading text-3xl font-bold text-text-main">{totalUsers}</div>
          <p className="mt-1 text-xs text-text-muted">
            {totalSellers} Sellers &bull; {totalBuyers} Buyers
          </p>
        </div>
      </div>

      {/* Tables: Recent Orders & Recent Users */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-text-main">Recent Customer Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-accent hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="divide-y divide-border-subtle text-xs">
            {ordersList.length === 0 ? (
              <p className="py-6 text-center text-text-muted">No orders placed yet.</p>
            ) : (
              ordersList.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-mono font-bold text-text-main">#{o.id.slice(0, 8)}...</span>
                    <p className="text-text-muted">{o.user.name || o.user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-text-main">${Number(o.totalAmount).toFixed(2)}</span>
                    <div className="mt-0.5">
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-text-main">
                        {o.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-text-main">Newly Registered Accounts</h2>
            <Link href="/admin/users" className="text-xs font-semibold text-accent hover:underline">
              Manage Users &rarr;
            </Link>
          </div>

          <div className="divide-y divide-border-subtle text-xs">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-bold text-text-main">{u.name || "Anonymous User"}</p>
                  <p className="text-[11px] text-text-muted">{u.email}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      u.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : u.role === "SELLER"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {u.role}
                  </span>
                  <p className="mt-0.5 text-[10px] text-text-muted">
                    {format(new Date(u.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
