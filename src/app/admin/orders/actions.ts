"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";

export async function updateOrderStatusAction(orderId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const newStatus = formData.get("status") as OrderStatus;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/account/orders");
}
