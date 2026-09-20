import { z } from "zod";

export const advertiserSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").max(100),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const advertisementSchema = z.object({
  advertiserId: z.string().cuid("Invalid advertiser ID"),
  title: z.string().min(2, "Title is too short").max(100),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url("Must be a valid image URL"),
  destinationUrl: z.string().url("Must be a valid destination URL"),
  ctaText: z.string().max(30).default("Learn More"),
  placement: z.enum(["HOMEPAGE_BANNER", "PRODUCT_GRID_INLINE", "PROMO_MODAL"]),
  status: z.enum(["DRAFT", "SCHEDULED", "ACTIVE", "PAUSED", "EXPIRED"]),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});
