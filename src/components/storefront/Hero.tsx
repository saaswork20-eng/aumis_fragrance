import Link from "next/link";

export function Hero() {
  return (
    <section 
      className="relative flex min-h-[80vh] items-center justify-center bg-primary bg-cover bg-fixed bg-center px-8 py-16 text-center"
      style={{
        backgroundImage: "linear-gradient(rgba(248, 245, 240, 0.75), rgba(248, 245, 240, 0.95)), url('https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop')"
      }}
    >
      <div className="z-10 mx-auto max-w-3xl">
        <h1 className="animate-slide-up mb-4 font-heading text-5xl font-bold text-text-main drop-shadow-md sm:text-6xl md:text-7xl">
          The Essence of Luxury
        </h1>
        <p className="animate-slide-up delay-100 mx-auto mb-10 max-w-xl text-lg text-text-muted md:text-xl">
          Discover our meticulously crafted collection of premium attars and perfumes, designed to leave a lasting impression.
        </p>
        <Link 
          href="#collection" 
          className="animate-slide-up delay-200 inline-block rounded-full bg-accent px-8 py-4 font-medium uppercase tracking-widest text-white shadow-sm transition-all hover:-translate-y-1 hover:bg-accent-hover hover:shadow-md"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
}
