"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const carouselSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(120),
  description: z.string().min(5, "Description must be at least 5 characters"),
  imageUrl: z.string().url("Valid image URL is required"),
  ctaText: z.string().min(1).default("Shop Now"),
  productId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  discountText: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function adminCreateCarouselSlideAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const raw = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    imageUrl: formData.get("imageUrl") as string,
    ctaText: (formData.get("ctaText") as string) || "Shop Now",
    productId: (formData.get("productId") as string) || null,
    categoryId: (formData.get("categoryId") as string) || null,
    discountText: (formData.get("discountText") as string) || null,
    displayOrder: formData.get("displayOrder") || 0,
    isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
  };

  const validated = carouselSchema.safeParse(raw);
  if (!validated.success) {
    throw new Error("Validation failed: " + Object.values(validated.error.flatten().fieldErrors).flat().join(", "));
  }

  const data = validated.data;

  await prisma.carouselSlide.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      ctaText: data.ctaText,
      productId: data.productId || null,
      categoryId: data.categoryId || null,
      discountText: data.discountText || null,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/carousel");
  redirect("/admin/carousel");
}

export async function adminUpdateCarouselSlideAction(slideId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const raw = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    imageUrl: formData.get("imageUrl") as string,
    ctaText: (formData.get("ctaText") as string) || "Shop Now",
    productId: (formData.get("productId") as string) || null,
    categoryId: (formData.get("categoryId") as string) || null,
    discountText: (formData.get("discountText") as string) || null,
    displayOrder: formData.get("displayOrder") || 0,
    isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
  };

  const validated = carouselSchema.safeParse(raw);
  if (!validated.success) {
    throw new Error("Validation failed: " + Object.values(validated.error.flatten().fieldErrors).flat().join(", "));
  }

  const data = validated.data;

  await prisma.carouselSlide.update({
    where: { id: slideId },
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      ctaText: data.ctaText,
      productId: data.productId || null,
      categoryId: data.categoryId || null,
      discountText: data.discountText || null,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/carousel");
  redirect("/admin/carousel");
}

export async function adminToggleCarouselSlideStatusAction(slideId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const slide = await prisma.carouselSlide.findUnique({ where: { id: slideId } });
  if (!slide) throw new Error("Slide not found");

  await prisma.carouselSlide.update({
    where: { id: slideId },
    data: { isActive: !slide.isActive },
  });

  revalidatePath("/");
  revalidatePath("/admin/carousel");
}

export async function adminDeleteCarouselSlideAction(slideId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  await prisma.carouselSlide.delete({
    where: { id: slideId },
  });

  revalidatePath("/");
  revalidatePath("/admin/carousel");
}
