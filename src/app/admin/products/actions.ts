"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function adminToggleProductStatusAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: !product.isActive },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function adminDeleteProductAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  await prisma.product.delete({ where: { id: productId } });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}
