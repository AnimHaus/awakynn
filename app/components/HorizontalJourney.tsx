"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { chapters } from "../lib/data";

export default function HorizontalJourney() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(chapters.length - 1) * 100}vw`]
  );

  return (
    <>
      {/* Mobile: vertical stacked chapters — sticky overlap on scroll */}
      <div id="journey" className="md:hidden">
        {chapters.map((c, i) => (
          <MobileChapter key={c.id} chapter={c} index={i} total={chapters.length} />
        ))}
      </div>

      {/* Desktop: horizontal sticky scroll */}
      <section
        ref={ref}
        style={{ height: `${chapters.length * 100}vh` }}
        className="relative hidden md:block"
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div style={{ x }} className="flex h-full">
            {chapters.map((c, i) => (
              <Chapter key={c.id} chapter={c} index={i} progress={scrollYProgress} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

function Chapter({
  chapter,
  index,
  progress,
}: {
  chapter: (typeof chapters)[number];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const last = chapters.length - 1;
  const center = last === 0 ? 0 : index / last;
  const w = 0.5 / Math.max(last, 1);
  const isFirst = index === 0;
  const isLast = index === last;

  const lightBg = isLightColor(chapter.bg);
  const eyebrowOpacity = lightBg ? 0.85 : 0.65;
  const bodyOpacity = lightBg ? 0.92 : 0.8;
  const ruleOpacity = lightBg ? 0.7 : 0.45;
  const indexOpacity = lightBg ? 0.12 : 0.07;

  const fade = useTransform(
    progress,
    isFirst
      ? [0, w * 0.85, w]
      : isLast
        ? [center - w, center - w * 0.85, 1]
        : [center - w, center - w * 0.85, center + w * 0.85, center + w],
    isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const rise = useTransform(
    progress,
    isFirst ? [0, w] : isLast ? [center - w, 1] : [center - w, center, center + w],
    isFirst ? [0, -60] : isLast ? [60, 0] : [60, 0, -60]
  );
  const numX = useTransform(
    progress,
    isFirst ? [0, w] : isLast ? [center - w, 1] : [center - w, center + w],
    isFirst ? [0, -100] : isLast ? [100, 0] : [100, -100]
  );

  return (
    <article
      className="grain relative flex h-screen w-screen shrink-0 items-center overflow-hidden"
      style={{ background: chapter.bg, color: chapter.fg }}
    >
      {/* Atmospheric chapter image */}
      <img
        src={chapter.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(100deg, ${chapter.bg} 38%, color-mix(in srgb, ${chapter.bg} 55%, transparent) 100%)`,
        }}
      />

      {/* Giant parallax index */}
      <motion.span
        style={{ x: numX, opacity: indexOpacity }}
        className="font-display pointer-events-none absolute right-[-2%] top-1/2 -translate-y-1/2 text-[42vw] font-light leading-none md:text-[34vw]"
      >
        {chapter.index}
      </motion.span>

      <motion.div
        style={{ opacity: fade, y: rise }}
        className="relative z-10 mx-auto grid w-full max-w-[1500px] gap-10 px-6 md:grid-cols-12 md:px-10"
      >
        <div className="md:col-span-7 md:col-start-1">
          <span
            className="eyebrow"
            style={{ color: chapter.fg, opacity: eyebrowOpacity }}
          >
            {chapter.index} — {chapter.kicker}
          </span>

          <h3 className="font-display mt-5 max-w-[14ch] text-5xl font-light leading-[0.92] md:text-8xl">
            {chapter.title}
          </h3>
        </div>

        <div className="self-end md:col-span-4 md:col-start-9 md:pb-4">
          <p
            className="max-w-sm text-base leading-relaxed"
            style={{ opacity: bodyOpacity }}
          >
            {chapter.body}
          </p>
          <div className="mt-8 flex items-center gap-3">
            <span
              className="h-px w-12"
              style={{ background: chapter.fg, opacity: ruleOpacity }}
            />
            <span className="text-sm font-medium tracking-[0.12em]">
              {chapter.brand}
            </span>
          </div>
        </div>
      </motion.div>
    </article>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  // Perceived luminance
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function MobileChapter({
  chapter,
  index,
  total,
}: {
  chapter: (typeof chapters)[number];
  index: number;
  total: number;
}) {
  const lightBg = isLightColor(chapter.bg);
  return (
    <article
      className="grain relative flex h-screen items-center overflow-hidden"
      style={{
        background: chapter.bg,
        color: chapter.fg,
        position: "sticky",
        top: 0,
        zIndex: index + 1,
        /* clip so overlapping section hides the one behind it cleanly */
        clipPath: "inset(0)",
      }}
    >
      <img
        src={chapter.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${chapter.bg} 38%, color-mix(in srgb, ${chapter.bg} 55%, transparent) 100%)`,
        }}
      />
      <div className="relative z-10 w-full px-6 py-24">
        <span
          className="eyebrow"
          style={{ color: chapter.fg, opacity: lightBg ? 0.85 : 0.65 }}
        >
          {chapter.index} — {chapter.kicker}
        </span>
        <h3 className="font-display mt-5 text-5xl font-light leading-[0.92]">
          {chapter.title}
        </h3>
        <p
          className="mt-6 max-w-sm text-base leading-relaxed"
          style={{ opacity: lightBg ? 0.92 : 0.8 }}
        >
          {chapter.body}
        </p>
        <div className="mt-8 flex items-center gap-3">
          <span
            className="h-px w-12"
            style={{ background: chapter.fg, opacity: lightBg ? 0.7 : 0.45 }}
          />
          <span className="text-sm font-medium tracking-[0.12em]">{chapter.brand}</span>
        </div>
      </div>
    </article>
  );
}
