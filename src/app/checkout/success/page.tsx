import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16 text-center">
      <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-white p-8 shadow-xl sm:p-12">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle className="h-10 w-10" />
          </div>
        </div>

        <span className="mt-6 inline-block text-xs font-bold uppercase tracking-widest text-accent">
          Order Confirmed
        </span>
        <h1 className="mt-2 font-heading text-3xl font-bold text-text-main">
          Thank You for Your Order
        </h1>
        <p className="mt-3 text-sm text-text-muted">
          Your luxury fragrance selection has been placed successfully. Our master artisans are carefully preparing your bottles for dispatch.
        </p>

        {orderId && (
          <div className="mt-6 rounded-xl bg-primary/60 p-4 text-xs">
            <span className="text-text-muted">Confirmation Reference:</span>
            <div className="mt-1 font-mono font-bold text-text-main text-sm select-all">
              {orderId}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {orderId && (
            <Link
              href={`/account/orders/${orderId}`}
              className="flex items-center justify-center gap-2 rounded-full border border-border-subtle bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-main transition hover:border-accent hover:text-accent"
            >
              <Package className="h-4 w-4" />
              View Order Details
            </Link>
          )}
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-accent-hover shadow-md"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
