import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // 1. Create initial Super Admin
  const hashedPassword = await bcrypt.hash("AumisAdmin2026!", 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@aumisfragrance.com" },
    update: {},
    create: {
      email: "admin@aumisfragrance.com",
      name: "AUMIS Super Admin",
      passwordHash: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log(`Super Admin created: ${superAdmin.email}`);

  // 2. Create Categories
  const categoryOud = await prisma.category.upsert({
    where: { slug: "oud" },
    update: {},
    create: {
      name: "Oud",
      slug: "oud",
      description: "Rich, deep, and luxurious woody fragrances.",
    },
  });

  const categoryAttar = await prisma.category.upsert({
    where: { slug: "attar" },
    update: {},
    create: {
      name: "Attar",
      slug: "attar",
      description: "Pure, alcohol-free essential oil blends.",
    },
  });

  const categoryPerfume = await prisma.category.upsert({
    where: { slug: "perfume" },
    update: {},
    create: {
      name: "Perfume",
      slug: "perfume",
      description: "Elegant spray perfumes for everyday wear.",
    },
  });
  console.log("Categories created.");

  // 2.5 Create Initial Advertiser
  const luxuryBrands = await prisma.advertiser.upsert({
    where: { name: "Luxury Brands Intl." },
    update: {},
    create: {
      name: "Luxury Brands Intl.",
      contactEmail: "ads@luxurybrands.example.com",
      isActive: true,
    }
  });
  console.log(`Advertiser created: ${luxuryBrands.name}`);

  // 3. Create Products and Variants
  const royalOud = await prisma.product.upsert({
    where: { slug: "royal-oud" },
    update: {},
    create: {
      name: "Royal Oud",
      slug: "royal-oud",
      description: "A majestic blend of pure aged oud, sandalwood, and a touch of rose. Perfect for evening wear.",
      basePrice: 150.00,
      categoryId: categoryOud.id,
      images: {
        create: {
          url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
          altText: "Royal Oud Bottle",
          isPrimary: true,
        }
      },
      variants: {
        create: {
          sku: "OUD-ROYAL-50",
          name: "50ml Spray",
          price: 150.00,
          inventory: {
            create: {
              availableQuantity: 50,
            }
          }
        }
      }
    },
  });

  const midnightMusk = await prisma.product.upsert({
    where: { slug: "midnight-musk" },
    update: {},
    create: {
      name: "Midnight Musk",
      slug: "midnight-musk",
      description: "Deep, sensual musk with hints of vanilla and amber. A timeless classic.",
      basePrice: 85.50,
      categoryId: categoryAttar.id,
      images: {
        create: {
          url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop",
          altText: "Midnight Musk Bottle",
          isPrimary: true,
        }
      },
      variants: {
        create: {
          sku: "ATT-MIDNIGHT-12",
          name: "12ml Oil",
          price: 85.50,
          inventory: {
            create: {
              availableQuantity: 100,
            }
          }
        }
      }
    },
  });

  const jasmineBloom = await prisma.product.upsert({
    where: { slug: "jasmine-bloom" },
    update: {},
    create: {
      name: "Jasmine Bloom",
      slug: "jasmine-bloom",
      description: "Fresh, floral, and uplifting. Captures the essence of a blooming jasmine garden at dawn.",
      basePrice: 95.00,
      categoryId: categoryPerfume.id,
      images: {
        create: {
          url: "https://images.unsplash.com/photo-1595535373192-fc8938bab37c?q=80&w=600&auto=format&fit=crop",
          altText: "Jasmine Bloom Bottle",
          isPrimary: true,
        }
      },
      variants: {
        create: {
          sku: "PERF-JASMINE-100",
          name: "100ml Spray",
          price: 95.00,
          inventory: {
            create: {
              availableQuantity: 30,
            }
          }
        }
      }
    },
  });

  console.log("Products and Inventory created.");
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
