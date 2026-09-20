import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AUMIS Fragrance | Premium Attar & Perfumes",
  description: "AUMIS Fragrance - Premium Attar and Perfumes. Discover our exclusive collection of high-quality, long-lasting fragrances. Experience the essence of luxury.",
  keywords: ["Perfume", "Attar", "Fragrance", "Premium Scents", "AUMIS", "Luxury Perfumes", "Oud", "Best Attar", "Long lasting perfumes"],
  authors: [{ name: "AUMIS Fragrance" }],
  metadataBase: new URL("https://www.aumisfragrance.com/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.aumisfragrance.com/",
    title: "AUMIS Fragrance | Premium Attar & Perfumes",
    description: "Discover our exclusive collection of high-quality, long-lasting fragrances.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "AUMIS Fragrance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AUMIS Fragrance | Premium Attar & Perfumes",
    description: "Discover our exclusive collection of high-quality, long-lasting fragrances.",
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
