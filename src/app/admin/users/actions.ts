"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";

export async function updateUserRoleAction(userId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const role = formData.get("role") as Role;

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function toggleUserStatusAction(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  // Prevent admin from deactivating their own account
  if (userId === session.user.id) {
    throw new Error("You cannot deactivate your own administrative account.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}
