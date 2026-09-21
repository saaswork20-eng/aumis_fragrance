import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { updateUserRoleAction, toggleUserStatusAction } from "./actions";
import { Power } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          orders: true,
          products: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Access Control</span>
        <h1 className="mt-1 font-heading text-3xl font-bold text-text-main">
          Platform Accounts & Roles ({users.length})
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          Manage buyers, fragrance sellers, and administrative permissions.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text-muted">
            <thead className="border-b border-border-subtle bg-primary/60 text-[10px] font-bold uppercase tracking-wider text-text-main">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role Assigned</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Role Modifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {users.map((u) => {
                const roleColor =
                  u.role === "ADMIN"
                    ? "bg-purple-100 text-purple-800"
                    : u.role === "SELLER"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800";

                return (
                  <tr key={u.id} className="hover:bg-primary/30 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main">{u.name || "Anonymous"}</p>
                      <p className="text-[11px] text-text-muted">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${roleColor}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] text-text-main">
                        {u.role === "SELLER"
                          ? `${u._count.products} fragrances listed`
                          : `${u._count.orders} orders placed`}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {format(new Date(u.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            u.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {u.isActive ? "ACTIVE" : "SUSPENDED"}
                        </span>
                        <form action={toggleUserStatusAction.bind(null, u.id)}>
                          <button
                            type="submit"
                            title={u.isActive ? "Suspend User" : "Activate User"}
                            className="rounded p-1 text-text-muted hover:text-text-main transition"
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={updateUserRoleAction.bind(null, u.id)} className="inline-flex items-center gap-2">
                        <select
                          name="role"
                          defaultValue={u.role}
                          className="rounded border border-border-subtle bg-white px-2 py-1 text-[11px] text-text-main focus:border-accent focus:outline-none"
                        >
                          <option value="BUYER">BUYER</option>
                          <option value="SELLER">SELLER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button
                          type="submit"
                          className="rounded bg-primary px-2.5 py-1 text-[10px] font-bold uppercase text-text-main hover:bg-accent hover:text-white transition"
                        >
                          Update
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
