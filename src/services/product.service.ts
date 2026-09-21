import { prisma } from "@/lib/prisma";
import { cache } from "react";
import type { Prisma } from "@prisma/client";

// Wrap with React cache to deduplicate requests in the same render pass
export const getActiveProducts = cache(async (categorySlug?: string, searchQuery?: string) => {
  try {
    const whereClause: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (categorySlug && categorySlug !== "all") {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    if (searchQuery && searchQuery.trim()) {
      whereClause.OR = [
        { name: { contains: searchQuery.trim(), mode: "insensitive" } },
        { description: { contains: searchQuery.trim(), mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: {
          include: {
            inventory: true,
          },
          orderBy: { price: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map((product) => {
      const defaultVariant =
        product.variants.find((v) => (v.inventory?.availableQuantity ?? 0) > 0) ||
        product.variants[0];

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category.name,
        categorySlug: product.category.slug,
        sellerName: product.seller.name || "AUMIS Reserve",
        description: product.description,
        price: defaultVariant?.price ? Number(defaultVariant.price) : Number(product.basePrice),
        image: product.images[0]?.url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
        isAvailable: (defaultVariant?.inventory?.availableQuantity ?? 0) > 0,
        variantsCount: product.variants.length,
      };
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
});

export const getProductBySlug = cache(async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: {
          include: {
            inventory: true,
          },
          orderBy: { price: "asc" },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      basePrice: Number(product.basePrice),
      variants: product.variants.map((v) => ({
        ...v,
        price: Number(v.price),
        stock: v.inventory?.availableQuantity ?? 0,
      })),
    };
  } catch (error) {
    console.error(`Failed to fetch product by slug ${slug}:`, error);
    return null;
  }
});

export const getCategories = cache(async () => {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
});
