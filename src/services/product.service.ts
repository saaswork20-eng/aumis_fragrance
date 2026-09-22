import { prisma } from "@/lib/prisma";
import { cache } from "react";
import type { Prisma } from "@prisma/client";

export function isOfferActive(
  offer?: {
    isActive: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
  } | null
): boolean {
  if (!offer || !offer.isActive) return false;
  const now = new Date();
  if (offer.startDate && new Date(offer.startDate) > now) return false;
  if (offer.endDate && new Date(offer.endDate) < now) return false;
  return true;
}

export function computeDiscountedPrice(originalPrice: number, discountPercentage: number): number {
  if (discountPercentage <= 0) return originalPrice;
  const discounted = originalPrice * (1 - discountPercentage / 100);
  return Math.round(discounted * 100) / 100;
}

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
        offer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map((product) => {
      const defaultVariant =
        product.variants.find((v) => (v.inventory?.availableQuantity ?? 0) > 0) ||
        product.variants[0];

      const rawPrice = defaultVariant?.price ? Number(defaultVariant.price) : Number(product.basePrice);
      const hasActiveOffer = isOfferActive(product.offer);
      const discountPercentage = hasActiveOffer && product.offer ? product.offer.discountPercentage : 0;
      const finalPrice = hasActiveOffer ? computeDiscountedPrice(rawPrice, discountPercentage) : rawPrice;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category.name,
        categorySlug: product.category.slug,
        sellerName: product.seller.name || "AUMIS Reserve",
        description: product.description,
        price: finalPrice,
        originalPrice: rawPrice,
        discountPercentage,
        hasDiscount: hasActiveOffer && discountPercentage > 0,
        isNewLaunch: product.isNewLaunch,
        isBestSeller: product.isBestSeller,
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

export const getNewLaunches = cache(async (limit = 4) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isNewLaunch: true,
      },
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
        offer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return products.map((product) => {
      const defaultVariant =
        product.variants.find((v) => (v.inventory?.availableQuantity ?? 0) > 0) ||
        product.variants[0];

      const rawPrice = defaultVariant?.price ? Number(defaultVariant.price) : Number(product.basePrice);
      const hasActiveOffer = isOfferActive(product.offer);
      const discountPercentage = hasActiveOffer && product.offer ? product.offer.discountPercentage : 0;
      const finalPrice = hasActiveOffer ? computeDiscountedPrice(rawPrice, discountPercentage) : rawPrice;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category.name,
        categorySlug: product.category.slug,
        sellerName: product.seller.name || "AUMIS Reserve",
        description: product.description,
        price: finalPrice,
        originalPrice: rawPrice,
        discountPercentage,
        hasDiscount: hasActiveOffer && discountPercentage > 0,
        isNewLaunch: product.isNewLaunch,
        isBestSeller: product.isBestSeller,
        image: product.images[0]?.url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
        isAvailable: (defaultVariant?.inventory?.availableQuantity ?? 0) > 0,
        variantsCount: product.variants.length,
      };
    });
  } catch (error) {
    console.error("Failed to fetch new launches:", error);
    return [];
  }
});

export const getBestSellers = cache(async (limit = 4) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isBestSeller: true,
      },
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
        offer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return products.map((product) => {
      const defaultVariant =
        product.variants.find((v) => (v.inventory?.availableQuantity ?? 0) > 0) ||
        product.variants[0];

      const rawPrice = defaultVariant?.price ? Number(defaultVariant.price) : Number(product.basePrice);
      const hasActiveOffer = isOfferActive(product.offer);
      const discountPercentage = hasActiveOffer && product.offer ? product.offer.discountPercentage : 0;
      const finalPrice = hasActiveOffer ? computeDiscountedPrice(rawPrice, discountPercentage) : rawPrice;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category.name,
        categorySlug: product.category.slug,
        sellerName: product.seller.name || "AUMIS Reserve",
        description: product.description,
        price: finalPrice,
        originalPrice: rawPrice,
        discountPercentage,
        hasDiscount: hasActiveOffer && discountPercentage > 0,
        isNewLaunch: product.isNewLaunch,
        isBestSeller: product.isBestSeller,
        image: product.images[0]?.url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
        isAvailable: (defaultVariant?.inventory?.availableQuantity ?? 0) > 0,
        variantsCount: product.variants.length,
      };
    });
  } catch (error) {
    console.error("Failed to fetch best sellers:", error);
    return [];
  }
});

export const getDiscountedProducts = cache(async (limit = 4) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        offer: {
          isActive: true,
        },
      },
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
        offer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return products
      .filter((p) => isOfferActive(p.offer))
      .map((product) => {
        const defaultVariant =
          product.variants.find((v) => (v.inventory?.availableQuantity ?? 0) > 0) ||
          product.variants[0];

        const rawPrice = defaultVariant?.price ? Number(defaultVariant.price) : Number(product.basePrice);
        const discountPercentage = product.offer?.discountPercentage ?? 0;
        const finalPrice = computeDiscountedPrice(rawPrice, discountPercentage);

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.category.name,
          categorySlug: product.category.slug,
          sellerName: product.seller.name || "AUMIS Reserve",
          description: product.description,
          price: finalPrice,
          originalPrice: rawPrice,
          discountPercentage,
          hasDiscount: discountPercentage > 0,
          isNewLaunch: product.isNewLaunch,
          isBestSeller: product.isBestSeller,
          image: product.images[0]?.url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
          isAvailable: (defaultVariant?.inventory?.availableQuantity ?? 0) > 0,
          variantsCount: product.variants.length,
        };
      });
  } catch (error) {
    console.error("Failed to fetch discounted products:", error);
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
        offer: true,
      },
    });

    if (!product) return null;

    const hasActiveOffer = isOfferActive(product.offer);
    const discountPercentage = hasActiveOffer && product.offer ? product.offer.discountPercentage : 0;

    return {
      ...product,
      basePrice: Number(product.basePrice),
      hasDiscount: hasActiveOffer && discountPercentage > 0,
      discountPercentage,
      offer: product.offer,
      variants: product.variants.map((v) => {
        const originalPrice = Number(v.price);
        const discountedPrice = hasActiveOffer
          ? computeDiscountedPrice(originalPrice, discountPercentage)
          : originalPrice;

        return {
          ...v,
          price: discountedPrice,
          originalPrice,
          stock: v.inventory?.availableQuantity ?? 0,
        };
      }),
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
