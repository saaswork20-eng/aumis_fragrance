import { prisma } from "@/lib/prisma";
import { cache } from "react";

// Wrap with React cache to deduplicate requests in the same render pass
export const getActiveProducts = cache(async () => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          include: {
            inventory: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map(product => {
      // Find the first variant with available inventory, or default to the first variant
      const defaultVariant = 
        product.variants.find(v => (v.inventory?.availableQuantity ?? 0) > 0) || 
        product.variants[0];

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category.name,
        description: product.description,
        price: defaultVariant?.price ? Number(defaultVariant.price) : Number(product.basePrice),
        image: product.images[0]?.url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
        isAvailable: (defaultVariant?.inventory?.availableQuantity ?? 0) > 0,
      };
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Return empty array on failure instead of throwing to avoid crashing the storefront
    // In production, this might trigger an error boundary or log to an APM tool
    return [];
  }
});
