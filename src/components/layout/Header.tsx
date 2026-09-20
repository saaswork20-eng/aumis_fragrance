import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white/95 px-5 py-6 shadow-sm backdrop-blur-md transition-all duration-300 md:px-10">
      <Link href="/" className="font-heading text-2xl font-bold tracking-widest text-accent">
        AUMIS
      </Link>
      
      <nav className="hidden md:block">
        <ul className="flex items-center gap-8">
          <li>
            <Link href="/" className="text-sm font-medium uppercase tracking-wider transition-colors hover:text-accent">
              Home
            </Link>
          </li>
          <li>
            <Link href="#collection" className="text-sm font-medium uppercase tracking-wider transition-colors hover:text-accent">
              Collection
            </Link>
          </li>
          <li>
            <Link href="#about" className="text-sm font-medium uppercase tracking-wider transition-colors hover:text-accent">
              About
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-6">
        <button className="relative transition-transform hover:scale-110 hover:text-accent">
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white transition-transform">
            0
          </span>
        </button>
      </div>
    </header>
  );
}
