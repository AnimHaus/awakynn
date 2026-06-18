"use client";

import { ArrowUpRight } from "lucide-react";
import { useInView } from "./useInView";

const brands = [
  {
    name: "GrabFabs",
    tagline: "Eat Well, Feel Real",
    category: "Healthy Food",
    description:
      "Nourishment that aligns with your wellness journey. Clean, conscious food crafted for bodies that are waking up.",
    image:
      "https://cdn.awakynn.com/grabfabs.avif",
    href: "https://grabfabs.com",
  },
  {
    name: "Festiq",
    tagline: "Indulge with Intention",
    category: "Artisan Chocolates",
    description:
      "Chocolate as celebration, not guilt. Festiq brings the ritual of sweetness back to life — mindfully made.",
    image:
      "https://cdn.awakynn.com/festiq.avif",
    href: "https://festiq.com",
  },
  {
    name: "Estra Ritual",
    tagline: "Your Skin, Restored",
    category: "Skin Care",
    description:
      "A skincare line rooted in ritual. Ingredients that honour your skin the way Ayurveda has honoured the body for centuries.",
    image:
      "https://cdn.awakynn.com/estra_ritual.avif",
    href: "https://estraritual.com",
  },
];

export default function SisterBrandsSection() {
  const header = useInView(0.2);

  return (
    <section
      className="py-28 px-6 md:px-12"
      style={{ backgroundColor: "var(--ss)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          ref={header.ref}
          className="mb-16"
          style={{
            opacity: header.inView ? 1 : 0,
            transform: header.inView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <h2
            className="font-heading font-medium text-4xl md:text-6xl"
            style={{ color: "var(--st)" }}
          >
            Sister Brands
          </h2>
        </div>

        {/* Brand cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {brands.map(({ name, tagline, category, description, image, href }, i) => {
            const card = useInView<HTMLAnchorElement>(0.1);
            return (
              <a
                key={name}
                ref={card.ref}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl overflow-hidden border flex flex-col no-underline"
                style={{
                  backgroundColor: "var(--sb)",
                  borderColor: "var(--sbr)",
                  opacity: card.inView ? 1 : 0,
                  transform: card.inView ? "translateY(0)" : "translateY(50px)",
                  transition: `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`,
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute top-4 left-4 text-xs font-semibold tracking-[0.18em] uppercase px-3 py-1 rounded-full"
                    style={{ backgroundColor: "var(--sb)", color: "var(--sa)" }}
                  >
                    {category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 flex flex-col gap-3 flex-1">
                  <div>
                    <h3
                      className="font-heading font-medium text-2xl leading-tight"
                      style={{ color: "var(--st)" }}
                    >
                      {name}
                    </h3>
                    <p
                      className="font-heading italic text-sm mt-0.5"
                      style={{ color: "var(--sp)" }}
                    >
                      {tagline}
                    </p>
                  </div>
                  <p
                    className="text-sm font-light leading-relaxed flex-1"
                    style={{ color: "var(--st2)" }}
                  >
                    {description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className="text-xs font-semibold tracking-widest uppercase"
                      style={{ color: "var(--sp)" }}
                    >
                      Visit
                    </span>
                    <div
                      className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:rotate-45"
                      style={{ borderColor: "var(--sbr)" }}
                    >
                      <ArrowUpRight size={15} style={{ color: "var(--sp)" }} />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <p
          className="text-center text-xs font-light mt-10 tracking-wide"
          style={{ color: "var(--st2)" }}
        >
          Each brand is independently operated and shares the Awakynn philosophy of conscious living.
        </p>
      </div>
    </section>
  );
}