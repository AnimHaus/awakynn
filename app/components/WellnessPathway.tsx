"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { pathway } from "../lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

const PATH =
  "M 200 40 C 60 160, 60 260, 200 360 S 340 560, 200 660 S 60 860, 200 960";

const anchors = [
  { x: 200, y: 40, side: "right" },
  { x: 200, y: 360, side: "left" },
  { x: 200, y: 660, side: "right" },
  { x: 200, y: 960, side: "left" },
] as const;

export default function WellnessPathway() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });

  const draw = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  return (
    <section
      id="pathway"
      ref={ref}
      className="grain relative overflow-hidden bg-forest py-32 text-background"
    >
      {/* Header — asymmetric */}
      <div className="mx-auto mb-20 max-w-[1500px] px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="font-display mt-4 max-w-3xl text-5xl font-light leading-[0.95] md:text-7xl"
        >
          Your wellness, as a
          <span className="italic text-gold"> flowing path.</span>
        </motion.h2>
      </div>

      <div className="relative mx-auto max-w-3xl px-6">

        {/* ── Mobile: vertical timeline ──────────────────────────── */}
        <div className="md:hidden flex flex-col gap-0">
          {pathway.map((stop, i) => (
            <motion.div
              key={stop.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease, delay: i * 0.1 }}
              className="relative flex gap-5 pb-10"
            >
              {/* Left: line + dot */}
              <div className="flex flex-col items-center">
                <span
                  className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-forest"
                  style={{ background: "#C8A86B" }}
                />
                {i < pathway.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-background/20" />
                )}
              </div>

              {/* Right: content */}
              <div className="flex-1 min-w-0">
                <div className="mb-3 h-36 w-full overflow-hidden rounded-xl border border-background/15">
                  <img
                    src={stop.image}
                    alt={stop.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-display text-xl text-gold">{stop.time}</span>
                <h3 className="font-display mt-0.5 text-xl font-light leading-tight">
                  {stop.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-background/65">
                  {stop.note}
                </p>
                <span className="mt-1.5 inline-block text-[0.65rem] font-medium tracking-[0.18em] text-background/45">
                  {stop.brand.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Desktop: SVG winding path ──────────────────────────── */}
        <div className="hidden md:block">
        {/* The curve */}
        <svg
          viewBox="0 0 400 1000"
          preserveAspectRatio="xMidYMid meet"
          className="absolute left-1/2 top-0 h-full w-[min(90vw,640px)] -translate-x-1/2"
          aria-hidden
        >
          {/* Ghost path */}
          <path
            d={PATH}
            fill="none"
            stroke="rgba(250,248,245,0.12)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Drawn path */}
          <motion.path
            d={PATH}
            fill="none"
            stroke="url(#pathGradAwakynn)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ pathLength: draw }}
          />
          <defs>
            <linearGradient id="pathGradAwakynn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8A86B" />
              <stop offset="100%" stopColor="#F4EFE8" />
            </linearGradient>
          </defs>

          {/* Node dots on the curve */}
          {anchors.map((a, i) => (
            <motion.circle
              key={i}
              cx={a.x}
              cy={a.y}
              r="7"
              fill="#C8A86B"
              stroke="#2F4F46"
              strokeWidth="3"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.6, ease, delay: 0.2 + i * 0.15 }}
              style={{ transformOrigin: `${a.x}px ${a.y}px` }}
            />
          ))}
        </svg>

        {/* Stop cards — alternating sides, anchored to curve heights */}
        <div className="relative" style={{ aspectRatio: "400 / 1000" }}>
          {pathway.map((stop, i) => {
            const a = anchors[i];
            const top = `${(a.y / 1000) * 100}%`;
            const isRight = a.side === "right";
            return (
              <motion.div
                key={stop.title}
                initial={{ opacity: 0, x: isRight ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.9, ease, delay: 0.15 }}
                className={`absolute w-[min(74vw,300px)] -translate-y-1/2 ${
                  isRight
                    ? "left-1/2 ml-6 md:ml-16 text-left"
                    : "right-1/2 mr-6 md:mr-16 text-right"
                }`}
                style={{ top }}
              >
                <div
                  className={`mb-3 h-28 w-40 overflow-hidden rounded-[1rem] border border-background/15 ${
                    isRight ? "" : "ml-auto"
                  }`}
                >
                  <img
                    src={stop.image}
                    alt={stop.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-display text-2xl text-gold">{stop.time}</span>
                <h3 className="font-display mt-1 text-2xl font-light leading-tight md:text-3xl">
                  {stop.title}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed text-background/65 ${
                    isRight ? "" : "ml-auto"
                  } max-w-[28ch]`}
                >
                  {stop.note}
                </p>
                <span className="mt-2 inline-block text-[0.7rem] font-medium tracking-[0.18em] text-background/45">
                  {stop.brand.toUpperCase()}
                </span>
              </motion.div>
            );
          })}
        </div>
        </div>

      </div>

      {/* ── Eligibility disclaimer ────────────────────────────────── */}
      <div
        className="mx-auto mt-20 max-w-[1500px] px-6 md:px-10"
      >
        <div
          className="flex flex-col gap-4 border border-background/15 p-6 md:flex-row md:items-start md:gap-8 md:p-8"
        >
          <span className="eyebrow shrink-0 text-gold">Please note</span>
          <p className="text-sm leading-[1.75]" style={{ color: "rgba(250,248,245,0.6)" }}>
            Our programs are designed for able-bodied individuals in good general health.
            They are <strong style={{ color: "rgba(250,248,245,0.85)", fontWeight: 500 }}>not suitable</strong> for
            immobile patients, or persons who are deaf, non-verbal, currently pregnant,
            or within the immediate post-pregnancy or post-physical-rehabilitation period.
            If you are recovering from an injury, surgery, or a medical condition, please
            consult your physician before joining. Our doctors and instructors are happy to
            advise on the right time to begin your practice.
          </p>
        </div>
      </div>

    </section>
  );
}
