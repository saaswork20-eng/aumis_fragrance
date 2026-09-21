import { Hero } from "@/components/storefront/Hero";
import { Features } from "@/components/storefront/Features";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { getActiveProducts } from "@/services/product.service";
import { getActiveAdsByPlacement } from "@/services/ad.service";
import { AdBanner } from "@/components/storefront/AdBanner";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, homepageAds] = await Promise.all([
    getActiveProducts(),
    getActiveAdsByPlacement("HOMEPAGE_BANNER"),
  ]);

  return (
    <>
      <Hero />
      <AdBanner ads={homepageAds} layout="hero" />
      <ProductGrid
        products={products}
        title="Our Signature Scents"
        subtitle="Meticulously distilled pure attars and luxury perfumes made with rare natural extracts."
      />
      <Features />
    </>
  );
}
