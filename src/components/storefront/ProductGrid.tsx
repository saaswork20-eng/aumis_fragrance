import Image from "next/image";

type ProductDisplay = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
};

interface ProductGridProps {
  products: ProductDisplay[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <section id="collection" className="mx-auto max-w-7xl px-5 py-20">
      <h2 className="relative mb-12 text-center font-heading text-4xl font-bold after:absolute after:-bottom-4 after:left-1/2 after:h-[2px] after:w-16 after:-translate-x-1/2 after:bg-accent">
        Our Signature Scents
      </h2>
      
      {products.length === 0 ? (
        <div className="text-center text-text-muted">
          <p>We are currently updating our collection. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex flex-col overflow-hidden rounded-xl border border-transparent bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-border-subtle hover:shadow-md"
            >
              <div className="group relative h-80 w-full overflow-hidden bg-[#f1ede5]">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!product.isAvailable && (
                  <div className="absolute left-0 top-4 rounded-r-md bg-black/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Sold Out
                  </div>
                )}
              </div>
              
              <div className="flex flex-grow flex-col p-6">
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                  {product.category}
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold">{product.name}</h3>
                <p className="line-clamp-3 flex-grow text-sm text-text-muted">
                  {product.description}
                </p>
                
                <div className="mt-6 flex flex-col items-stretch gap-4">
                  <div className="text-center font-heading text-xl font-bold text-text-main">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="flex justify-between gap-3">
                    <button 
                      disabled={!product.isAvailable}
                      className="flex-1 rounded-full border border-border-subtle py-2 text-sm font-medium transition-colors hover:border-accent hover:bg-accent hover:text-white disabled:opacity-50 disabled:hover:border-border-subtle disabled:hover:bg-transparent disabled:hover:text-text-main"
                    >
                      {product.isAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>
                    <button className="flex-1 rounded-full bg-[#25D366] py-2 text-sm font-medium text-white transition-colors hover:bg-[#20b858]">
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
