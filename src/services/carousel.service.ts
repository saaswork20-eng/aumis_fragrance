import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { isOfferActive } from "./product.service";

export type CarouselSlideDisplay = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  ctaText: string;
  discountText: string | null;
  link: string;
  displayOrder: number;
};

export const getActiveCarouselSlides = cache(async (): Promise<CarouselSlideDisplay[]> => {
  try {
    const slides = await prisma.carouselSlide.findMany({
      where: {
        isActive: true,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            offer: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return slides.map((slide) => {
      let link = "/shop";
      let discountText = slide.discountText;

      if (slide.product) {
        link = `/products/${slide.product.slug}`;
        // If linked product has an active offer and slide doesn't specify a manual discount text, use the product's discount
        if (!discountText && slide.product.offer && isOfferActive(slide.product.offer)) {
          discountText = `${slide.product.offer.discountPercentage}% OFF`;
        }
      } else if (slide.category) {
        link = `/shop?category=${slide.category.slug}`;
      }

      return {
        id: slide.id,
        imageUrl: slide.imageUrl,
        title: slide.title,
        description: slide.description,
        ctaText: slide.ctaText || "Shop Now",
        discountText,
        link,
        displayOrder: slide.displayOrder,
      };
    });
  } catch (error) {
    console.error("Failed to fetch carousel slides:", error);
    return [];
  }
});
