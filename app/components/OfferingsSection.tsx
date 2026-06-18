"use client";

import { useState, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useInView } from "./useInView";

const services = [
  {
    number: "01",
    title: "Yoga — Asana & Pranayama",
    category: "Movement & Breath",
    price: "₹1,200",
    subtext: "monthly  ·  + ₹200 registration",
    detail: "Online & offline  ·  2 days/week  ·  ~8 classes/month",
    image:
      "https://cdn.awakynn.com/offer_yoga.avif",
  },
  {
    number: "02",
    title: "Breathing & Meditation",
    category: "Inner Stillness",
    price: "₹1,200",
    subtext: "monthly  ·  + ₹200 registration",
    detail: "Every Tuesday & Friday  ·  8:30 – 9:15 PM",
    image:
      "https://cdn.awakynn.com/offer_meditation.avif",
  },
  {
    number: "03",
    title: "Ayurvedic Diet Consulting",
    category: "Nourishment",
    price: "₹600",
    subtext: "per consultation",
    detail: "Personalised dietary guidance rooted in Ayurvedic principles",
    image:
      "https://cdn.awakynn.com/offer_diet.avif",
  },
  {
    number: "04",
    title: "1-on-1 Clarity Session",
    category: "Personal Growth",
    price: "₹600",
    subtext: "per 40-min session",
    detail: "Anxiety  ·  Emotional detox  ·  Spiritual support",
    image:
      "https://cdn.awakynn.com/offer_one_on_one.avif",
  },
  {
    number: "05",
    title: "Sunday Workshop",
    category: "Community Practice",
    price: "₹49",
    subtext: "per session",
    detail: "Every Sunday  ·  10:00 – 11:00 AM",
    image:
      "https://cdn.awakynn.com/offer_workshop.avif",
  },
];

function ServiceRow({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const { ref, inView } = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative grid md:grid-cols-[1fr_auto] items-center gap-6 py-8 border-b cursor-default overflow-hidden"
      style={{
        borderColor: "var(--sbr)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`,
      }}
    >
      {/* Hover fill */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          backgroundColor: "var(--ss)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s ease",
          zIndex: 0,
        }}
      />

      {/* Hover image peek */}
      <div
        className="absolute right-52 top-1/2 -translate-y-1/2 w-36 h-24 rounded-xl overflow-hidden pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered
            ? "translateY(-50%) scale(1)"
            : "translateY(-50%) scale(0.85)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          zIndex: 1,
        }}
      >
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>

      <div className="relative z-10 flex items-center gap-6 pl-2">
        <span
          className="font-heading text-xs tracking-widest select-none"
          style={{ color: "var(--sp)", minWidth: "2rem" }}
        >
          {service.number}
        </span>
        <div>
          <p
            className="text-xs font-medium tracking-[0.2em] uppercase mb-1"
            style={{ color: "var(--st2)" }}
          >
            {service.category}
          </p>
          <h3
            className="font-heading font-medium text-xl md:text-2xl lg:text-3xl"
            style={{ color: "var(--st)" }}
          >
            {service.title}
          </h3>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--st2)" }}
          >
            {service.detail}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-4 pr-2">
        <div className="text-right">
          <p
            className="font-heading text-2xl font-semibold"
            style={{ color: "var(--sp)" }}
          >
            {service.price}
          </p>
          <p className="text-xs" style={{ color: "var(--st2)" }}>
            {service.subtext}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            borderColor: hovered ? "var(--sp)" : "var(--sbr)",
            backgroundColor: hovered ? "var(--sp)" : "transparent",
            transform: hovered ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <ArrowUpRight
            size={16}
            style={{ color: hovered ? "var(--sb)" : "var(--st2)" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function OfferingsSection() {
  const header = useInView(0.2);

  return (
    <section
      id="offerings"
      className="py-28 px-6 md:px-12"
      style={{ backgroundColor: "var(--sb)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          ref={header.ref}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16"
          style={{
            opacity: header.inView ? 1 : 0,
            transform: header.inView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div>
            <h2
              className="font-heading font-medium text-4xl md:text-6xl leading-none"
              style={{ color: "var(--st)" }}
            >
              Practices for
              <br />
              <span className="italic" style={{ color: "var(--sp)" }}>
                the whole self.
              </span>
            </h2>
          </div>
          <p
            className="text-sm font-light max-w-xs leading-relaxed md:text-right"
            style={{ color: "var(--st2)" }}
          >
            Structured, accessible, deeply rooted in tradition — every offering
            meets you exactly where you are.
          </p>
        </div>

        {/* Service rows */}
        <div>
          {services.map((s, i) => (
            <ServiceRow key={s.number} service={s} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="mt-8 text-xs text-center leading-relaxed"
          style={{ color: "var(--st2)" }}
        >
          * Classes available Mon–Sun excluding Monday (full rest day).&nbsp;
          Timings: 8–9 AM · 11 AM–12 PM · 5–6 PM · 6:15–7:15 PM · 7:30–8:30 PM.
          <br />
          Not suitable for immobile patients — pregnant women, physically disabled, or those with movement restrictions.
        </p>
      </div>
    </section>
  );
}
