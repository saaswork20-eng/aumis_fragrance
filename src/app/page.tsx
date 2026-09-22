import { Hero } from "@/components/storefront/Hero";
import { Features } from "@/components/storefront/Features";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { Carousel } from "@/components/storefront/Carousel";
import { CategoryBrowse } from "@/components/storefront/CategoryBrowse";
import {
  getActiveProducts,
  getCategories,
  getNewLaunches,
  getBestSellers,
  getDiscountedProducts,
} from "@/services/product.service";
import { getActiveCarouselSlides } from "@/services/carousel.service";
import { getActiveAdsByPlacement } from "@/services/ad.service";
import { AdBanner } from "@/components/storefront/AdBanner";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    carouselSlides,
    categories,
    newLaunches,
    bestSellers,
    discountedProducts,
    allProducts,
    homepageAds,
  ] = await Promise.all([
    getActiveCarouselSlides(),
    getCategories(),
    getNewLaunches(4),
    getBestSellers(4),
    getDiscountedProducts(4),
    getActiveProducts(),
    getActiveAdsByPlacement("HOMEPAGE_BANNER"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Hero / Carousel */}
      {carouselSlides.length > 0 ? (
        <Carousel slides={carouselSlides} />
      ) : (
        <Hero />
      )}

      {/* Ad Banner if present */}
      {homepageAds.length > 0 && <AdBanner ads={homepageAds} layout="hero" />}

      {/* 2. Categories Browse */}
      <CategoryBrowse
        categories={categories}
        totalProductsCount={allProducts.length}
      />

      {/* 3. New Launches */}
      {newLaunches.length > 0 && (
        <ProductGrid
          id="new-launches"
          products={newLaunches}
          title="New Launches"
          subtitle="Recently unveiled luxury extractions and limited artisanal formulations."
        />
      )}

      {/* 4. Best Sellers */}
      {bestSellers.length > 0 && (
        <div className="bg-primary/30 py-4">
          <ProductGrid
            id="best-sellers"
            products={bestSellers}
            title="Best Sellers"
            subtitle="The most coveted and celebrated masterpieces across the AUMIS reserve."
          />
        </div>
      )}

      {/* 5. Offers / Featured Promotions */}
      {discountedProducts.length > 0 && (
        <ProductGrid
          id="special-offers"
          products={discountedProducts}
          title="Privileged Offers & Promotions"
          subtitle="Special limited-time pricing on extraordinary artisanal fragrances."
        />
      )}

      {/* 6. All Products / Signature Collection */}
      <div className="bg-white">
        <ProductGrid
          id="all-products"
          products={allProducts}
          title="The Complete Collection"
          subtitle="Meticulously distilled pure attars, aged Cambodian oud, and signature luxury perfumes."
        />
      </div>

      {/* 7. Brand Features & Luxury Guarantees */}
      <Features />
    </div>
  );
}
