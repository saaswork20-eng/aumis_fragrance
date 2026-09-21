import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { updateOrderStatusAction } from "./actions";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      shippingAddress: true,
      items: {
        include: {
          variant: { include: { product: true } },
          seller: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Fulfillment Operations</span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-text-main">
          All Orders ({orders.length})
        </h1>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-muted">
            <thead className="border-b border-border-subtle bg-primary/60 text-[10px] font-bold uppercase tracking-wider text-text-main">
              <tr>
                <th className="px-6 py-4">Order Ref & Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items Summary</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-primary/30 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-text-main">#{order.id.slice(0, 8)}...</span>
                      <Link href={`/account/orders/${order.id}`} target="_blank" title="View Customer Receipt">
                        <ExternalLink className="h-3.5 w-3.5 text-text-muted hover:text-accent" />
                      </Link>
                    </div>
                    <p className="text-[10px] text-text-muted">
                      {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-main">{order.user.name || "Customer"}</p>
                    <p className="text-[10px] text-text-muted">{order.user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      {order.items.map((i) => (
                        <p key={i.id} className="text-[11px] text-text-main">
                          &bull; {i.variant.product.name} ({i.quantity}x)
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-text-main">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {order.shippingAddress ? (
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.country}
                      </p>
                    ) : (
                      "Digital Record"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={updateOrderStatusAction.bind(null, order.id)} className="inline-flex items-center gap-2">
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="rounded border border-border-subtle bg-white px-2 py-1 text-[11px] text-text-main focus:border-accent focus:outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded bg-primary px-2.5 py-1 text-[10px] font-bold uppercase text-text-main hover:bg-accent hover:text-white transition"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
