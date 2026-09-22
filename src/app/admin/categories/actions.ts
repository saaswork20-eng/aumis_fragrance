"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(50),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  description: z.string().optional().nullable(),
});

export async function adminCreateCategoryAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const raw = {
    name: formData.get("name") as string,
    slug: ((formData.get("slug") as string) || (formData.get("name") as string))
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    description: (formData.get("description") as string) || null,
  };

  const validated = categorySchema.safeParse(raw);
  if (!validated.success) {
    throw new Error("Validation failed: " + Object.values(validated.error.flatten().fieldErrors).flat().join(", "));
  }

  const { name, slug, description } = validated.data;

  const existingSlug = await prisma.category.findUnique({ where: { slug } });
  if (existingSlug) {
    throw new Error(`Category slug "${slug}" is already taken.`);
  }

  await prisma.category.create({
    data: { name, slug, description },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function adminUpdateCategoryAction(categoryId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const raw = {
    name: formData.get("name") as string,
    slug: ((formData.get("slug") as string) || (formData.get("name") as string))
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    description: (formData.get("description") as string) || null,
  };

  const validated = categorySchema.safeParse(raw);
  if (!validated.success) {
    throw new Error("Validation failed: " + Object.values(validated.error.flatten().fieldErrors).flat().join(", "));
  }

  const { name, slug, description } = validated.data;

  const existingSlug = await prisma.category.findUnique({ where: { slug } });
  if (existingSlug && existingSlug.id !== categoryId) {
    throw new Error(`Category slug "${slug}" is already taken.`);
  }

  await prisma.category.update({
    where: { id: categoryId },
    data: { name, slug, description },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function adminDeleteCategoryAction(categoryId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  // Safe delete verification: ensure no products belong to this category
  const productCount = await prisma.product.count({
    where: { categoryId },
  });

  if (productCount > 0) {
    throw new Error(
      `Cannot delete category: ${productCount} fragrance product(s) are still assigned to this category. Please reassign or delete the products first.`
    );
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
}
