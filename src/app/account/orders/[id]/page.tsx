import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, MapPin, CreditCard, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      shippingAddress: true,
      billingAddress: true,
      items: {
        include: {
          seller: {
            select: { id: true, name: true },
          },
          variant: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
      payment: true,
    },
  });

  // Strict IDOR Protection: Only the buyer who placed the order or an ADMIN can view it
  if (!order || (order.userId !== session.user.id && session.user.role !== "ADMIN")) {
    notFound();
  }

  const statusColor =
    order.status === "DELIVERED"
      ? "bg-green-100 text-green-800"
      : order.status === "SHIPPED"
      ? "bg-blue-100 text-blue-800"
      : order.status === "CANCELLED"
      ? "bg-red-100 text-red-800"
      : "bg-amber-100 text-amber-800";

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-5">
        <Link
          href="/account/orders"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Orders
        </Link>

        <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm sm:p-10">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-border-subtle pb-6 sm:flex-row sm:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Order Details</span>
              <h1 className="mt-1 font-heading text-2xl font-bold text-text-main md:text-3xl">
                Order #{order.id}
              </h1>
              <p className="text-xs text-text-muted mt-1">
                Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-main mb-4">
              Purchased Fragrances
            </h2>
            <div className="divide-y divide-border-subtle rounded-xl border border-border-subtle">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link
                      href={`/products/${item.variant.product.slug}`}
                      className="font-heading text-base font-bold text-text-main hover:text-accent"
                    >
                      {item.variant.product.name}
                    </Link>
                    <p className="text-xs text-text-muted">
                      Formulation: <span className="font-semibold text-text-main">{item.variant.name}</span> (SKU: {item.variant.sku})
                    </p>
                    <p className="text-xs text-text-muted">
                      Distiller / Seller: <span className="text-text-main">{item.seller.name || "AUMIS Reserve"}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-8 sm:justify-end">
                    <div className="text-right text-xs">
                      <span className="text-text-muted">
                        ${Number(item.unitPrice).toFixed(2)} &times; {item.quantity}
                      </span>
                    </div>
                    <div className="w-24 text-right font-heading text-base font-bold text-text-main">
                      ${Number(item.totalPrice).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-border-subtle pt-8 sm:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-main">
                <MapPin className="h-4 w-4 text-accent" />
                Shipping Address
              </h3>
              {order.shippingAddress ? (
                <div className="mt-3 text-xs leading-relaxed text-text-muted">
                  <p className="font-semibold text-text-main">{order.user.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-text-muted">Standard digital receipt on file.</p>
              )}
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-main">
                <CreditCard className="h-4 w-4 text-accent" />
                Payment Summary
              </h3>
              <div className="mt-3 space-y-1.5 text-xs text-text-muted">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-semibold text-text-main">
                    {order.payment?.provider === "DEMO_COMPLIMENTARY" ? "VIP Complimentary Preview" : "Direct Settlement"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="font-semibold text-text-main">{order.payment?.status || "PENDING"}</span>
                </div>
                <div className="flex justify-between border-t border-border-subtle pt-2 font-heading text-base font-bold text-text-main">
                  <span>Total Amount Paid:</span>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 rounded-xl bg-primary/40 p-4 text-xs text-text-muted">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Official AUMIS Certificate of Fragrance Authenticity included with this order shipment.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
