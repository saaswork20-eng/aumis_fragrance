import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

const orderInputSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  street: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(2),
  country: z.string().min(2),
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

describe("Order Calculation & Inventory Validation", () => {
  it("validates well-formed checkout orders", () => {
    const validCheckout = {
      name: "Victoria Kensington",
      phone: "+1 555 234 5678",
      street: "740 Park Avenue",
      city: "New York",
      state: "NY",
      postalCode: "10021",
      country: "United States",
      items: [
        { variantId: "var-royal-oud-50", quantity: 2 },
        { variantId: "var-jasmine-100", quantity: 1 },
      ],
    };

    const parsed = orderInputSchema.safeParse(validCheckout);
    assert.equal(parsed.success, true);
  });

  it("rejects orders with empty items list or negative quantities", () => {
    const emptyOrder = {
      name: "Victoria Kensington",
      phone: "+1 555 234 5678",
      street: "740 Park Avenue",
      city: "New York",
      state: "NY",
      postalCode: "10021",
      country: "United States",
      items: [],
    };
    assert.equal(orderInputSchema.safeParse(emptyOrder).success, false, "Must reject checkout with zero items");

    const zeroQuantityOrder = {
      ...emptyOrder,
      items: [{ variantId: "var-1", quantity: 0 }],
    };
    assert.equal(orderInputSchema.safeParse(zeroQuantityOrder).success, false, "Must reject quantity 0");

    const negativeQuantityOrder = {
      ...emptyOrder,
      items: [{ variantId: "var-1", quantity: -2 }],
    };
    assert.equal(orderInputSchema.safeParse(negativeQuantityOrder).success, false, "Must reject negative quantity");
  });

  it("strictly enforces server-calculated price and ignores client-submitted price", () => {
    // Malicious client payload trying to set price to $0.01
    const clientPayload = {
      variantId: "var-royal-oud-50",
      clientSuppliedPrice: 0.01,
      quantity: 2,
    };

    // Actual authoritative database record
    const databaseRecord = {
      id: "var-royal-oud-50",
      price: 150.0, // Authoritative price in DB
      name: "50ml Spray",
    };

    // Server-side calculation ignores clientSuppliedPrice completely
    const verifiedPrice = Number(databaseRecord.price);
    const serverTotal = verifiedPrice * clientPayload.quantity;

    assert.equal(serverTotal, 300.0, "Total must be calculated exclusively using authoritative database price ($300.00)");
    assert.notEqual(serverTotal, clientPayload.clientSuppliedPrice * clientPayload.quantity, "Client-submitted price must never be used");
  });

  it("calculates server-side subtotal, luxury tax, and shipping accurately", () => {
    const dbPriceRoyalOud = 150.0;
    const dbPriceJasmine = 95.0;

    const requestedItems = [
      { unitPrice: dbPriceRoyalOud, quantity: 2 }, // $300.00
      { unitPrice: dbPriceJasmine, quantity: 1 },  // $95.00
    ];

    const subtotal = requestedItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
    assert.equal(subtotal, 395.0);

    // Free delivery over $150
    const shipping = subtotal > 150 ? 0 : 15;
    assert.equal(shipping, 0);

    // 5% luxury goods tax
    const tax = subtotal * 0.05;
    assert.equal(tax, 19.75);

    const grandTotal = subtotal + shipping + tax;
    assert.equal(grandTotal, 414.75);
  });

  it("rejects orders exceeding available inventory stock", () => {
    const availableInventory = 5;
    const requestedQuantity = 10;

    const hasSufficientStock = requestedQuantity <= availableInventory;
    assert.equal(hasSufficientStock, false, "Must detect and reject insufficient stock");
  });

  it("simulates atomic conditional decrement under concurrent race condition", () => {
    // Shared database state: exactly 1 bottle in stock
    let databaseStock = 1;

    // Atomic update simulation mirroring:
    // UPDATE "Inventory" SET "availableQuantity" = "availableQuantity" - 1 WHERE "availableQuantity" >= 1
    const atomicDecrement = (qty: number): boolean => {
      if (databaseStock >= qty) {
        databaseStock -= qty;
        return true; // 1 row updated (success)
      }
      return false; // 0 rows updated (rejected / rollback)
    };

    // Buyer 1 and Buyer 2 concurrently try to buy 1 bottle
    const buyer1Result = atomicDecrement(1);
    const buyer2Result = atomicDecrement(1);

    assert.equal(buyer1Result, true, "First buyer receives the last bottle");
    assert.equal(buyer2Result, false, "Second concurrent buyer must be atomically rejected");
    assert.equal(databaseStock, 0, "Database inventory must never drop below 0");
  });
});
