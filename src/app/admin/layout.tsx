import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-[#f9f7f3]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-subtle bg-white p-6 shadow-sm">
        <div className="mb-10 text-2xl font-bold font-heading text-text-main">
          AUMIS <span className="text-accent">Admin</span>
        </div>
        
        <nav className="space-y-2">
          <Link href="/admin" className="block rounded-md px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary hover:text-text-main">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block rounded-md px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary hover:text-text-main">
            Products
          </Link>
          <Link href="/admin/orders" className="block rounded-md px-4 py-2 text-sm font-medium text-text-muted hover:bg-primary hover:text-text-main">
            Orders
          </Link>
          {/* New Ads Navigation Item */}
          <Link href="/admin/ads" className="block rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-main">
            Ads Management
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold text-text-main">Ads Management</h1>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span>Logged in as: {session.user.role}</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
