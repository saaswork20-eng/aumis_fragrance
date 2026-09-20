import Image from "next/image";
import Link from "next/link";

type AdDisplay = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  destinationUrl: string;
  ctaText: string;
  advertiserName: string;
};

interface AdBannerProps {
  ads: AdDisplay[];
  layout?: "hero" | "inline";
}

export function AdBanner({ ads, layout = "hero" }: AdBannerProps) {
  if (!ads || ads.length === 0) return null;

  // In this simple implementation, we just display the first active ad
  // A more complex system might rotate them
  const ad = ads[0];

  if (layout === "inline") {
    return (
      <div className="my-8 overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm transition-shadow hover:shadow-md">
        <Link href={ad.destinationUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col sm:flex-row">
          <div className="relative h-48 w-full sm:w-1/3">
            <Image 
              src={ad.imageUrl} 
              alt={ad.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <div className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
              Sponsored
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center p-6 text-left">
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
              {ad.advertiserName}
            </div>
            <h3 className="mb-2 font-heading text-xl font-bold text-text-main">{ad.title}</h3>
            {ad.description && (
              <p className="mb-4 text-sm text-text-muted">{ad.description}</p>
            )}
            <span className="inline-block font-medium text-accent hover:text-accent-hover">
              {ad.ctaText} &rarr;
            </span>
          </div>
        </Link>
      </div>
    );
  }

  // Default "hero" style banner
  return (
    <div className="relative w-full bg-primary py-12">
      <div className="mx-auto max-w-7xl px-5 text-center">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-lg">
          <Link href={ad.destinationUrl} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[21/9] w-full overflow-hidden bg-black">
            <Image 
              src={ad.imageUrl} 
              alt={ad.title}
              fill
              className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-90"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
            
            <div className="absolute left-4 top-4 rounded bg-black/60 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
              Sponsored
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
              <div className="mt-auto flex max-w-2xl flex-col items-center text-center">
                <span className="mb-2 text-sm font-bold uppercase tracking-widest text-accent drop-shadow-md">
                  {ad.advertiserName}
                </span>
                <h3 className="mb-3 font-heading text-3xl font-bold drop-shadow-lg md:text-5xl">
                  {ad.title}
                </h3>
                {ad.description && (
                  <p className="mb-6 text-sm text-gray-200 drop-shadow-md md:text-base">
                    {ad.description}
                  </p>
                )}
                <span className="inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-text-main transition-transform group-hover:-translate-y-1">
                  {ad.ctaText}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
