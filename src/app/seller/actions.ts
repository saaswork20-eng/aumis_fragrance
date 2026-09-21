"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productInputSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  basePrice: z.coerce.number().positive("Base price must be a positive number"),
  categoryId: z.string().min(1, "Please select a category"),
  sku: z.string().min(3, "SKU is required"),
  variantName: z.string().min(2, "Size / Variant name is required (e.g. 50ml Spray)"),
  variantPrice: z.coerce.number().positive("Variant price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  imageUrl: z.string().url("Must be a valid image URL"),
});

export async function createSellerProductAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "SELLER" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized: Seller permission required.");
  }

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    basePrice: formData.get("basePrice"),
    categoryId: formData.get("categoryId") as string,
    sku: formData.get("sku") as string,
    variantName: formData.get("variantName") as string,
    variantPrice: formData.get("variantPrice"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl") as string,
  };

  const validated = productInputSchema.safeParse(raw);
  if (!validated.success) {
    throw new Error("Validation failed: " + Object.values(validated.error.flatten().fieldErrors).flat().join(", "));
  }

  const { name, description, basePrice, categoryId, sku, variantName, variantPrice, stock, imageUrl } = validated.data;

  // Generate a URL-friendly unique slug
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const existingSlug = await prisma.product.findUnique({ where: { slug } });
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name,
        slug,
        description,
        basePrice,
        categoryId,
        sellerId: session.user.id,
        isActive: true,
        images: {
          create: {
            url: imageUrl,
            altText: `${name} Bottle`,
            isPrimary: true,
          },
        },
      },
    });

    await tx.productVariant.create({
      data: {
        productId: product.id,
        sku,
        name: variantName,
        price: variantPrice,
        inventory: {
          create: {
            availableQuantity: stock,
            reservedQuantity: 0,
          },
        },
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/seller/products");
  redirect("/seller/products");
}

export async function updateSellerProductAction(productId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "SELLER" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  // IDOR Verification: Ensure product belongs to the authenticated seller
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product || (product.sellerId !== session.user.id && session.user.role !== "ADMIN")) {
    throw new Error("Forbidden: You do not own this product.");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const basePrice = Number(formData.get("basePrice"));
  const categoryId = formData.get("categoryId") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const stock = Number(formData.get("stock"));

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        basePrice,
        categoryId,
      },
    });

    if (imageUrl) {
      await tx.productImage.updateMany({
        where: { productId, isPrimary: true },
        data: { url: imageUrl },
      });
    }

    if (product.variants[0]) {
      await tx.inventory.update({
        where: { variantId: product.variants[0].id },
        data: { availableQuantity: stock },
      });
    }
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/seller/products");
  redirect("/seller/products");
}

export async function deleteSellerProductAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // IDOR Verification
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || (product.sellerId !== session.user.id && session.user.role !== "ADMIN")) {
    throw new Error("Forbidden: You do not have permission to delete this product.");
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/seller/products");
}

export async function toggleSellerProductStatusAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || (product.sellerId !== session.user.id && session.user.role !== "ADMIN")) {
    throw new Error("Forbidden");
  }

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: !product.isActive },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/seller/products");
}
