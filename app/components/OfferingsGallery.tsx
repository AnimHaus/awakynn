"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { offerings } from "../lib/data";
import BookingModal from "./BookingModal";

/** These offerings open the booking modal; all others navigate to the register page. */
const MODAL_SLUGS = new Set(["sunday-workshop", "ayurvedic-diet-consulting", "clarity-session"]);

const ease = [0.22, 1, 0.36, 1] as const;

/** Gallery-style scatter — varied positions, never a grid. */
const placement = [
  "left-[4%] top-[1%] w-[44%] md:w-[20%]",
  "right-[6%] top-[2%] w-[42%] md:right-[28%] md:w-[18%]",
  "left-[18%] top-[40%] w-[46%] md:left-[26%] md:top-[34%] md:w-[19%]",
  "right-[4%] top-[24%] w-[44%] md:right-[8%] md:top-[32%] md:w-[20%]",
  "left-[6%] top-[72%] w-[44%] md:left-[14%] md:top-[64%] md:w-[18%]",
  "right-[14%] top-[76%] w-[42%] md:right-[28%] md:top-[68%] md:w-[19%]",
];

export default function OfferingsGallery() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bookingOffering, setBookingOffering] = useState<(typeof offerings)[number] | null>(null);

  function handleOfferingClick(item: (typeof offerings)[number]) {
    if (MODAL_SLUGS.has(item.slug)) {
      setBookingOffering(item);
    } else {
      router.push(`/register?service=${item.slug}`);
    }
  }

  return (
    <>
      <section
        id="offerings"
        ref={ref}
        className="relative bg-background py-32 md:min-h-[160vh]"
      >

        <div className="relative z-10 mx-auto mb-16 max-w-[1500px] px-6 md:px-10">
          <p className="font-display mt-4 max-w-xl text-3xl font-light leading-tight text-forest md:text-4xl">
            Each offering is a doorway — a small ceremony, an act of becoming.
          </p>
        </div>

        {/* Mobile: 2-col grid */}
        <div className="md:hidden grid grid-cols-2 gap-4 px-6 pb-8 [&:has(*:hover)>*:not(:hover)]:opacity-40 [&:has(*:hover)>*:not(:hover)]:blur-[2px] [&:has(*:hover)>*:not(:hover)]:scale-[0.97] [&>*]:transition-[opacity,filter,transform] [&>*]:duration-400">
          {offerings.map((item, i) => (
            <button
              key={item.name}
              onClick={() => handleOfferingClick(item)}
              className="relative aspect-[3/4] overflow-hidden rounded-xl text-left"
              style={{ background: tile(i) }}
            >
              <img src={item.image} alt={item.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              <div className="absolute bottom-0 p-3">
                <div className="flex items-end justify-between gap-1">
                  <h3 className="font-display text-sm font-light leading-tight text-white">{item.name}</h3>
                  <span className="shrink-0 text-sm font-semibold text-gold">{item.price}</span>
                </div>
                <p className="text-[0.62rem] tracking-[0.1em] text-white/60">{item.note}</p>
              </div>
              {/* Book CTA */}
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-background/90 text-forest text-[0.6rem] tracking-widest uppercase font-medium rounded-full px-3 py-1 transition-opacity duration-300">
                Book
              </span>
            </button>
          ))}
        </div>

        {/* Desktop: floating parallax gallery */}
        <div className="hidden md:block relative mx-auto h-[120vh] max-w-[1500px] px-6 md:px-10">
          {offerings.map((item, i) => (
            <FloatingOffering
              key={item.name}
              offering={item}
              index={i}
              progress={scrollYProgress}
              dimmed={hoveredIndex !== null && hoveredIndex !== i}
              onHover={(v) => setHoveredIndex(v ? i : null)}
              onBook={() => handleOfferingClick(item)}
            />
          ))}
        </div>
      </section>

      {bookingOffering && (
        <BookingModal
          offering={bookingOffering}
          onClose={() => setBookingOffering(null)}
        />
      )}
    </>
  );
}

function FloatingOffering({
  offering,
  index,
  progress,
  dimmed,
  onHover,
  onBook,
}: {
  offering: (typeof offerings)[number];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  dimmed: boolean;
  onHover: (hovered: boolean) => void;
  onBook: () => void;
}) {
  const depth = offering.depth;
  const depthScale = 0.82 + depth * 0.12;

  const yShift = useTransform(progress, [0, 1], [80 + depth * 60, -80 - depth * 60]);

  return (
    <motion.div
      style={{
        y: yShift,
        zIndex: dimmed ? 5 : 10 + depth,
        scale: depthScale,
        filter: dimmed
          ? "blur(2px) brightness(0.85)"
          : depth === 0 ? "blur(0.4px)" : "none",
        opacity: dimmed ? 0.35 : 1,
        transition: "opacity 0.4s ease, filter 0.4s ease",
      }}
      className={`group absolute ${placement[index]}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease, delay: index * 0.08 }}
        className="cursor-pointer"
        onClick={onBook}
      >
        {/* Offering image */}
        <div
          className="grain relative aspect-[3/4] overflow-hidden rounded-2xl border border-charcoal/8 shadow-[0_30px_60px_-30px_rgba(34,34,34,0.4)]"
          style={{ background: tile(index) }}
        >
          <img
            src={offering.image}
            alt={offering.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent" />

          {/* Top tag */}
          <span className="absolute left-3 top-3 rounded-full bg-background/15 px-2.5 py-0.5 text-[0.6rem] tracking-[0.14em] text-white/80 backdrop-blur-sm">
            {offering.note}
          </span>

          {/* Book CTA — revealed on hover */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-background/90 text-forest text-[0.65rem] tracking-[0.18em] uppercase font-medium rounded-full px-4 py-1.5 transition-opacity duration-300 whitespace-nowrap">
            Book Now
          </span>

          {/* Bottom details */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between gap-2">
              <h3 className="font-display text-base font-normal leading-tight text-white">
                {offering.name}
              </h3>
              <span className="shrink-0 text-sm font-semibold text-gold">
                {offering.price}
              </span>
            </div>
            <p className="mt-1 text-[0.6rem] tracking-[0.14em] text-white/50">
              {offering.house}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function tile(i: number) {
  const palettes = [
    "linear-gradient(160deg,#2F4F46,#1c322c)",
    "linear-gradient(160deg,#C8A86B,#a8884d)",
    "linear-gradient(160deg,#F4EFE8,#e3d9c9)",
    "linear-gradient(160deg,#3B312B,#3a3a3a)",
    "linear-gradient(160deg,#2F4F46,#3f6258)",
    "linear-gradient(160deg,#C8A86B,#dcc290)",
  ];
  return palettes[i % palettes.length];
}
