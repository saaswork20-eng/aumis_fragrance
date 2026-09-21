import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-accent">
        <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: "12s" }} />
      </div>
      <span className="mt-6 text-xs font-bold uppercase tracking-widest text-accent">
        Error 404
      </span>
      <h1 className="mt-2 font-heading text-3xl font-bold text-text-main md:text-4xl">
        Fragrance Not Located
      </h1>
      <p className="mt-3 max-w-md text-sm text-text-muted">
        The scent or page you are searching for does not exist in our current collection or has been archived.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-full border border-border-subtle bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-main hover:border-accent"
        >
          Return Home
        </Link>
        <Link
          href="/shop"
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-accent-hover shadow-sm"
        >
          Explore Collection
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
