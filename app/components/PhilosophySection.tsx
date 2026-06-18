"use client";

import { useInView } from "./useInView";

const pillars = [
  {
    number: "I",
    title: "Build a Discipline That Becomes Life",
    body: `More than fitness — first comes awakening yourself and everything you always knew was within you. We build the art of consistency naturally, where you are not just thinking about a healthier lifestyle but are so transformed by it that you keep coming back.`,
    quote: "Discipline is not a cage — it is the river that finds the sea.",
    image:
      "https://cdn.awakynn.com/mission.avif",
  },
  {
    number: "II",
    title: "Step Out of the Story You Tell Yourself",
    body: `To come out of your pretentious mind — acceptance, facing the negatively built-up stories within, and becoming independent of all attachments. Finding our peace. Striking out fear, failure, unhealthy love, ego, false attitude, and impulsiveness — one breath at a time.`,
    quote: "When you stop pretending, the real journey begins.",
    image:
      "https://cdn.awakynn.com/vision.avif",
  },
];

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[0];
  index: number;
}) {
  const { ref, inView } = useInView(0.15);

  return (
    <div
      ref={ref}
      className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border"
      style={{
        borderColor: "var(--sbr)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(60px)",
        transition: `opacity 0.9s ease ${index * 0.15}s, transform 0.9s ease ${index * 0.15}s`,
      }}
    >
      {/* Image side */}
      <div
        className={`relative h-64 md:h-auto overflow-hidden ${index % 2 === 1 ? "md:order-2" : ""}`}
      >
        <img
          src={pillar.image}
          alt={pillar.title}
          className="w-full h-full object-cover"
          loading="lazy"
          style={{ transition: "transform 0.6s ease" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3))",
          }}
        />
      </div>

      {/* Text side */}
      <div
        className="p-8 md:p-12 flex flex-col justify-between gap-8"
        style={{ backgroundColor: "var(--sb)" }}
      >
        <div className="flex flex-col gap-5">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase px-3 py-1 rounded-full self-start"
            style={{ backgroundColor: "var(--ss)", color: "var(--sa)" }}
          >
            {index === 0 ? "Mission" : "Vision"}
          </span>
          <h3
            className="font-heading font-medium text-2xl md:text-3xl leading-snug"
            style={{ color: "var(--st)" }}
          >
            {pillar.title}
          </h3>
          <p
            className="text-sm md:text-base font-light leading-relaxed"
            style={{ color: "var(--st2)" }}
          >
            {pillar.body}
          </p>
        </div>
        <blockquote
          className="border-l-2 pl-5 font-heading italic text-base md:text-lg"
          style={{ borderColor: "var(--sp)", color: "var(--sp)" }}
        >
          {pillar.quote}
        </blockquote>
      </div>
    </div>
  );
}

export default function PhilosophySection() {
  const header = useInView(0.2);

  return (
    <section
      id="philosophy"
      className="py-28 px-6 md:px-12"
      style={{ backgroundColor: "var(--ss)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div
          ref={header.ref}
          className="text-center"
          style={{
            opacity: header.inView ? 1 : 0,
            transform: header.inView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <h2
            className="font-heading font-medium text-4xl md:text-6xl"
            style={{ color: "var(--st)" }}
          >
            A Philosophy of{" "}
            <span className="italic" style={{ color: "var(--sp)" }}>
              Awakening
            </span>
          </h2>
        </div>

        {/* Pillars */}
        {pillars.map((p, i) => (
          <PillarCard key={p.number} pillar={p} index={i} />
        ))}
      </div>
    </section>
  );
}
