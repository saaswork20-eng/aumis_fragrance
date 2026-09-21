"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="mt-6 font-heading text-2xl font-bold text-text-main">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-xs text-text-muted">
        An error occurred while loading this section. Our concierges have been alerted.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-accent-hover shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-full border border-border-subtle bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-main hover:border-accent"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
