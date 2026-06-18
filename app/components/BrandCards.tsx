import { brands, type Brand } from "../lib/data";

const rotationClasses = [
  "[transform:rotate(-2.5deg)] hover:[transform:scale(1.03)_rotate(0deg)]",
  "[transform:rotate(1.8deg)] hover:[transform:scale(1.03)_rotate(0deg)]",
  "[transform:rotate(2.2deg)] hover:[transform:scale(1.03)_rotate(0deg)]",
];

export default function BrandCards() {
  return (
    <section
      id="brands"
      className="relative overflow-hidden bg-sand py-24 md:py-32"
    >
      {/* Section intro — asymmetric */}
      <div className="mx-auto mb-16 max-w-[1500px] px-6 md:px-10">
        <h2 className="font-display mt-4 max-w-3xl text-5xl font-light leading-[0.95] text-forest md:text-7xl">
          The universe
          <br />
          <span className="italic text-gold">comes alive.</span>
        </h2>
        <p className="mt-6 max-w-sm text-base leading-relaxed text-charcoal/65 md:ml-[40%]">
          Awakynn sits at the centre of a wellness constellation. Each sister brand
          steps forward in its own domain — yet never leaves the orbit.
        </p>
      </div>

      {/* Cards grid */}
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b, i) => (
            <Card key={b.id} brand={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ brand, index }: { brand: Brand; index: number }) {
  const rotCls = rotationClasses[index] ?? "";

  return (
    <article
      style={{ color: "#FAF8F5" }}
      className={`grain group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[1.8rem] border border-charcoal/5 p-7 shadow-[0_40px_80px_-40px_rgba(34,34,34,0.45)] transition-[transform] duration-700 md:p-9 ${rotCls}`}
    >
      {/* House imagery */}
      <img
        src={brand.hero}
        alt={brand.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <a
        href={brand.href}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
        aria-label={`Visit ${brand.name}`}
      />

      <div className="relative z-10 flex h-full flex-col justify-between pointer-events-none">
        <div className="flex items-start justify-between">
          <span className="eyebrow opacity-70">{`0${index + 1}`}</span>
          <span className="rounded-full border border-white/25 px-3 py-1 text-[0.62rem] font-medium tracking-[0.18em] opacity-80">
            {brand.tagline.toUpperCase()}
          </span>
        </div>

        <div>
          <span className="text-[0.7rem] font-medium tracking-[0.2em] opacity-65">
            {brand.category}
          </span>
          <h3 className="font-display mt-2 text-4xl font-light leading-[0.9] md:text-5xl">
            {brand.display}
          </h3>
          <p className="mt-4 max-w-[26ch] text-sm leading-relaxed opacity-80">
            {brand.description}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
            Discover the house
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
