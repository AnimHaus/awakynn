"use client";

import { useEffect, useState } from "react";
import { motion, useInView as useFramerInView, Variants } from "framer-motion";
import { useRef } from "react";

const revealUp: Variants = {
  hidden: { opacity: 0, y: 48, clipPath: "inset(100% 0% 0% 0%)" },
  visible: {
    opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealLeft: Variants = {
  hidden: { opacity: 0, x: -40, clipPath: "inset(0% 100% 0% 0%)" },
  visible: {
    opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const dayCellVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.9, clipPath: "inset(100% 0% 0% 0%)" },
  visible: {
    opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const pillVariant: Variants = {
  hidden: { opacity: 0, y: 16, clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.96, clipPath: "inset(8% 4% 0% 4%)" },
  visible: {
    opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const slots = [
  { time: "8:00 – 9:00 AM",      label: "Morning" },
  { time: "11:00 AM – 12:00 PM", label: "Midday"  },
  { time: "5:00 – 6:00 PM",      label: "Evening" },
  { time: "6:15 – 7:15 PM",      label: "Evening" },
  { time: "7:30 – 8:30 PM",      label: "Night"   },
];

const days = [
  { day: "Mon", active: false, label: "Rest"                },
  { day: "Tue", active: true,  label: "Yoga + Breath & Med" },
  { day: "Wed", active: true,  label: "Yoga"                },
  { day: "Thu", active: true,  label: "Yoga"                },
  { day: "Fri", active: true,  label: "Yoga + Breath & Med" },
  { day: "Sat", active: true,  label: "Yoga"                },
  { day: "Sun", active: true,  label: "Yoga + Workshop"     },
];

const plans = [
  {
    name: "Yoga Classes",
    frequency: "2 days/week · ~8 classes/month",
    price: "₹1,200",
    sub: "/month",
    registration: "+ ₹200 registration",
    included: ["Online & offline options", "Asana & Pranayama", "Morning, evening & night slots", "All experience levels welcome"],
    highlight: true,
  },
  {
    name: "Breathing & Meditation",
    frequency: "Every Tue & Fri · 8:30–9:15 PM",
    price: "₹1,200",
    sub: "/month",
    registration: "+ ₹200 registration",
    included: ["Conscious breathwork", "Guided meditation", "Nervous system reset", "Group practice"],
    highlight: false,
  },
  {
    name: "Diet Consultation",
    frequency: "One-time / per session",
    price: "₹600",
    sub: "/session",
    registration: null,
    included: ["Personalised Ayurvedic plan", "Constitution analysis", "Practical daily guidance", "Follow-up support"],
    highlight: false,
  },
  {
    name: "1-on-1 Clarity Session",
    frequency: "40 minutes per session",
    price: "₹600",
    sub: "/session",
    registration: null,
    included: ["Anxiety & stress support", "Emotional detox", "Private & confidential", "Spiritual companionship"],
    highlight: false,
  },
  {
    name: "Sunday Workshop",
    frequency: "Every Sunday · 10:00–11:00 AM",
    price: "₹49",
    sub: "/session",
    registration: null,
    included: ["Community group format", "Rotating themes", "Beginner-friendly", "Drop-in welcome"],
    highlight: false,
  },
];

type Plan = (typeof plans)[0];

function PricingCard({ plan, index }: { plan: Plan; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useFramerInView(ref, { once: true, margin: "-80px" });
  const [glowAngle, setGlowAngle] = useState(0);

  useEffect(() => {
    if (!plan.highlight) return;
    let frame: number;
    let angle = 0;
    const tick = () => {
      angle = (angle + 0.35) % 360;
      setGlowAngle(angle);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [plan.highlight]);

  return (
    <motion.div
      ref={ref}
      variants={cardVariant}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{
        transitionDelay: `${index * 0.1}s`,
        backgroundColor: plan.highlight ? "var(--sp)" : "var(--ss)",
        borderColor: plan.highlight ? "transparent" : "var(--sbr)",
      }}
      className="rounded-3xl p-7 flex flex-col gap-5 border relative overflow-hidden"
    >
      {plan.highlight && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `conic-gradient(from ${glowAngle}deg, transparent 65%, rgba(255,255,255,0.13) 82%, transparent 100%)`,
            borderRadius: "inherit",
          }}
        />
      )}
      <div>
        <p className="text-xs font-medium tracking-[0.15em] uppercase mb-1" style={{ color: plan.highlight ? "rgba(255,255,255,0.7)" : "var(--sa)" }}>
          {plan.frequency}
        </p>
        <h3 className="font-heading font-medium text-xl leading-snug" style={{ color: plan.highlight ? "white" : "var(--st)" }}>
          {plan.name}
        </h3>
      </div>
      <div>
        <span className="font-heading text-4xl font-semibold" style={{ color: plan.highlight ? "white" : "var(--sp)" }}>
          {plan.price}
        </span>
        <span className="text-sm ml-1" style={{ color: plan.highlight ? "rgba(255,255,255,0.7)" : "var(--st2)" }}>
          {plan.sub}
        </span>
        {plan.registration && (
          <p className="text-xs mt-1" style={{ color: plan.highlight ? "rgba(255,255,255,0.6)" : "var(--st2)" }}>
            {plan.registration}
          </p>
        )}
      </div>
      <ul className="flex flex-col gap-2">
        {plan.included.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm" style={{ color: plan.highlight ? "rgba(255,255,255,0.85)" : "var(--st2)" }}>
            <span className="text-xs" style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : "var(--sp)" }}>✦</span>
            {item}
          </li>
        ))}
      </ul>
      <a
        href="#contact"
        className="mt-auto inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:opacity-90"
        style={{ backgroundColor: plan.highlight ? "white" : "var(--sp)", color: plan.highlight ? "var(--sp)" : "var(--sb)" }}
      >
        Enrol Now
      </a>
    </motion.div>
  );
}

export default function ScheduleSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useFramerInView(headerRef, { once: true, margin: "-60px" });
  const weekRef = useRef<HTMLDivElement>(null);
  const weekInView = useFramerInView(weekRef, { once: true, margin: "-60px" });
  const pricingRef = useRef<HTMLDivElement>(null);
  const pricingInView = useFramerInView(pricingRef, { once: true, margin: "-60px" });
  const disclaimerRef = useRef<HTMLDivElement>(null);
  const disclaimerInView = useFramerInView(disclaimerRef, { once: true, margin: "-40px" });

  return (
    <section id="schedule" className="py-28 px-6 md:px-12" style={{ backgroundColor: "var(--sb)" }}>
      <div className="max-w-6xl mx-auto flex flex-col gap-20">

        {/* Header */}
        <div ref={headerRef}>
          <div className="overflow-hidden">
            <motion.p
              variants={revealLeft}
              initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
              className="text-xs font-medium tracking-[0.25em] uppercase mb-3"
              style={{ color: "var(--sa)" }}
            >
              Schedule & Pricing
            </motion.p>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              variants={revealUp}
              initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
              transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-medium text-4xl md:text-6xl"
              style={{ color: "var(--st)" }}
            >
              Your week,{" "}
              <span className="italic" style={{ color: "var(--sp)" }}>redesigned.</span>
            </motion.h2>
          </div>
        </div>

        {/* Week grid */}
        <div ref={weekRef}>
          <div className="overflow-hidden mb-6">
            <motion.p
              variants={revealLeft}
              initial="hidden"
              animate={weekInView ? "visible" : "hidden"}
              className="text-xs font-medium tracking-[0.2em] uppercase"
              style={{ color: "var(--st2)" }}
            >
              Weekly rhythm
            </motion.p>
          </div>
          <motion.div
            className="grid grid-cols-7 gap-2"
            variants={staggerContainer}
            initial="hidden"
            animate={weekInView ? "visible" : "hidden"}
          >
            {days.map(({ day, active, label }) => (
              <motion.div
                key={day}
                variants={dayCellVariant}
                className="flex flex-col items-center gap-2 py-5 px-2 rounded-2xl text-center"
                style={{
                  backgroundColor: active ? "var(--ss)" : "transparent",
                  border: "1px solid var(--sbr)",
                  opacity: active ? 1 : 0.4,
                }}
              >
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: active ? "var(--sp)" : "var(--st2)" }}>
                  {day}
                </span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: active ? "var(--sp)" : "var(--sbr)" }} />
                <span className="text-[10px] leading-tight text-center" style={{ color: "var(--st2)" }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="mt-6 flex flex-wrap gap-3"
            variants={staggerContainer}
            initial="hidden"
            animate={weekInView ? "visible" : "hidden"}
          >
            {slots.map(({ time, label }) => (
              <motion.span
                key={time}
                variants={pillVariant}
                className="text-xs px-4 py-2 rounded-full border"
                style={{ display: "inline-block", borderColor: "var(--sbr)", backgroundColor: "var(--ss)", color: "var(--st)" }}
              >
                <span style={{ color: "var(--sp)", fontWeight: 600 }}>{label}</span> {time}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Pricing cards */}
        <div ref={pricingRef}>
          <div className="overflow-hidden mb-6">
            <motion.p
              variants={revealLeft}
              initial="hidden"
              animate={pricingInView ? "visible" : "hidden"}
              className="text-xs font-medium tracking-[0.2em] uppercase"
              style={{ color: "var(--st2)" }}
            >
              Pricing plans
            </motion.p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <PricingCard key={plan.name} plan={plan} index={i} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          ref={disclaimerRef}
          variants={revealUp}
          initial="hidden"
          animate={disclaimerInView ? "visible" : "hidden"}
          className="rounded-2xl p-6 border text-sm leading-relaxed"
          style={{ backgroundColor: "var(--ss)", borderColor: "var(--sbr)", color: "var(--st2)" }}
        >
          <span className="font-semibold text-xs tracking-[0.15em] uppercase block mb-2" style={{ color: "var(--sa)" }}>
            Please Note
          </span>
          Awakynn classes are designed for healthy adults and children. They are{" "}
          <strong style={{ color: "var(--st)" }}>not suitable</strong> for
          immobile patients — including pregnant women, physically disabled
          individuals (deaf, dumb, or otherwise mobility-restricted), or those
          advised against physical activity by a medical professional. When in
          doubt, please consult your doctor before joining.
        </motion.div>
      </div>
    </section>
  );
}
