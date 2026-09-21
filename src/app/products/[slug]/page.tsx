import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/product.service";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | AUMIS Fragrance",
    };
  }

  return {
    title: `${product.name} | AUMIS Fragrance`,
    description: product.description,
    openGraph: {
      title: `${product.name} | AUMIS Luxury`,
      description: product.description,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
