"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSeasonContext } from "./SeasonProvider";
import TransitionLink from "./TransitionLink";

const SLIDES = [
  {
    img: "https://cdn.awakynn.com/offer_yoga.avif",
    caption: "Asana & breath, woven as one.",
    objectPosition: "center 30%",
  },
  {
    img: "https://cdn.awakynn.com/hero3.jpeg",
    caption: "Nourishment rooted in Ayurveda.",
  },
  {
    img: "https://cdn.awakynn.com/hero2.jpeg",
    caption: "Stillness as the deepest practice.",
  },
  {
    img: "https://cdn.awakynn.com/hero1.jpeg",
    caption: "Your practice, your pace.",
    objectPosition: "center 10%",
  },
];

const SLIDE_DURATION = 4000; // ms

export default function Hero() {
  const { setHeroVideoActive } = useSeasonContext();
  const [isLoaded, setIsLoaded] = useState(false);

  // Thumbnail slider state
  const [activeSlide, setActiveSlide] = useState(0);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const loaderRaf = useRef<number | null>(null);
  const slideStart = useRef<number>(0);

  const advanceSlide = useCallback(() => {
    setActiveSlide((s) => (s + 1) % SLIDES.length);
  }, []);

  // Animate loader bar — single RAF loop, restarts when activeSlide changes
  useEffect(() => {
    const start = performance.now();
    setLoaderProgress(0);

    const tick = (now: number) => {
      const pct = Math.min((now - start) / SLIDE_DURATION, 1);
      setLoaderProgress(pct);
      if (pct < 1) {
        loaderRaf.current = requestAnimationFrame(tick);
      } else {
        advanceSlide();
      }
    };

    loaderRaf.current = requestAnimationFrame(tick);
    return () => {
      if (loaderRaf.current !== null) {
        cancelAnimationFrame(loaderRaf.current);
        loaderRaf.current = null;
      }
    };
  }, [activeSlide, advanceSlide]);

  useEffect(() => {
    setIsLoaded(true);
    setHeroVideoActive(false);
  }, [setHeroVideoActive]);

  return (
    <section
      className="relative h-screen overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* ── Background: active slide image ─────────────────────── */}
      {SLIDES.map((s, i) => (
        <img
          key={i}
          src={s.img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === activeSlide ? 0.78 : 0, objectPosition: s.objectPosition ?? "center" }}
        />
      ))}

      {/* Gradient overlay — stronger at bottom for mobile readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* ── All content ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-14 px-6 md:px-14"
        style={{
          zIndex: 10,
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.9s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="flex items-end justify-between gap-6">

          {/* ── Left: heading + CTAs ──────────────────────────── */}
          <div className="flex flex-col gap-6 md:gap-7 min-w-0">
            <h1
              className="font-heading text-white leading-[1.08]"
              style={{
                fontSize: "clamp(1.85rem, 5.5vw, 3rem)",
                fontWeight: 400,
                textShadow: "0 2px 24px rgba(0,0,0,0.45)",
                maxWidth: "42rem",
              }}
            >
              A practice designed to{" "}
              <span className="italic font-light">awaken the body,</span>{" "}
              and <span className="italic font-light">still the mind</span>
            </h1>

            {/* CTA buttons — stack on mobile, side-by-side on sm+ */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <TransitionLink
                href="/classes"
                className="group flex items-center justify-between gap-6 sm:gap-8 px-5 sm:px-6 py-3.5 sm:py-4 border border-white/80 text-white text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white hover:text-black"
              >
                View Classes
                <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
              </TransitionLink>
              <a
                href="#offerings"
                className="group flex items-center justify-between gap-6 sm:gap-8 px-5 sm:px-6 py-3.5 sm:py-4 border border-white/50 text-white/80 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:border-white/80 hover:text-white"
              >
                Explore Offerings
                <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
              </a>
            </div>

            {/* Mobile slide progress dots */}
            <div className="flex items-center gap-2 md:hidden">
              {SLIDES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  aria-label={s.caption}
                  className="focus:outline-none"
                >
                  <span
                    className="block h-px transition-all duration-300"
                    style={{
                      width: i === activeSlide ? 28 : 12,
                      background: i === activeSlide ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: thumbnail strip + loader ────────────────── */}
          <div className="hidden md:flex flex-col gap-3 items-end shrink-0">
            {/* Caption + featured preview */}
            <div className="flex items-end gap-4">
              <p
                className="text-white/75 text-sm leading-relaxed font-light text-right max-w-[180px]"
                style={{ fontStyle: "italic" }}
              >
                {SLIDES[activeSlide].caption}
              </p>
              <div className="relative overflow-hidden shrink-0" style={{ width: 140, height: 96 }}>
                {SLIDES.map((s, i) => (
                  <img
                    key={i}
                    src={s.img}
                    alt={s.caption}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                    style={{ opacity: i === activeSlide ? 1 : 0, objectPosition: s.objectPosition ?? "center" }}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail row */}
            <div className="flex gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className="relative overflow-hidden shrink-0 focus:outline-none"
                  style={{
                    width: 76,
                    height: 50,
                    opacity: i === activeSlide ? 1 : 0.5,
                    transition: "opacity 0.3s ease",
                  }}
                  aria-label={s.caption}
                >
                  <img src={s.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  {i === activeSlide && (
                    <span className="absolute inset-0 border border-white/70 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>

            {/* Progress loader bar */}
            <div className="w-full h-px bg-white/25 relative">
              <span
                className="absolute left-0 top-0 h-full bg-white"
                style={{ width: `${loaderProgress * 100}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}