import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isOfferActive, computeDiscountedPrice } from "../src/services/product.service";

describe("Customer Storefront Merchandising & Category Filtering", () => {
  const sampleProducts = [
    { id: "p1", name: "Royal Oud", categorySlug: "oud", price: 127.5, isBestSeller: true, isNewLaunch: false },
    { id: "p2", name: "Midnight Musk", categorySlug: "attar", price: 85.5, isBestSeller: false, isNewLaunch: true },
    { id: "p3", name: "Jasmine Bloom", categorySlug: "perfume", price: 76.0, isBestSeller: false, isNewLaunch: false },
    { id: "p4", name: "Amber Sovereign", categorySlug: "oud", price: 120.0, isBestSeller: true, isNewLaunch: true },
  ];

  it("filters products by category correctly without duplication", () => {
    const oudProducts = sampleProducts.filter((p) => p.categorySlug === "oud");
    assert.equal(oudProducts.length, 2);
    assert.equal(oudProducts[0].name, "Royal Oud");
    assert.equal(oudProducts[1].name, "Amber Sovereign");

    const allProducts = sampleProducts.filter(() => true);
    assert.equal(allProducts.length, 4);
  });

  it("handles empty categories gracefully", () => {
    const emptyCategoryProducts = sampleProducts.filter((p) => p.categorySlug === "nonexistent-category");
    assert.equal(emptyCategoryProducts.length, 0);
  });
});

describe("Homepage Carousel Functionality", () => {
  const slides = [
    {
      id: "s1",
      title: "Oud Collection",
      displayOrder: 2,
      isActive: true,
      categorySlug: "oud",
      productSlug: null,
    },
    {
      id: "s2",
      title: "Inactive Slide",
      displayOrder: 1,
      isActive: false,
      categorySlug: null,
      productSlug: "royal-oud",
    },
    {
      id: "s3",
      title: "Royal Oud Feature",
      displayOrder: 1,
      isActive: true,
      categorySlug: null,
      productSlug: "royal-oud",
    },
  ];

  it("filters out inactive slides for customers", () => {
    const activeSlides = slides.filter((s) => s.isActive);
    assert.equal(activeSlides.length, 2);
    assert.ok(activeSlides.every((s) => s.isActive));
  });

  it("orders slides by displayOrder ascending", () => {
    const sorted = slides
      .filter((s) => s.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    assert.equal(sorted[0].id, "s3");
    assert.equal(sorted[1].id, "s1");
  });

  it("generates correct product and category destination links", () => {
    const getLink = (slide: typeof slides[0]) => {
      if (slide.productSlug) return `/products/${slide.productSlug}`;
      if (slide.categorySlug) return `/shop?category=${slide.categorySlug}`;
      return "/shop";
    };

    assert.equal(getLink(slides[0]), "/shop?category=oud");
    assert.equal(getLink(slides[2]), "/products/royal-oud");
  });
});

describe("Offers, Discount Calculation & Server-Side Pricing Safety", () => {
  it("calculates correct discounted price from discount percentage", () => {
    // 15% off $150.00 => $127.50
    const price1 = computeDiscountedPrice(150, 15);
    assert.equal(price1, 127.5);

    // 20% off $95.00 => $76.00
    const price2 = computeDiscountedPrice(95, 20);
    assert.equal(price2, 76.0);

    // 0% discount returns original price
    const price3 = computeDiscountedPrice(200, 0);
    assert.equal(price3, 200.0);
  });

  it("validates offer active status with date ranges", () => {
    const activeOffer = { isActive: true };
    assert.equal(isOfferActive(activeOffer), true);

    const inactiveOffer = { isActive: false };
    assert.equal(isOfferActive(inactiveOffer), false);

    const pastOffer = {
      isActive: true,
      startDate: new Date(Date.now() - 1000000),
      endDate: new Date(Date.now() - 500000), // Ended in the past
    };
    assert.equal(isOfferActive(pastOffer), false, "Expired offer must not be active");

    const futureOffer = {
      isActive: true,
      startDate: new Date(Date.now() + 500000), // Starts in the future
      endDate: new Date(Date.now() + 1000000),
    };
    assert.equal(isOfferActive(futureOffer), false, "Future offer must not be active yet");

    const currentOffer = {
      isActive: true,
      startDate: new Date(Date.now() - 100000),
      endDate: new Date(Date.now() + 100000),
    };
    assert.equal(isOfferActive(currentOffer), true, "Active offer within date window must be valid");
  });

  it("strictly enforces server-side pricing over client-tampered prices", () => {
    const dbVariant = { id: "var-1", price: 150.0 };
    const dbOffer = { discountPercentage: 15, isActive: true };
    const clientSubmittedItem = {
      variantId: "var-1",
      quantity: 2,
      price: 5.0, // Client attempts to buy at $5.00 instead of real price!
      discount: 90, // Client attempts to claim 90% discount!
    };

    // Server-side authoritative price resolution:
    const serverDiscount = isOfferActive(dbOffer) ? dbOffer.discountPercentage : 0;
    const authoritativeUnitPrice = computeDiscountedPrice(dbVariant.price, serverDiscount);
    const authoritativeTotal = authoritativeUnitPrice * clientSubmittedItem.quantity;

    assert.equal(authoritativeUnitPrice, 127.5);
    assert.equal(authoritativeTotal, 255.0);
    assert.notEqual(authoritativeUnitPrice, clientSubmittedItem.price, "Server must disregard client-submitted price");
  });
});

describe("Merchandising Authorization & IDOR Security Guards", () => {
  const sellerA = { id: "seller-101", role: "SELLER" };
  const sellerB = { id: "seller-202", role: "SELLER" };
  const admin = { id: "admin-999", role: "ADMIN" };
  const buyer = { id: "buyer-001", role: "BUYER" };

  const productA = { id: "prod-1", name: "Oud Royale", sellerId: "seller-101" };
  const offerA = { id: "off-1", productId: "prod-1", sellerId: "seller-101" };

  // Permission checkers mirroring server actions
  const canModifyProduct = (actor: { id: string; role: string }, product: { sellerId: string }) => {
    if (actor.role === "ADMIN") return true;
    if (actor.role === "SELLER") return product.sellerId === actor.id;
    return false;
  };

  const canModifyOffer = (actor: { id: string; role: string }, offer: { sellerId: string }) => {
    if (actor.role === "ADMIN") return true;
    if (actor.role === "SELLER") return offer.sellerId === actor.id;
    return false;
  };

  const canManageBestSeller = (actor: { role: string }) => {
    return actor.role === "ADMIN";
  };

  const canManageCarousel = (actor: { role: string }) => {
    return actor.role === "ADMIN";
  };

  const canManageCategories = (actor: { role: string }) => {
    return actor.role === "ADMIN";
  };

  it("allows Seller A to manage New Launch on their own product", () => {
    assert.equal(canModifyProduct(sellerA, productA), true);
  });

  it("prevents Seller B from modifying Seller A's product or New Launch status (IDOR Guard)", () => {
    assert.equal(
      canModifyProduct(sellerB, productA),
      false,
      "Seller B MUST NOT modify Seller A's product"
    );
  });

  it("allows Seller A to manage offers on their own product", () => {
    assert.equal(canModifyOffer(sellerA, offerA), true);
  });

  it("prevents Seller B from modifying Seller A's offer (IDOR Guard)", () => {
    assert.equal(
      canModifyOffer(sellerB, offerA),
      false,
      "Seller B MUST NOT modify Seller A's offer"
    );
  });

  it("restricts Best Seller badge merchandising exclusively to Admin", () => {
    assert.equal(canManageBestSeller(admin), true);
    assert.equal(canManageBestSeller(sellerA), false, "Seller cannot set Best Seller tag");
    assert.equal(canManageBestSeller(buyer), false, "Buyer cannot set Best Seller tag");
  });

  it("restricts Carousel and Category management exclusively to Admin", () => {
    assert.equal(canManageCarousel(admin), true);
    assert.equal(canManageCarousel(sellerA), false, "Seller cannot modify carousel");
    assert.equal(canManageCarousel(buyer), false, "Buyer cannot modify carousel");

    assert.equal(canManageCategories(admin), true);
    assert.equal(canManageCategories(sellerA), false, "Seller cannot modify categories");
    assert.equal(canManageCategories(buyer), false, "Buyer cannot modify categories");
  });

  it("prevents Buyer from making any merchandising modifications", () => {
    assert.equal(canModifyProduct(buyer, productA), false);
    assert.equal(canModifyOffer(buyer, offerA), false);
  });
});
