import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SellerOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  // Query order items strictly isolated to this seller
  const items = await prisma.orderItem.findMany({
    where: {
      sellerId: session.user.id,
    },
    include: {
      order: {
        include: {
          user: {
            select: { name: true, email: true },
          },
          shippingAddress: true,
        },
      },
      variant: {
        include: { product: true },
      },
    },
    orderBy: {
      order: { createdAt: "desc" },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Customer Orders</span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-text-main">
          Orders for Your Scents ({items.length})
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          Only showing items purchased from your handcrafted fragrance catalog.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
        {items.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <ShoppingCart className="mx-auto h-12 w-12 text-text-muted" />
            <p className="mt-3 font-heading text-lg font-medium text-text-main">No sales recorded yet</p>
            <p className="mt-1 text-xs">When buyers purchase your creations, their orders will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-muted">
              <thead className="border-b border-border-subtle bg-primary/60 text-[10px] font-bold uppercase tracking-wider text-text-main">
                <tr>
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Fragrance Ordered</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Earned</th>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {items.map((item) => {
                  const status = item.order.status;
                  const statusColor =
                    status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : status === "SHIPPED"
                      ? "bg-blue-100 text-blue-800"
                      : status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800";

                  return (
                    <tr key={item.id} className="hover:bg-primary/30 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-text-main">#{item.order.id.slice(0, 10)}...</span>
                        <p className="text-[10px] text-text-muted">
                          {format(new Date(item.order.createdAt), "MMM d, yyyy")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-text-main">{item.order.user.name || "Customer"}</p>
                        <p className="text-[10px] text-text-muted">{item.order.user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-text-main">{item.variant.product.name}</span>
                        <p className="text-[10px] text-text-muted">{item.variant.name}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-main">{item.quantity} units</td>
                      <td className="px-6 py-4 font-bold text-text-main">
                        ${Number(item.totalPrice).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {item.order.shippingAddress ? (
                          <span>
                            {item.order.shippingAddress.city}, {item.order.shippingAddress.country}
                          </span>
                        ) : (
                          "Digital Confirmation"
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
