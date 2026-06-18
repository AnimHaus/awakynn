"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useInView } from "./useInView";

const OFFERINGS = [
  { value: "yoga",      label: "Yoga Classes",              sub: "₹1,200 / mo"    },
  { value: "breathing", label: "Breathing & Meditation",    sub: "₹1,200 / mo"    },
  { value: "diet",      label: "Ayurvedic Diet Consulting", sub: "₹600"           },
  { value: "clarity",   label: "1-on-1 Clarity Session",    sub: "₹600 · 40 min"  },
  { value: "workshop",  label: "Sunday Workshop",           sub: "₹49"            },
  { value: "unsure",    label: "Not sure yet",              sub: ""               },
];

function OfferingSelect() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<typeof OFFERINGS[number] | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 rounded-xl border text-sm text-left flex items-center justify-between gap-2 transition-colors"
        style={{
          borderColor: open ? "rgba(245,239,227,0.45)" : "rgba(245,239,227,0.2)",
          backgroundColor: "rgba(245,239,227,0.08)",
          color: selected ? "#f5efe3" : "rgba(245,239,227,0.35)",
        }}
      >
        <span>{selected ? selected.label : "Choose an offering"}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: "rgba(245,239,227,0.5)" }}
        >
          <path d="M2 4l4 4 4-4" />
        </motion.svg>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border overflow-hidden"
            style={{
              transformOrigin: "top",
              backgroundColor: "rgba(18,12,7,0.96)",
              borderColor: "rgba(245,239,227,0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            } as React.CSSProperties}
            role="listbox"
          >
            {OFFERINGS.map((opt, i) => {
              const isSelected = selected?.value === opt.value;
              return (
                <motion.li
                  key={opt.value}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.15 }}
                  onClick={() => { setSelected(opt); setOpen(false); }}
                  role="option"
                  aria-selected={isSelected}
                  className="flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors group"
                  style={{
                    backgroundColor: isSelected ? "rgba(245,239,227,0.07)" : "transparent",
                    borderBottom: i < OFFERINGS.length - 1 ? "1px solid rgba(245,239,227,0.06)" : "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(245,239,227,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isSelected ? "rgba(245,239,227,0.07)" : "transparent")}
                >
                  <span className="text-sm" style={{ color: isSelected ? "#f5efe3" : "rgba(245,239,227,0.75)" }}>
                    {opt.label}
                  </span>
                  <span className="text-xs font-medium ml-3 shrink-0" style={{ color: "var(--sp)", opacity: opt.sub ? 1 : 0 }}>
                    {opt.sub}
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CTASection() {
  const header = useInView(0.15);
  const form = useInView(0.1);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Image moves slower than scroll → parallax depth
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-28 px-6 md:px-12 overflow-hidden"
      style={{ backgroundColor: "var(--ss)" }}
    >
      {/* Parallax background image */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-[124%] -top-[12%] pointer-events-none"
      >
        <img
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Dark overlay so text stays readable */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(20,14,8,0.72) 0%, rgba(20,14,8,0.65) 50%, rgba(20,14,8,0.78) 100%)" }}
        />
      </motion.div>

      {/* Content sits above the bg */}
      <div className="relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          ref={header.ref}
          className="text-center mb-16"
          style={{
            opacity: header.inView ? 1 : 0,
            transform: header.inView ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          <div className="ornament max-w-xs mx-auto mb-10">
            <span className="font-heading text-lg" style={{ color: "var(--sp)" }}>
              ✦
            </span>
          </div>

        <h2
          className="font-heading font-medium text-4xl sm:text-5xl md:text-6xl leading-tight mb-6"
          style={{ color: "#f5efe3" }}
        >
          Ready to{" "}
          <span className="italic" style={{ color: "var(--sp)" }}>
            Awaken
          </span>
          ?
        </h2>

        <p
          className="text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ color: "rgba(245,239,227,0.75)" }}
        >
          Whether you are brand new to Yoga, looking to deepen an existing
          practice, or simply searching for stillness in a chaotic life —
          there is a place for you here. Let us begin together.
        </p>
        </div>

        {/* Contact form */}
        <div
          ref={form.ref}
          style={{
            opacity: form.inView ? 1 : 0,
            transform: form.inView ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
          }}
        >
        <form
          className="max-w-md mx-auto flex flex-col gap-4 text-left"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium tracking-wide"
                style={{ color: "rgba(245,239,227,0.7)" }}
              >
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-colors focus:ring-2 placeholder:text-[rgba(245,239,227,0.3)] focus:border-[rgba(245,239,227,0.45)]"
                style={{
                  borderColor: "rgba(245,239,227,0.2)",
                  backgroundColor: "rgba(245,239,227,0.08)",
                  color: "#f5efe3",
                }}
                aria-label="Name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium tracking-wide"
                style={{ color: "rgba(245,239,227,0.7)" }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-colors focus:ring-2 placeholder:text-[rgba(245,239,227,0.3)] focus:border-[rgba(245,239,227,0.45)]"
                style={{
                  borderColor: "rgba(245,239,227,0.2)",
                  backgroundColor: "rgba(245,239,227,0.08)",
                  color: "#f5efe3",
                }}
                aria-label="Email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium tracking-wide"
              style={{ color: "rgba(245,239,227,0.7)" }}
            >
              What are you looking for?
            </label>
            <OfferingSelect />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium tracking-wide"
              style={{ color: "rgba(245,239,227,0.7)" }}
            >
              Message (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Anything you'd like us to know…"
              className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-colors resize-none focus:ring-2 placeholder:text-[rgba(245,239,227,0.3)] focus:border-[rgba(245,239,227,0.45)]"
              style={{
                borderColor: "rgba(245,239,227,0.2)",
                backgroundColor: "rgba(245,239,227,0.08)",
                color: "#f5efe3",
              }}
              aria-label="Message"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 mt-2"
            style={{ backgroundColor: "var(--sp)", color: "var(--sb)" }}
          >
            Send Message
          </button>
        </form>
        </div>

        {/* Divider */}
        <div className="ornament max-w-xs mx-auto mt-16 mb-8">
          <span className="text-sm" style={{ color: "rgba(245,239,227,0.6)" }}>or reach us directly</span>
        </div>

        <p
          className="text-sm font-medium"
          style={{ color: "rgba(245,239,227,0.7)" }}
        >
          Email:{" "}
          <a
            href="mailto:hello@awakynn.com"
            className="transition-colors"
            style={{ color: "var(--sp)" }}
          >
            hello@awakynn.com
          </a>
        </p>
      </div>{/* /max-w-4xl */}
      </div>{/* /z-10 */}
    </section>
  );
}
