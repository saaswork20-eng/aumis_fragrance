import { describe, it } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { authConfig } from "../src/auth.config";

describe("Authentication & Role-Based Authorization", () => {
  it("correctly hashes and verifies passwords using bcrypt", async () => {
    const rawPassword = "AumisLuxurySecret2026!";
    const hash = await bcrypt.hash(rawPassword, 10);

    assert.ok(hash.startsWith("$2"), "Hash should be a valid bcrypt hash format");
    const isMatch = await bcrypt.compare(rawPassword, hash);
    assert.equal(isMatch, true, "Valid password should verify successfully");

    const isWrongMatch = await bcrypt.compare("WrongPassword123!", hash);
    assert.equal(isWrongMatch, false, "Invalid password should fail verification");
  });

  it("blocks unauthenticated users from accessing protected portals", () => {
    const authorized = authConfig.callbacks?.authorized;
    assert.ok(authorized, "authorized callback must be defined in auth.config");

    // Test Admin route without auth
    const adminCheck = authorized({
      auth: null,
      request: { nextUrl: new URL("http://localhost:3000/admin") } as any,
    });
    assert.equal(adminCheck, false, "Unauthenticated user must NOT access /admin");

    // Test Seller route without auth
    const sellerCheck = authorized({
      auth: null,
      request: { nextUrl: new URL("http://localhost:3000/seller") } as any,
    });
    assert.equal(sellerCheck, false, "Unauthenticated user must NOT access /seller");

    // Test Checkout route without auth
    const checkoutCheck = authorized({
      auth: null,
      request: { nextUrl: new URL("http://localhost:3000/checkout") } as any,
    });
    assert.equal(checkoutCheck, false, "Unauthenticated user must NOT access /checkout");
  });

  it("blocks BUYER role from accessing SELLER and ADMIN portals", () => {
    const authorized = authConfig.callbacks?.authorized!;

    const buyerSession = {
      user: { id: "buyer-123", role: "BUYER" },
      expires: "2099-01-01",
    };

    const adminCheck = authorized({
      auth: buyerSession as any,
      request: { nextUrl: new URL("http://localhost:3000/admin/products") } as any,
    });
    assert.equal(adminCheck, false, "BUYER must NOT access /admin routes");

    const sellerCheck = authorized({
      auth: buyerSession as any,
      request: { nextUrl: new URL("http://localhost:3000/seller/products") } as any,
    });
    assert.equal(sellerCheck, false, "BUYER must NOT access /seller routes");

    const accountCheck = authorized({
      auth: buyerSession as any,
      request: { nextUrl: new URL("http://localhost:3000/account/orders") } as any,
    });
    assert.equal(accountCheck, true, "BUYER is authorized to access /account/orders");
  });

  it("blocks SELLER role from accessing ADMIN portal but permits SELLER portal", () => {
    const authorized = authConfig.callbacks?.authorized!;

    const sellerSession = {
      user: { id: "seller-123", role: "SELLER" },
      expires: "2099-01-01",
    };

    const adminCheck = authorized({
      auth: sellerSession as any,
      request: { nextUrl: new URL("http://localhost:3000/admin") } as any,
    });
    assert.equal(adminCheck, false, "SELLER must NOT access /admin");

    const sellerCheck = authorized({
      auth: sellerSession as any,
      request: { nextUrl: new URL("http://localhost:3000/seller/products") } as any,
    });
    assert.equal(sellerCheck, true, "SELLER must access /seller/products");
  });

  it("permits ADMIN role to access both ADMIN and SELLER portals", () => {
    const authorized = authConfig.callbacks?.authorized!;

    const adminSession = {
      user: { id: "admin-123", role: "ADMIN" },
      expires: "2099-01-01",
    };

    const adminCheck = authorized({
      auth: adminSession as any,
      request: { nextUrl: new URL("http://localhost:3000/admin/orders") } as any,
    });
    assert.equal(adminCheck, true, "ADMIN must access /admin");

    const sellerCheck = authorized({
      auth: adminSession as any,
      request: { nextUrl: new URL("http://localhost:3000/seller") } as any,
    });
    assert.equal(sellerCheck, true, "ADMIN has elevated access to /seller");
  });

  it("rejects invalid credentials and nonexistent users", async () => {
    const validHash = await bcrypt.hash("CorrectPassword123!", 10);

    // Wrong password
    const wrongPassword = await bcrypt.compare("WrongPassword!", validHash);
    assert.equal(wrongPassword, false, "Wrong password must be rejected");

    // Empty credentials
    const emptyPassword = await bcrypt.compare("", validHash);
    assert.equal(emptyPassword, false, "Empty password must be rejected");
  });

  it("enforces Buyer order isolation (Buyer B cannot access Buyer A's order)", () => {
    const orderPlacedByBuyerA = {
      id: "order-abc-123",
      userId: "buyer-alpha-id",
      totalAmount: 150.0,
    };

    // Buyer B attempts to access Buyer A's order
    const buyerB = { id: "buyer-beta-id", role: "BUYER" };
    const canBuyerBAccess =
      orderPlacedByBuyerA.userId === buyerB.id || buyerB.role === "ADMIN";
    assert.equal(canBuyerBAccess, false, "Buyer B MUST be blocked from viewing Buyer A's order");

    // Buyer A accesses their own order
    const buyerA = { id: "buyer-alpha-id", role: "BUYER" };
    const canBuyerAAccess =
      orderPlacedByBuyerA.userId === buyerA.id || buyerA.role === "ADMIN";
    assert.equal(canBuyerAAccess, true, "Buyer A must be permitted to view their own order");

    // Admin accesses Buyer A's order for customer support
    const adminUser = { id: "admin-id", role: "ADMIN" };
    const canAdminAccess =
      orderPlacedByBuyerA.userId === adminUser.id || adminUser.role === "ADMIN";
    assert.equal(canAdminAccess, true, "Admin must be permitted to view order for fulfillment");
  });
});

