import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().min(10, "Description is too short").max(1000),
  basePrice: z.number().positive("Price must be a positive number"),
  categoryId: z.string().cuid("Invalid category ID"),
});

export const variantSchema = z.object({
  sku: z.string().min(3).max(50),
  name: z.string().min(1).max(50),
  price: z.number().positive(),
  availableQuantity: z.number().int().nonnegative(),
});

export const addressSchema = z.object({
  street: z.string().min(5).max(100),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  postalCode: z.string().min(3).max(20),
  country: z.string().min(2).max(50),
  type: z.enum(["BILLING", "SHIPPING", "BOTH"]),
  isDefault: z.boolean().default(false),
});

export const orderItemSchema = z.object({
  variantId: z.string().cuid(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  billingAddressId: z.string().cuid().optional(),
  shippingAddressId: z.string().cuid().optional(),
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
});
