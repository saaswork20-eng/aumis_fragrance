"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(5, "Valid contact phone is required"),
  street: z.string().min(3, "Delivery street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State or Province is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  items: z
    .array(
      z.object({
        variantId: z.string(),
        quantity: z.number().int().positive("Quantity must be positive"),
      })
    )
    .min(1, "Order must contain at least one item"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type OrderResult = {
  success: boolean;
  orderId?: string;
  error?: string;
};

export async function createOrderAction(rawInput: CheckoutInput): Promise<OrderResult> {
  // 1. Authenticate the buyer server-side
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Authentication required. Please log in to complete your order.",
    };
  }

  // 2. Validate inputs with Zod
  const validated = checkoutSchema.safeParse(rawInput);
  if (!validated.success) {
    return {
      success: false,
      error: "Invalid order details: " + Object.values(validated.error.flatten().fieldErrors).flat().join(", "),
    };
  }

  const { street, city, state, postalCode, country, items } = validated.data;

  try {
    // 3. Execute order creation in an atomic Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // Find variants
      const variantIds = items.map((i) => i.variantId);
      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: {
          product: true,
          inventory: true,
        },
      });

      if (variants.length !== items.length) {
        throw new Error("One or more items in your cart are no longer available.");
      }

      let subtotal = 0;
      const orderItemsToCreate: Array<{
        variantId: string;
        sellerId: string;
        quantity: number;
        unitPrice: Prisma.Decimal | number;
        totalPrice: number;
      }> = [];

      // Validate stock, active status, and compute verified server-side prices
      for (const item of items) {
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant) {
          throw new Error(`Variant not found for item ${item.variantId}`);
        }

        if (!variant.product.isActive) {
          throw new Error(`Fragrance "${variant.product.name}" is currently unavailable.`);
        }

        const availableStock = variant.inventory?.availableQuantity ?? 0;
        if (availableStock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${variant.product.name} - ${variant.name}". Only ${availableStock} available.`
          );
        }

        const unitPrice = Number(variant.price);
        const itemTotal = unitPrice * item.quantity;
        subtotal += itemTotal;

        orderItemsToCreate.push({
          variantId: variant.id,
          sellerId: variant.product.sellerId,
          quantity: item.quantity,
          unitPrice: variant.price,
          totalPrice: itemTotal,
        });

        // Atomic conditional decrement: prevents race conditions under simultaneous checkout
        const updateResult = await tx.inventory.updateMany({
          where: {
            variantId: variant.id,
            availableQuantity: { gte: item.quantity },
          },
          data: {
            availableQuantity: { decrement: item.quantity },
          },
        });

        if (updateResult.count === 0) {
          throw new Error(
            `Insufficient stock for "${variant.product.name} - ${variant.name}". The requested quantity was claimed by another customer.`
          );
        }

        // Record audit transaction
        await tx.inventoryTransaction.create({
          data: {
            variantId: variant.id,
            type: "SALE",
            quantity: -item.quantity,
            notes: `Purchased by user ${session.user.id}`,
          },
        });
      }

      // Calculate server-side total
      const shipping = subtotal > 150 ? 0 : 15;
      const tax = subtotal * 0.05;
      const totalAmount = subtotal + shipping + tax;

      // Save shipping address
      const shippingAddress = await tx.address.create({
        data: {
          userId: session.user.id,
          street,
          city,
          state,
          postalCode,
          country,
          type: "SHIPPING",
        },
      });

      // Create Order & OrderItems
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          status: "PENDING",
          totalAmount,
          shippingAddressId: shippingAddress.id,
          items: {
            create: orderItemsToCreate,
          },
          payment: {
            create: {
              provider: "DEMO_COMPLIMENTARY",
              amount: totalAmount,
              status: "PENDING",
            },
          },
        },
      });

      return order;
    });

    return {
      success: true,
      orderId: result.id,
    };
  } catch (err: unknown) {
    console.error("Order processing error:", err);
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred while placing your order.";
    return {
      success: false,
      error: errorMsg,
    };
  }
}
