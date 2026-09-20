import { Hero } from "@/components/storefront/Hero";
import { Features } from "@/components/storefront/Features";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { getActiveProducts } from "@/services/product.service";
import { getActiveAdsByPlacement } from "@/services/ad.service";
import { AdBanner } from "@/components/storefront/AdBanner";

// Enable static regeneration every hour to keep database hits low 
// but storefront reasonably fresh
export const revalidate = 3600; 

export default async function Home() {
  let products: any[] = [];
  let homepageAds: any[] = [];

  try {
    [products, homepageAds] = await Promise.all([
      getActiveProducts(),
      getActiveAdsByPlacement("HOMEPAGE_BANNER")
    ]);
  } catch (error) {
    console.warn("Database not connected yet, showing empty state.");
  }

  return (
    <>
      <Hero />
      <AdBanner ads={homepageAds} layout="hero" />
      <ProductGrid products={products} />
      <Features />
    </>
  );
}
