"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Testimonial = {
  id: string;
  name: string;
  age: number | null;
  note?: string;
  image: string | null;
  text: string;
  lang: string;
};

const testimonials: Testimonial[] = [
  {
    id: "mausumi",
    name: "Mausumi Baral",
    age: 56,
    image: "https://cdn.awakynn.com/testimonial_mausumi_baral.jpeg",
    text: "My name is Mausumi Baral, age 56 years. I have arthritis knee problem. A year back I wasn't able to climb stairs or even getting onto a bike without any support — now I can confidently do it all. Yet with age sometimes my knees pain, but every time I practice yoga it gets better and the pain reduces drastically. Thank you Monalisa, she is really very kind and sweet.",
    lang: "en",
  },
  {
    id: "srabanti",
    name: "Shrabanti Dutta",
    age: 51,
    image: "https://cdn.awakynn.com/testimonial_shrabanti_dutta.jpeg",
    text: "আমি শ্রাবন্তী দত্ত, আমার বয়স ৫১। আমি গত ১ বছর ধরে আমার কন্যা সম মোনালিসার কাছে যোগাসন ও মেডিটেশন, প্রাণায়াম অভ্যাস করছি। আমার শরীর ও মনের সুস্থার জন্য যোগা অভ্যাসের কোনও বিকল্প হয় না। যা আমি ওর কাছ থেকে শিক্ষা লাভ করে খুবই উপকৃত হয়েছি। ধন্যবাদ মোনালিসা তোমাকে।",
    lang: "bn",
  },
  {
    id: "dolly",
    name: "Dolly",
    age: 76,
    image: "https://cdn.awakynn.com/testimonial_dolly.jpeg",
    text: "Hello, my name is Dolly and I am 76 years old. I have been practising yoga with Monalisa for more than a year. I used to suffer from chronic muscle cramps every night, and honestly after doing yoga under her guidance I am at ease — now I can sleep every night without any difficulty.",
    lang: "en",
  },
  {
    id: "ranjan",
    name: "Ranjan",
    age: 80,
    image: "https://cdn.awakynn.com/testimonial_ranjan.jpeg",
    text: "Everyone, I am Ranjan, 80 years old. I have been a student of Monalisa, and being a part of Awakynn's community has been the best part at this age. I feel happy and healthy — like I am just 20. What I like about our teacher is the amount of patience and care she gives to us during each class. Thank you.",
    lang: "en",
  },
  {
    id: "santana",
    name: "Santana Dey",
    age: null,
    note: "Neha's Mom",
    image: "https://cdn.awakynn.com/hero1.jpeg",
    text: "Hi everyone, I am Neha's Mom Santana Dey. My daughter is special, and would frequently get indigestion issues, and was extremely shy — she would never speak in public. I always want her to shine and be her best. Every doctor I visited suggested she needs yoga, so I joined her in Monalisa's class on a friend's recommendation. That day to this day I cannot explain how happy I am. Her indigestion issues have become very less, and what I never expected — she is now expressing herself so confidently in public. I had no idea about the mental exercises and guided public speaking practice woven into the yogasana. Thank you so much.",
    lang: "en",
  },
];

function Avatar({ t, size }: { t: Testimonial; size: "sm" | "lg" }) {
  const dim = size === "lg" ? 56 : 40;
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full bg-sand"
      style={{ width: dim, height: dim, border: "2px solid rgba(200,168,107,0.3)" }}
    >
      {t.image ? (
        <img src={t.image} alt={t.name} className="h-full w-full object-cover object-top" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-sm font-light" style={{ color: "#C8A86B" }}>
            {t.name.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  const active = testimonials[current];
  const others = testimonials.filter((_, i) => i !== current);

  return (
    <section id="testimonials" className="relative overflow-hidden bg-sand py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">

        {/* Header */}
        <div className="mb-16">
          <h2 className="font-display mt-3 max-w-2xl text-5xl font-light leading-[0.95] text-forest md:text-7xl">
            Lives that
            <br />
            <span className="italic text-gold">transformed.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:items-start">

          {/* ── Main featured card ── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden border border-charcoal/8 bg-white p-8 md:p-12"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {/* Decorative quote */}
                <div
                  className="pointer-events-none absolute right-8 top-6 select-none font-display text-[9rem] leading-none"
                  style={{ color: "rgba(200,168,107,0.1)" }}
                  aria-hidden
                >
                  "
                </div>

                {/* Image space */}
                <div
                  className="mb-8 w-full overflow-hidden bg-sand/60"
                  style={{ aspectRatio: "16/7" }}
                >
                  {active.image ? (
                    <img
                      src={active.image}
                      alt={active.name}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-[0.6rem] font-medium tracking-[0.2em] uppercase" style={{ color: "rgba(34,34,34,0.25)" }}>
                        Photo coming soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <blockquote
                  className="relative z-10 text-base leading-[1.9] md:text-lg"
                  lang={active.lang}
                  style={{ color: "rgba(34,34,34,0.75)" }}
                >
                  "{active.text}"
                </blockquote>

                {/* Attribution */}
                <div className="mt-8 flex items-center gap-4 border-t border-charcoal/8 pt-6">
                  <Avatar t={active} size="lg" />
                  <div>
                    <p className="font-display text-lg font-light" style={{ color: "#2F4F46" }}>
                      {active.name}
                      {active.note && (
                        <span className="ml-2 font-sans text-xs tracking-widest uppercase" style={{ color: "#C8A86B" }}>
                          {active.note}
                        </span>
                      )}
                    </p>
                    {active.age && (
                      <p className="mt-0.5 text-[0.65rem] font-medium tracking-[0.18em] uppercase" style={{ color: "rgba(34,34,34,0.4)" }}>
                        {active.age} years old
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="mt-5 flex items-center gap-2.5 pl-1">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className="h-px transition-all duration-400 focus:outline-none"
                  style={{
                    width: i === current ? 32 : 12,
                    backgroundColor: i === current ? "#2F4F46" : "rgba(47,79,70,0.25)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Sidebar stack ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {others.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setCurrent(testimonials.indexOf(t))}
                className="cursor-pointer border border-charcoal/8 bg-white p-6 transition-all duration-300 hover:border-gold/40 hover:shadow-[0_12px_36px_-12px_rgba(47,79,70,0.14)]"
              >
                {/* Mini avatar + name */}
                <div className="mb-3 flex items-center gap-3">
                  <Avatar t={t} size="sm" />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#2F4F46" }}>
                      {t.name}
                      {t.note && (
                        <span className="ml-1.5 text-[0.6rem] tracking-widest uppercase" style={{ color: "#C8A86B" }}>
                          {t.note}
                        </span>
                      )}
                    </p>
                    {t.age && (
                      <p className="text-[0.62rem] tracking-[0.15em] uppercase" style={{ color: "rgba(34,34,34,0.38)" }}>
                        {t.age} years old
                      </p>
                    )}
                  </div>
                </div>
                <p
                  className="line-clamp-3 text-xs leading-relaxed"
                  lang={t.lang}
                  style={{ color: "rgba(34,34,34,0.6)" }}
                >
                  {t.text}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}