"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { pathway } from "../lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

// Path control points in a 400×1000 viewBox
const PATH_D =
  "M 200 40 C 60 160, 60 260, 200 360 S 340 560, 200 660 S 60 860, 200 960";

const anchors = [
  { x: 200, y: 40, side: "right" },
  { x: 200, y: 360, side: "left" },
  { x: 200, y: 660, side: "right" },
  { x: 200, y: 960, side: "left" },
] as const;

// Build a Path2D once from the SVG path string
function buildPath(): Path2D {
  return new Path2D(PATH_D);
}

// Get total length of the path by sampling (Path2D has no getTotalLength)
// We approximate via a hidden SVGPathElement
function getSVGLength(): number {
  if (typeof document === "undefined") return 1000;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg") as SVGSVGElement;
  const p = document.createElementNS(ns, "path") as SVGPathElement;
  p.setAttribute("d", PATH_D);
  svg.appendChild(p);
  document.body.appendChild(svg);
  const len = p.getTotalLength();
  document.body.removeChild(svg);
  return len;
}

function PathCanvas({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const totalLenRef = useRef<number>(0);

  useEffect(() => {
    totalLenRef.current = getSVGLength();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // DPR-aware sizing
    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      // Scale canvas coords to match 400×1000 viewBox
      const sx = canvas.width / 400;
      const sy = canvas.height / 1000;
      ctx!.scale(sx, sy);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Scroll → update progressRef (no React state, no re-render)
    function onScroll() {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const wh = window.innerHeight;
      // progress 0→1 as section scrolls from 120% into view to 40% out
      const raw = (wh * 0.1 - rect.top) / (rect.height - wh * 0.9);
      progressRef.current = Math.min(1, Math.max(0, raw));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const path = buildPath();

    function draw() {
      if (!canvas || !ctx) return;
      ctx.save();
      // clear in viewBox space (400×1000)
      ctx.clearRect(0, 0, 400, 1000);

      const p = progressRef.current;
      const len = totalLenRef.current;

      // Ghost path
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(250,248,245,0.12)";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.stroke(path);

      // Drawn portion using clip trick: draw full path but clipped to a rect
      // that grows from top as progress increases
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 400, p * 1000);
      ctx.clip();
      // Gold-to-cream gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 1000);
      grad.addColorStop(0, "#C8A86B");
      grad.addColorStop(1, "#F4EFE8");
      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke(path);
      ctx.restore();

      // Node dots
      anchors.forEach((a) => {
        const dotProgress = a.y / 1000;
        if (p < dotProgress - 0.02) return;
        const scale = Math.min(1, (p - dotProgress + 0.02) / 0.05);
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.scale(scale, scale);
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#C8A86B";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#2F4F46";
        ctx.stroke();
        ctx.restore();
      });

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-1/2 top-0 h-full w-[min(90vw,640px)] -translate-x-1/2"
      aria-hidden
    />
  );
}

export default function WellnessPathway() {
  const ref = useRef<HTMLElement>(null);

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

        {/* ── Desktop: Canvas winding path ──────────────────────── */}
        <div className="hidden md:block">
        {/* Canvas replaces the SVG — drawn via RAF, zero React renders on scroll */}
        <PathCanvas sectionRef={ref} />

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
                    ? "left-1/2 ml-6 md:ml-24 text-left"
                    : "right-1/2 mr-6 md:mr-24 text-right"
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
