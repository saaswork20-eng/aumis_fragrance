import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Package, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BuyerOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/account/orders");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Buyer Dashboard</span>
            <h1 className="mt-1 font-heading text-3xl font-bold text-text-main md:text-4xl">
              Your Purchase History
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Signed in as <span className="font-semibold text-text-main">{session.user.name || session.user.email}</span>
            </p>
          </div>
          <Link
            href="/shop"
            className="self-start rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-sm sm:self-auto"
          >
            Browse Scents
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-subtle bg-white p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-text-muted" />
            <h3 className="mt-4 font-heading text-xl font-bold text-text-main">No orders placed yet</h3>
            <p className="mt-1 text-sm text-text-muted">
              You haven&apos;t ordered any luxury fragrances yet. Explore our signature collection today.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusColor =
                order.status === "DELIVERED"
                  ? "bg-green-100 text-green-800"
                  : order.status === "SHIPPED"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "CANCELLED"
                  ? "bg-red-100 text-red-800"
                  : "bg-amber-100 text-amber-800";

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-border-subtle pb-4 sm:flex-row sm:items-center">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                        Order #{order.id}
                      </span>
                      <p className="text-xs text-text-muted mt-0.5">
                        Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                        {order.status}
                      </span>
                      <span className="font-heading text-lg font-bold text-text-main">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-4 divide-y divide-border-subtle/50">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2.5 text-xs">
                        <div>
                          <span className="font-bold text-text-main">{item.variant.product.name}</span>
                          <span className="text-text-muted"> ({item.variant.name}) &times; {item.quantity}</span>
                        </div>
                        <span className="font-semibold text-text-main">
                          ${Number(item.totalPrice).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end border-t border-border-subtle/50 pt-3">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                    >
                      View Order Receipt
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
