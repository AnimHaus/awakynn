"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { offerings } from "../lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

/** Gallery-style scatter — varied positions, never a grid. */
const placement = [
  "left-[4%] top-[8%] w-[44%] md:left-[8%] md:w-[20%]",
  "right-[6%] top-[2%] w-[42%] md:right-[14%] md:w-[18%]",
  "left-[18%] top-[40%] w-[46%] md:left-[26%] md:top-[34%] md:w-[19%]",
  "right-[4%] top-[44%] w-[44%] md:right-[8%] md:top-[40%] md:w-[20%]",
  "left-[6%] top-[72%] w-[44%] md:left-[14%] md:top-[64%] md:w-[18%]",
  "right-[14%] top-[76%] w-[42%] md:right-[24%] md:top-[68%] md:w-[19%]",
];

export default function OfferingsGallery() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 20 });
  const smy = useSpring(my, { stiffness: 50, damping: 20 });

  const handleMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      id="offerings"
      ref={ref}
      onPointerMove={handleMove}
      className="relative min-h-[160vh] overflow-hidden bg-background py-32"
    >
      {/* Centered editorial framing text behind cards */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
          className="font-display max-w-[18ch] text-center text-[12vw] font-light leading-[0.85] text-forest/8 md:text-[9rem]"
        >
          The Art of Practice
        </motion.h2>
      </div>

      <div className="relative z-10 mx-auto mb-16 max-w-[1500px] px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="font-display mt-4 max-w-xl text-3xl font-light leading-tight text-forest md:text-4xl"
        >
          Each offering is a doorway — a small ceremony, an act of becoming.
        </motion.p>
      </div>

      <div className="relative mx-auto h-[120vh] max-w-[1500px] px-6 md:px-10">
        {offerings.map((item, i) => (
          <FloatingOffering
            key={item.name}
            offering={item}
            index={i}
            progress={scrollYProgress}
            smx={smx}
            smy={smy}
          />
        ))}
      </div>
    </section>
  );
}

function FloatingOffering({
  offering,
  index,
  progress,
  smx,
  smy,
}: {
  offering: (typeof offerings)[number];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  smx: ReturnType<typeof useSpring>;
  smy: ReturnType<typeof useSpring>;
}) {
  const depth = offering.depth;
  const depthScale = 0.82 + depth * 0.12;

  const yShift = useTransform(progress, [0, 1], [80 + depth * 60, -80 - depth * 60]);
  const px = useTransform(smx, [-0.5, 0.5], [-(depth + 1) * 16, (depth + 1) * 16]);
  const py = useTransform(smy, [-0.5, 0.5], [-(depth + 1) * 12, (depth + 1) * 12]);

  return (
    <motion.div
      style={{
        y: yShift,
        x: px,
        translateY: py,
        zIndex: 10 + depth,
        scale: depthScale,
        filter: depth === 0 ? "blur(0.4px)" : "none",
      }}
      className={`group absolute ${placement[index]}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease, delay: index * 0.08 }}
        whileHover={{ scale: 1.05, rotate: index % 2 ? 1.5 : -1.5 }}
        className="cursor-pointer"
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
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 via-transparent to-transparent" />
          <span className="font-display absolute bottom-4 left-4 text-[2.6rem] leading-none text-background/90">
            {offering.house.charAt(0)}
          </span>
        </div>

        {/* Caption */}
        <div className="mt-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg font-normal leading-tight text-forest">
              {offering.name}
            </h3>
            <span className="text-sm font-medium text-gold">{offering.price}</span>
          </div>
          <p className="text-[0.72rem] tracking-[0.12em] text-charcoal/50">
            {offering.note} · {offering.house}
          </p>
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
