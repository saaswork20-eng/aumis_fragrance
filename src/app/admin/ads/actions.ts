"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { advertisementSchema } from "@/lib/validations/ad.schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAdAction(formData: FormData) {
  // 1. Authorization Check
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  // 2. Extract Data
  const data = {
    advertiserId: formData.get("advertiserId") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    imageUrl: formData.get("imageUrl") as string,
    destinationUrl: formData.get("destinationUrl") as string,
    ctaText: formData.get("ctaText") as string,
    placement: formData.get("placement") as "HOMEPAGE_BANNER" | "PRODUCT_GRID_INLINE" | "PROMO_MODAL",
    status: formData.get("status") as "DRAFT" | "SCHEDULED" | "ACTIVE" | "PAUSED" | "EXPIRED",
    startDate: formData.get("startDate") as string,
    endDate: formData.get("endDate") as string,
  };

  // 3. Validate
  const validated = advertisementSchema.safeParse(data);
  if (!validated.success) {
    throw new Error("Validation failed: " + JSON.stringify(validated.error.flatten().fieldErrors));
  }

  // 4. Database Mutation
  try {
    const ad = await prisma.advertisement.create({
      data: validated.data,
    });

    // 5. Audit Logging
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_AD",
        entity: "Advertisement",
        entityId: ad.id,
        details: JSON.stringify({ title: ad.title }),
      },
    });
  } catch (error) {
    console.error("Failed to create ad:", error);
    throw new Error("Database error. Failed to create advertisement.");
  }

  // 6. Revalidate Cache and Redirect
  revalidatePath("/");
  revalidatePath("/admin/ads");
  redirect("/admin/ads");
}
