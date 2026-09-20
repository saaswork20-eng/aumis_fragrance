import { prisma } from "@/lib/prisma";
import { cache } from "react";
import type { AdPlacement } from "@prisma/client";

/**
 * Retrieves active advertisements for a specific placement.
 * Ensures the ad is ACTIVE and the current date falls between startDate and endDate.
 */
export const getActiveAdsByPlacement = cache(async (placement: AdPlacement) => {
  try {
    const now = new Date();
    
    const ads = await prisma.advertisement.findMany({
      where: {
        placement,
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now },
        advertiser: {
          isActive: true
        }
      },
      include: {
        advertiser: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return ads.map(ad => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      destinationUrl: ad.destinationUrl,
      ctaText: ad.ctaText,
      advertiserName: ad.advertiser.name
    }));
  } catch (error) {
    console.error(`Failed to fetch ads for placement ${placement}:`, error);
    return [];
  }
});
