const credentials = [
  { label: "Certification", value: "Ashtanga Yoga Certified Teacher" },
  { label: "Certificate No.", value: "B/001/21631" },
  { label: "Practice Hours", value: "1,000 hrs" },
  { label: "First Aid", value: "Certified First Aider" },
  { label: "Education", value: "B.Tech Graduate" },
];

export default function InstructorSection() {
  return (
    <section
      id="instructor"
      className="relative overflow-hidden bg-sand py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">

        {/* Eyebrow */}
        <span className="eyebrow text-gold">Your guide</span>

        {/* Two-column layout */}
        <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20 lg:grid-cols-[1fr_1fr] lg:gap-32">

          {/* Left — image */}
          <div className="relative">
            {/* Image placeholder — replace src with actual photo */}
            <div
              className="relative aspect-[3/4] w-full overflow-hidden border border-charcoal/10"
              style={{ background: "linear-gradient(160deg,#2F4F46,#1c322c)" }}
            >
              <img
                src="https://cdn.awakynn.com/main_instructor.jpeg"
                alt="Monalisa Manna — lead yoga instructor"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Floating credential badge */}
            <div
              className="absolute -bottom-5 right-0 border border-charcoal/10 bg-sand px-6 py-4 shadow-[0_20px_50px_-20px_rgba(34,34,34,0.15)] md:-right-8"
            >
              <span className="eyebrow text-gold">In practice</span>
              <p className="font-display mt-1 text-3xl font-light text-forest">
                1,000 <span className="text-base font-normal">hrs</span>
              </p>
            </div>
          </div>

          {/* Right — bio */}
          <div className="flex flex-col justify-center pt-6 md:pt-0">
            <h2 className="font-display text-5xl font-light leading-[0.95] text-forest md:text-6xl lg:text-7xl">
              Monalisa
              <br />
              <span className="italic text-gold">Manna</span>
            </h2>

            <p className="mt-8 text-base leading-[1.85]" style={{ color: "rgba(34,34,34,0.72)" }}>
              A B.Tech graduate turned devoted practitioner, Monalisa has built her teaching on the
              foundation of <em>authentic guru–shishya parampara</em> — the ancient teacher–student
              lineage that anchors every Awakynn class. Her practice is rigorous, but her space is
              anything but: she creates an&nbsp;
              <span style={{ color: "#2F4F46", fontWeight: 500 }}>
                extremely approachable, unbiased and positive environment
              </span>
              &nbsp;for anyone and everyone.
            </p>

            <p className="mt-5 text-base leading-[1.85]" style={{ color: "rgba(34,34,34,0.72)" }}>
              The Awakynn community is held by associate members who carry over{" "}
              <span style={{ color: "#2F4F46", fontWeight: 500 }}>20 years of yoga practice</span>, alongside
              resident doctors who offer personalised guidance through your yoga journey, ayurvedic
              diet, and inner clarity.
            </p>

            {/* Credential strip */}
            <div
              className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t pt-8 sm:grid-cols-3"
              style={{ borderColor: "rgba(34,34,34,0.1)" }}
            >
              {credentials.map((c) => (
                <div key={c.label}>
                  <span
                    className="block text-[0.62rem] font-medium tracking-[0.18em]"
                    style={{ color: "rgba(34,34,34,0.42)" }}
                  >
                    {c.label.toUpperCase()}
                  </span>
                  <span
                    className="mt-0.5 block text-sm font-medium leading-snug"
                    style={{ color: "#2F4F46" }}
                  >
                    {c.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
