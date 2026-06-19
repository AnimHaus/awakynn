"use client";

import { useState, useEffect } from "react";
import TransitionLink from "../components/TransitionLink";

// ── Countdown to 21 June 2026 10:00 AM IST ──────────────────────────────
const EVENT_DATE = new Date("2026-06-21T04:30:00.000Z"); // 10:00 AM IST = 04:30 UTC

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const total = Math.max(diff, 0);
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const mins = Math.floor((total % 3600000) / 60000);
  const secs = Math.floor((total % 60000) / 1000);
  return { days, hours, mins, secs, live: diff <= 0 };
}

// ── Replace with the actual YouTube live/video ID when available ─────────
const YOUTUBE_VIDEO_ID = "live_stream_id_here";

const schedule = [
  { time: "10:00 AM", title: "Opening circle & pranayama", duration: "30 min" },
  { time: "10:30 AM", title: "Sun Salutation flow — all levels", duration: "45 min" },
  { time: "11:15 AM", title: "Ashtanga fundamentals with Monalisa", duration: "60 min" },
  { time: "12:15 PM", title: "Mantra chanting & meditation", duration: "30 min" },
  { time: "12:45 PM", title: "Closing ceremony & Q&A", duration: "30 min" },
];

export default function YogaDayPage() {
  const { days, hours, mins, secs, live } = useCountdown(EVENT_DATE);

  return (
    <main style={{ backgroundColor: "#faf8f5", color: "#222222" }}>

      {/* ── Hero banner ─────────────────────────────────────────── */}
      <section
        className="grain relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
        style={{ backgroundColor: "#2F4F46" }}
      >
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
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
            INTERNATIONAL YOGA DAY · 21 JUNE 2026
          </span>

          <h1
            className="font-display max-w-3xl text-5xl font-light leading-[0.95] text-white md:text-8xl"
          >
            Open Workshop
            <br />
            <span className="italic" style={{ color: "#C8A86B" }}>
              &amp; Live Stream
            </span>
          </h1>

          <p
            className="max-w-md text-base leading-relaxed"
            style={{ color: "rgba(250,248,245,0.65)" }}
          >
            A free, open-to-all celebration of yoga — join us in person or watch
            live on YouTube. No experience required.
          </p>

          {/* Countdown / Live indicator */}
          <div className="mt-4">
            {live ? (
              <span
                className="inline-flex items-center gap-2 border px-5 py-2.5 text-xs font-medium tracking-[0.2em] uppercase"
                style={{ borderColor: "#C8A86B", color: "#C8A86B" }}
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                We are live now
              </span>
            ) : (
              <div className="flex items-end gap-6">
                {[
                  { val: days, label: "Days" },
                  { val: hours, label: "Hours" },
                  { val: mins, label: "Mins" },
                  { val: secs, label: "Secs" },
                ].map(({ val, label }) => (
                  <div key={label} className="flex flex-col items-center">
                    <span
                      className="font-display text-4xl font-light leading-none text-white md:text-5xl"
                    >
                      {String(val).padStart(2, "0")}
                    </span>
                    <span
                      className="mt-1 text-[0.6rem] font-medium tracking-[0.18em]"
                      style={{ color: "rgba(250,248,245,0.45)" }}
                    >
                      {label.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Live stream embed ────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
        <span
          className="block text-[0.65rem] font-medium tracking-[0.25em]"
          style={{ color: "#C8A86B" }}
        >
          LIVE STREAM
        </span>
        <h2
          className="font-display mt-3 text-3xl font-light md:text-5xl"
          style={{ color: "#2F4F46" }}
        >
          Watch live — free &amp; open to all
        </h2>

        {/* Responsive 16:9 iframe container */}
        <div className="relative mt-10 w-full overflow-hidden border border-charcoal/10" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=0&rel=0&modestbranding=1`}
            title="Awakynn — International Yoga Day Live Workshop"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <p
          className="mt-4 text-xs leading-relaxed"
          style={{ color: "rgba(34,34,34,0.4)" }}
        >
          Stream begins at <strong>10:00 AM IST</strong> on 21 June 2026. Subscribe to
          the Awakynn YouTube channel for a reminder.
        </p>
      </section>

      {/* ── Schedule ────────────────────────────────────────────── */}
      <section
        className="grain py-24 md:py-32"
        style={{ backgroundColor: "#2F4F46" }}
      >
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <span
            className="block text-[0.65rem] font-medium tracking-[0.25em]"
            style={{ color: "#C8A86B" }}
          >
            PROGRAMME
          </span>
          <h2
            className="font-display mt-3 text-3xl font-light text-white md:text-5xl"
          >
            What to expect
          </h2>

          <div className="mt-12 flex flex-col">
            {schedule.map((item, i) => (
              <div
                key={item.title}
                className="flex flex-col gap-1 border-t py-6 sm:flex-row sm:items-center sm:gap-10"
                style={{ borderColor: "rgba(250,248,245,0.12)" }}
              >
                <span
                  className="w-28 shrink-0 font-display text-lg font-light"
                  style={{ color: "#C8A86B" }}
                >
                  {item.time}
                </span>
                <span className="flex-1 text-base font-light text-white">
                  {item.title}
                </span>
                <span
                  className="text-[0.7rem] font-medium tracking-[0.14em]"
                  style={{ color: "rgba(250,248,245,0.4)" }}
                >
                  {item.duration.toUpperCase()}
                </span>
              </div>
            ))}
            <div
              className="border-t"
              style={{ borderColor: "rgba(250,248,245,0.12)" }}
            />
          </div>
        </div>
      </section>

      {/* ── Free & open CTA ─────────────────────────────────────── */}
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
              <span className="italic" style={{ color: "#C8A86B" }}>
                Just show up.
              </span>
            </h3>
            <p
              className="mt-4 max-w-md text-sm leading-relaxed"
              style={{ color: "rgba(34,34,34,0.55)" }}
            >
              In person or online — this workshop is open to absolutely everyone.
              Bring a mat, wear comfortable clothes, and come with an open mind.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <a
              href={`https://youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between gap-8 border px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-forest hover:!text-white"
              style={{ borderColor: "#2F4F46", color: "#2F4F46" }}
            >
              Watch live on YouTube
              <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
            </a>
            <TransitionLink
              href="/contact"
              className="group inline-flex items-center justify-between gap-8 border px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-70"
              style={{ borderColor: "rgba(34,34,34,0.2)", color: "rgba(34,34,34,0.5)" }}
            >
              Enquire about in-person
              <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
            </TransitionLink>
          </div>
        </div>
      </section>

    </main>
  );
}
