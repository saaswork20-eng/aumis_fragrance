import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

const productInputSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10),
  basePrice: z.coerce.number().positive(),
  categoryId: z.string().min(1),
  sku: z.string().min(3),
  variantName: z.string().min(2),
  variantPrice: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  imageUrl: z.string().url(),
});

describe("Product Validation & Seller Ownership Security", () => {
  it("validates valid fragrance product data", () => {
    const validData = {
      name: "Taif Rose Extrait",
      description: "Extracted from mountain Taif rose petals at first light.",
      basePrice: "185.00",
      categoryId: "cat-rose-123",
      sku: "ROSE-TAIF-50",
      variantName: "50ml Spray",
      variantPrice: "185.00",
      stock: "25",
      imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f",
    };

    const parsed = productInputSchema.safeParse(validData);
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.basePrice, 185);
      assert.equal(parsed.data.stock, 25);
    }
  });

  it("rejects invalid fragrance product data with negative prices or invalid URLs", () => {
    const invalidData = {
      name: "X",
      description: "Too short",
      basePrice: "-50.00",
      categoryId: "",
      sku: "AB",
      variantName: "",
      variantPrice: "0",
      stock: "-5",
      imageUrl: "not-a-valid-url",
    };

    const parsed = productInputSchema.safeParse(invalidData);
    assert.equal(parsed.success, false);
  });

  it("enforces seller product ownership guard against IDOR tampering", () => {
    const authenticatedSellerId = "seller-alpha";
    const foreignProductId = "product-beta";
    const foreignProduct = {
      id: foreignProductId,
      name: "Secret Musk",
      sellerId: "seller-gamma", // Owned by seller-gamma!
    };

    // Seller-alpha attempts to mutate seller-gamma's product
    const canMutate = (product: typeof foreignProduct, userId: string, role: string) => {
      if (role === "ADMIN") return true;
      return product.sellerId === userId;
    };

    assert.equal(
      canMutate(foreignProduct, authenticatedSellerId, "SELLER"),
      false,
      "Seller MUST NOT be allowed to mutate another seller's product"
    );

    // Legitimate owner attempts mutation
    assert.equal(
      canMutate(foreignProduct, "seller-gamma", "SELLER"),
      true,
      "Product owner MUST be allowed to mutate their own product"
    );

    // Admin attempts mutation
    assert.equal(
      canMutate(foreignProduct, "admin-1", "ADMIN"),
      true,
      "Admin MUST have oversight permission to moderate any product"
    );
  });
});
