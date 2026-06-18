const words = [
  "Yoga", "·", "Pranayama", "·", "Meditation", "·",
  "Ayurveda", "·", "Mantra", "·", "Breath", "·",
  "Consistency", "·", "Awakening", "·", "Clarity", "·",
];

export default function MarqueeStrip() {
  const repeated = [...words, ...words, ...words];
  return (
    <div
      className="overflow-hidden py-4 border-y"
      style={{ borderColor: "var(--sbr)", backgroundColor: "var(--ss)" }}
    >
      <div
        className="flex gap-6 w-max"
        style={{
          animation: "marquee 30s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {repeated.map((w, i) => (
          <span
            key={i}
            className="font-heading italic text-base md:text-lg select-none"
            style={{ color: w === "·" ? "var(--sp)" : "var(--st2)" }}
          >
            {w}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
