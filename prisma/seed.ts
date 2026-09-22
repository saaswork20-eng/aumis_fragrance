import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting idempotent seed...");

  // Passwords from environment or safe defaults for demonstration
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD || "DemoAdmin123!";
  const sellerPassword = process.env.DEMO_SELLER_PASSWORD || "DemoSeller123!";
  const buyerPassword = process.env.DEMO_BUYER_PASSWORD || "DemoBuyer123!";

  const [hashedAdminPw, hashedSellerPw, hashedBuyerPw] = await Promise.all([
    bcrypt.hash(adminPassword, 10),
    bcrypt.hash(sellerPassword, 10),
    bcrypt.hash(buyerPassword, 10),
  ]);

  // 1. Seed Demo Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@aumisfragrance.com" },
    update: {
      role: "ADMIN",
      isActive: true,
      passwordHash: hashedAdminPw,
    },
    create: {
      email: "admin@aumisfragrance.com",
      name: "AUMIS Administrator",
      passwordHash: hashedAdminPw,
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log(`✓ Admin user: ${admin.email}`);

  // 2. Seed Demo Seller
  const seller = await prisma.user.upsert({
    where: { email: "seller@aumisfragrance.com" },
    update: {
      role: "SELLER",
      isActive: true,
      passwordHash: hashedSellerPw,
    },
    create: {
      email: "seller@aumisfragrance.com",
      name: "Royal Fragrance House (Seller)",
      passwordHash: hashedSellerPw,
      role: "SELLER",
      isActive: true,
    },
  });
  console.log(`✓ Seller user: ${seller.email}`);

  // 3. Seed Demo Buyer
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@aumisfragrance.com" },
    update: {
      role: "BUYER",
      isActive: true,
      passwordHash: hashedBuyerPw,
    },
    create: {
      email: "buyer@aumisfragrance.com",
      name: "AUMIS Demo Buyer",
      passwordHash: hashedBuyerPw,
      role: "BUYER",
      isActive: true,
    },
  });
  console.log(`✓ Buyer user: ${buyer.email}`);

  // 4. Seed Categories
  const categoryOud = await prisma.category.upsert({
    where: { slug: "oud" },
    update: {},
    create: {
      name: "Oud",
      slug: "oud",
      description: "Rich, deep, and luxurious woody fragrances crafted from rare agarwood.",
    },
  });

  const categoryAttar = await prisma.category.upsert({
    where: { slug: "attar" },
    update: {},
    create: {
      name: "Attar",
      slug: "attar",
      description: "Pure, alcohol-free concentrated perfume oils with lasting projection.",
    },
  });

  const categoryPerfume = await prisma.category.upsert({
    where: { slug: "perfume" },
    update: {},
    create: {
      name: "Perfume",
      slug: "perfume",
      description: "Artisanal spray perfumes formulated for sophisticated everyday wear.",
    },
  });
  console.log("✓ Categories initialized");

  // 5. Seed Advertiser & Demo Advertisement
  const luxuryBrands = await prisma.advertiser.upsert({
    where: { name: "AUMIS Private Reserve" },
    update: {},
    create: {
      name: "AUMIS Private Reserve",
      contactEmail: "concierge@aumisfragrance.com",
      isActive: true,
    },
  });

  const ad = await prisma.advertisement.findFirst({
    where: { title: "Exclusive Winter Oud Collection" },
  });

  if (!ad) {
    await prisma.advertisement.create({
      data: {
        advertiserId: luxuryBrands.id,
        title: "Exclusive Winter Oud Collection",
        description: "Experience the warm embrace of aged Cambodian oud and Damascus rose.",
        imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
        destinationUrl: "/shop",
        ctaText: "Explore Reserve",
        placement: "HOMEPAGE_BANNER",
        status: "ACTIVE",
        startDate: new Date(Date.now() - 86400000), // Yesterday
        endDate: new Date(Date.now() + 86400000 * 365), // 1 year from now
      },
    });
  }
  console.log("✓ Advertisements initialized");

  // 6. Seed Demo Products (Belonging to the Seller)
  const productsData = [
    {
      name: "Royal Oud",
      slug: "royal-oud",
      description: "A majestic blend of pure aged Cambodian oud, Mysore sandalwood, and a delicate touch of Taif rose. Designed for distinguished evenings.",
      basePrice: 150.0,
      categoryId: categoryOud.id,
      imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
      variants: [
        { sku: "OUD-ROYAL-50", name: "50ml Spray", price: 150.0, stock: 50 },
        { sku: "OUD-ROYAL-100", name: "100ml Spray", price: 260.0, stock: 35 },
      ],
    },
    {
      name: "Midnight Musk",
      slug: "midnight-musk",
      description: "Deep, sensual deer musk accord enriched with Madagascan vanilla, amber crystals, and white floral undertones. A timeless classic oil.",
      basePrice: 85.5,
      categoryId: categoryAttar.id,
      imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
      variants: [
        { sku: "ATT-MIDNIGHT-12", name: "12ml Pure Oil", price: 85.5, stock: 100 },
        { sku: "ATT-MIDNIGHT-24", name: "24ml Pure Oil", price: 155.0, stock: 45 },
      ],
    },
    {
      name: "Jasmine Bloom",
      slug: "jasmine-bloom",
      description: "Fresh, ethereal, and uplifting. Captures the intoxicating essence of blooming Arabian jasmine petals picked at dawn, touched with sparkling bergamot.",
      basePrice: 95.0,
      categoryId: categoryPerfume.id,
      imageUrl: "https://images.unsplash.com/photo-1595535373192-fc8938bab37c?q=80&w=800&auto=format&fit=crop",
      variants: [
        { sku: "PERF-JASMINE-50", name: "50ml Spray", price: 95.0, stock: 40 },
        { sku: "PERF-JASMINE-100", name: "100ml Spray", price: 165.0, stock: 25 },
      ],
    },
    {
      name: "Amber Sovereign",
      slug: "amber-sovereign",
      description: "Warm golden resinous amber blended with roasted tonka beans, smoky frankincense, and cedarwood. Radiates comforting opulence.",
      basePrice: 120.0,
      categoryId: categoryOud.id,
      imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop",
      variants: [
        { sku: "OUD-AMBER-50", name: "50ml Spray", price: 120.0, stock: 30 },
      ],
    },
  ];

  for (const item of productsData) {
    const existing = await prisma.product.findUnique({
      where: { slug: item.slug },
      include: { variants: true },
    });

    if (!existing) {
      const created = await prisma.product.create({
        data: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          basePrice: item.basePrice,
          categoryId: item.categoryId,
          sellerId: seller.id,
          isActive: true,
          images: {
            create: {
              url: item.imageUrl,
              altText: `${item.name} Bottle`,
              isPrimary: true,
            },
          },
        },
      });

      for (const v of item.variants) {
        await prisma.productVariant.create({
          data: {
            productId: created.id,
            sku: v.sku,
            name: v.name,
            price: v.price,
            inventory: {
              create: {
                availableQuantity: v.stock,
                reservedQuantity: 0,
              },
            },
          },
        });
      }
    }
  }

  console.log("✓ Products and variants initialized with seller ownership");

  // 7. Seed Merchandising Flags (New Launch & Best Seller)
  const royalOud = await prisma.product.findUnique({ where: { slug: "royal-oud" } });
  const midnightMusk = await prisma.product.findUnique({ where: { slug: "midnight-musk" } });
  const jasmineBloom = await prisma.product.findUnique({ where: { slug: "jasmine-bloom" } });
  const amberSovereign = await prisma.product.findUnique({ where: { slug: "amber-sovereign" } });

  if (royalOud) {
    await prisma.product.update({
      where: { id: royalOud.id },
      data: { isBestSeller: true },
    });
  }

  if (midnightMusk) {
    await prisma.product.update({
      where: { id: midnightMusk.id },
      data: { isNewLaunch: true },
    });
  }

  if (amberSovereign) {
    await prisma.product.update({
      where: { id: amberSovereign.id },
      data: { isNewLaunch: true, isBestSeller: true },
    });
  }
  console.log("✓ Merchandising flags (New Launch & Best Seller) updated");

  // 8. Seed Product Offers
  if (royalOud) {
    await prisma.productOffer.upsert({
      where: { productId: royalOud.id },
      update: { discountPercentage: 15, isActive: true },
      create: {
        productId: royalOud.id,
        discountPercentage: 15,
        isActive: true,
      },
    });
  }

  if (jasmineBloom) {
    await prisma.productOffer.upsert({
      where: { productId: jasmineBloom.id },
      update: { discountPercentage: 20, isActive: true },
      create: {
        productId: jasmineBloom.id,
        discountPercentage: 20,
        isActive: true,
      },
    });
  }
  console.log("✓ Product offers initialized");

  // 9. Seed Carousel Slides (At least 3 slides)
  const existingSlides = await prisma.carouselSlide.count();
  if (existingSlides === 0) {
    await prisma.carouselSlide.createMany({
      data: [
        {
          title: "Discover Our New Collection",
          description: "Luxury artisanal fragrances distilled from rare pure extracts and aged Cambodian oud.",
          imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1600&auto=format&fit=crop",
          ctaText: "Explore Collection",
          categoryId: categoryOud.id,
          discountText: null,
          displayOrder: 1,
          isActive: true,
        },
        {
          title: "Royal Oud — Masterpiece Formulation",
          description: "An imperial blend of pure aged oud, sandalwood, and Taif rose. Special introductory offer.",
          imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1600&auto=format&fit=crop",
          ctaText: "Claim 15% OFF",
          productId: royalOud?.id,
          discountText: "15% OFF",
          displayOrder: 2,
          isActive: true,
        },
        {
          title: "Artisanal Jasmine Bloom",
          description: "Fresh, ethereal dawn petals touched with sparkling bergamot and gentle golden amber.",
          imageUrl: "https://images.unsplash.com/photo-1595535373192-fc8938bab37c?q=80&w=1600&auto=format&fit=crop",
          ctaText: "Shop Scent",
          productId: jasmineBloom?.id,
          discountText: "20% OFF",
          displayOrder: 3,
          isActive: true,
        },
      ],
    });
  }
  console.log("✓ Carousel slides initialized");
  console.log("Seed finished successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
