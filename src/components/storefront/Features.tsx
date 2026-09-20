export function Features() {
  return (
    <section id="about" className="grid grid-cols-1 gap-8 bg-white px-5 py-16 text-center sm:grid-cols-2 md:grid-cols-3 md:px-10 lg:px-20">
      <div className="rounded-lg border border-border-subtle p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-md">
        <h3 className="mb-4 font-heading text-xl font-semibold text-accent">Pure Ingredients</h3>
        <p className="text-sm text-text-muted">
          Sourced from the finest natural extracts globally.
        </p>
      </div>
      
      <div className="rounded-lg border border-border-subtle p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-md">
        <h3 className="mb-4 font-heading text-xl font-semibold text-accent">Long Lasting</h3>
        <p className="text-sm text-text-muted">
          High concentration formulas that stay with you all day.
        </p>
      </div>
      
      <div className="rounded-lg border border-border-subtle p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-md sm:col-span-2 md:col-span-1">
        <h3 className="mb-4 font-heading text-xl font-semibold text-accent">Luxury Packaging</h3>
        <p className="text-sm text-text-muted">
          Presented in exquisite bottles that reflect the scent inside.
        </p>
      </div>
    </section>
  );
}
