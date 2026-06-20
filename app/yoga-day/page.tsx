import type { Metadata } from "next";
import TransitionLink from "../components/TransitionLink";
import CountdownDisplay from "./CountdownDisplay";
import ConditionalJoinButton from "./ConditionalJoinButton";

const CALENDAR_LINK = "https://calendar.app.google/8rXdcDLtCQ9SP5Rq9";

export const metadata: Metadata = {
  title: "International Yoga Day 2026 \u2013 Free Open Workshop",
  description:
    "Join Awakynn\u2019s free International Yoga Day workshop on 21 June 2026 \u2014 live on Google Meet. Open to all ages and levels. Sun Salutations, pranayama, mantra chanting, and more.",
  alternates: { canonical: "https://awakynn.com/yoga-day" },
  openGraph: {
    title: "International Yoga Day 2026 \u2013 Free Open Workshop by Awakynn",
    description:
      "Free live yoga workshop on 21 June 2026. Sun Salutations, pranayama, mantra chanting & meditation. Join on Google Meet.",
    url: "https://awakynn.com/yoga-day",
  },
  keywords: [
    "International Yoga Day 2026",
    "free yoga workshop",
    "yoga day live stream",
    "21 June yoga",
    "online yoga workshop India",
    "Awakynn yoga day",
  ],
};

export default function YogaDayPage() {
  return (
    <main style={{ backgroundColor: "#faf8f5", color: "#222222" }}>

      {/* Hero */}
      <section
        className="grain relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
        style={{ backgroundColor: "#2F4F46" }}
      >
        {/* Background image */}
        <img
          src="https://cdn.awakynn.com/hero3.jpeg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ opacity: 0.22 }}
        />
        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <span
            className="font-display select-none text-[38vw] font-light leading-none"
            style={{ color: "rgba(250,248,245,0.04)" }}
          >
            21
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5">
          <span
            className="block text-[0.65rem] font-medium tracking-[0.28em]"
            style={{ color: "#C8A86B" }}
          >
            INTERNATIONAL YOGA DAY \u00b7 21 JUNE 2026
          </span>
          <h1 className="font-display max-w-3xl text-5xl font-light leading-[0.95] text-white md:text-8xl">
            Open Workshop
          </h1>
          <p className="max-w-5xl text-base leading-relaxed" style={{ color: "rgba(250,248,245,0.65)" }}>
            Free workshop for all wanting to start their journey of yoga or wanting to practice
            yoga every day \u2014 join hands with AWAKYNN, and awaken your inner self. Beginner
            friendly: 45 minutes of yoga practice, interactions with your yog guru, simple daily
            practices, mantra chanting, pranayama.
          </p>

          {/* Client: countdown timer + CTA buttons */}
          <CountdownDisplay />
        </div>
      </section>

      {/* CTA section */}
      <section className="mx-auto max-w-[1500px] px-6 py-24 md:px-10 md:py-32">
        <div
          className="flex flex-col gap-8 border p-8 md:flex-row md:items-center md:justify-between md:p-12"
          style={{ borderColor: "rgba(34,34,34,0.1)" }}
        >
          <div>
            <h3
              className="font-display mt-3 text-3xl font-light md:text-4xl"
              style={{ color: "#2F4F46" }}
            >
              No registration required.
              <br />
              <span className="italic" style={{ color: "#C8A86B" }}>Just show up.</span>
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed" style={{ color: "rgba(34,34,34,0.55)" }}>
              In person or online \u2014 this workshop is open to absolutely everyone. Bring a mat,
              wear comfortable clothes, and come with an open mind.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <a
              href={CALENDAR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between gap-8 border px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-forest hover:!text-white"
              style={{ borderColor: "#2F4F46", color: "#2F4F46" }}
            >
              Add session to calendar
              <span className="transition-transform duration-300 group-hover:translate-x-1">&rsaquo;</span>
            </a>
            {/* Client: only renders when the live window is active */}
            <ConditionalJoinButton />
            <TransitionLink
              href="/contact"
              className="group inline-flex items-center justify-between gap-8 border px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-70"
              style={{ borderColor: "rgba(34,34,34,0.2)", color: "rgba(34,34,34,0.5)" }}
            >
              Enquire about in-person
              <span className="transition-transform duration-300 group-hover:translate-x-1">&rsaquo;</span>
            </TransitionLink>
          </div>
        </div>
      </section>

    </main>
  );
}
