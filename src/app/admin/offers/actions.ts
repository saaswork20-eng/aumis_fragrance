"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const offerSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  discountPercentage: z.coerce
    .number()
    .int()
    .min(1, "Discount must be at least 1%")
    .max(90, "Discount cannot exceed 90%"),
  isActive: z.boolean().default(true),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export async function adminCreateOfferAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const raw = {
    productId: formData.get("productId") as string,
    discountPercentage: formData.get("discountPercentage"),
    isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    startDate: (formData.get("startDate") as string) || null,
    endDate: (formData.get("endDate") as string) || null,
  };

  const validated = offerSchema.safeParse(raw);
  if (!validated.success) {
    throw new Error("Validation failed: " + Object.values(validated.error.flatten().fieldErrors).flat().join(", "));
  }

  const { productId, discountPercentage, isActive, startDate, endDate } = validated.data;

  // Upsert offer for product (one active offer per product)
  await prisma.productOffer.upsert({
    where: { productId },
    update: {
      discountPercentage,
      isActive,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
    create: {
      productId,
      discountPercentage,
      isActive,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/offers");
  revalidatePath("/admin/products");
  redirect("/admin/offers");
}

export async function adminUpdateOfferAction(offerId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const discountPercentage = Number(formData.get("discountPercentage"));
  const isActive = formData.get("isActive") === "true" || formData.get("isActive") === "on";
  const startDateStr = (formData.get("startDate") as string) || null;
  const endDateStr = (formData.get("endDate") as string) || null;

  if (isNaN(discountPercentage) || discountPercentage < 1 || discountPercentage > 90) {
    throw new Error("Discount percentage must be between 1 and 90");
  }

  await prisma.productOffer.update({
    where: { id: offerId },
    data: {
      discountPercentage,
      isActive,
      startDate: startDateStr ? new Date(startDateStr) : null,
      endDate: endDateStr ? new Date(endDateStr) : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/offers");
  revalidatePath("/admin/products");
  redirect("/admin/offers");
}

export async function adminToggleOfferStatusAction(offerId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const offer = await prisma.productOffer.findUnique({ where: { id: offerId } });
  if (!offer) throw new Error("Offer not found");

  await prisma.productOffer.update({
    where: { id: offerId },
    data: { isActive: !offer.isActive },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/offers");
  revalidatePath("/admin/products");
}

export async function adminDeleteOfferAction(offerId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  await prisma.productOffer.delete({
    where: { id: offerId },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/offers");
  revalidatePath("/admin/products");
}
