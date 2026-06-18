"use client";

import { useRef, useState } from "react";
import { useInView } from "./useInView";

const stats = [
  { value: "5+", label: "Years of Practice" },
  { value: "200+", label: "Lives Transformed" },
  { value: "4", label: "Wellness Disciplines" },
  { value: "∞", label: "Ongoing Journey" },
];

const values = [
  {
    symbol: "✦",
    title: "Not an Institution",
    body: "Awakynn is a wellness brand, not a gym or academic body. A living community of practice — warm, human, and non-intimidating.",
  },
  {
    symbol: "◎",
    title: "Structured yet Approachable",
    body: "Every programme is thoughtfully structured while remaining completely accessible — no prior experience needed, any age welcome.",
  },
  {
    symbol: "∿",
    title: "Ancient Roots, Modern Life",
    body: "Rooted in millennia-old Yogic and Ayurvedic tradition, translated into practical, everyday habits for 21st-century living.",
  },
  {
    symbol: "◈",
    title: "Consistency as the Practice",
    body: "We don't sell motivation. We build systems of discipline so embedded in your life that showing up becomes automatic and joyful.",
  },
];

export default function AboutSection() {
  const header = useInView(0.15);
  const imageRef = useInView(0.1);
  const statsRef = useInView(0.1);

  return (
    <section
      id="about"
      className="overflow-hidden"
      style={{ backgroundColor: "var(--sb)" }}
    >
      {/* Full-bleed image band */}
      <div
        ref={imageRef.ref}
        className="relative h-[55vh] md:h-[70vh] overflow-hidden"
        style={{
          opacity: imageRef.inView ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      >
        <img
          src="https://cdn.awakynn.com/about_bg.avif"
          alt="Yoga practice"
          className="w-full h-full object-cover"
          style={{
            transform: imageRef.inView ? "scale(1)" : "scale(1.08)",
            transition: "transform 1.4s ease",
          }}
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.55))",
          }}
        >
          <h2 className="font-heading font-medium text-4xl md:text-6xl lg:text-7xl text-white leading-tight max-w-4xl">
            More Than a Wellness Brand —{" "}
            <span className="italic">A Way of Being</span>
          </h2>
        </div>
      </div>

      {/* Stats bar */}
      <div
        ref={statsRef.ref}
        className="border-b grid grid-cols-2 md:grid-cols-4 divide-x"
        style={{ borderColor: "var(--sbr)" }}
      >
        {stats.map(({ value, label }, i) => (
          <div
            key={label}
            className="py-10 px-8 text-center"
            style={{
              opacity: statsRef.inView ? 1 : 0,
              transform: statsRef.inView ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
              borderColor: "var(--sbr)",
            }}
          >
            <p
              className="font-heading text-4xl md:text-5xl font-semibold"
              style={{ color: "var(--sp)" }}
            >
              {value}
            </p>
            <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "var(--st2)" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left – text */}
          <div
            ref={header.ref}
            style={{
              opacity: header.inView ? 1 : 0,
              transform: header.inView ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity 0.9s ease, transform 0.9s ease",
            }}
          >
            <p
              className="text-base font-light leading-relaxed mb-6"
              style={{ color: "var(--st2)" }}
            >
              Awakynn was born from a simple yet radical belief: that every
              person already carries within them everything they need to live
              a life of profound health, peace, and purpose. Our role is only
              to help you remember.
            </p>
            <p
              className="text-base font-light leading-relaxed mb-10"
              style={{ color: "var(--st2)" }}
            >
              Through Yoga, breath, sound, diet, and honest conversation, we
              guide you back — past the pretence, past the fear — to a version
              of yourself that is grounded, clear, and free.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 group"
              style={{ color: "var(--sp)" }}
            >
              Begin your journey
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          {/* Right – values */}
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map(({ symbol, title, body }, i) => {
              const card = useInView(0.1);
              return (
                <div
                  key={title}
                  ref={card.ref}
                  className="rounded-2xl p-6 border"
                  style={{
                    backgroundColor: "var(--ss)",
                    borderColor: "var(--sbr)",
                    opacity: card.inView ? 1 : 0,
                    transform: card.inView ? "translateY(0)" : "translateY(30px)",
                    transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
                  }}
                >
                  <div
                    className="text-2xl mb-3 font-heading"
                    style={{ color: "var(--sp)" }}
                  >
                    {symbol}
                  </div>
                  <h4
                    className="font-heading font-medium text-lg mb-2"
                    style={{ color: "var(--st)" }}
                  >
                    {title}
                  </h4>
                  <p
                    className="text-sm font-light leading-relaxed"
                    style={{ color: "var(--st2)" }}
                  >
                    {body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
