"use client";

import { useState, useEffect } from "react";
import TransitionLink from "../components/TransitionLink";

// ── Countdown to 21 June 2026 10:00 AM IST ──────────────────────────────
const EVENT_DATE = new Date("2026-06-21T04:30:00.000Z"); // 10:00 AM IST
const CLASS_END  = new Date("2026-06-22T01:30:00.000Z"); // next day 01:30 UTC

const CALENDAR_LINK = "https://calendar.app.google/8rXdcDLtCQ9SP5Rq9";
const MEET_LINK     = "https://meet.google.com/qba-iprk-bqn";

function useCountdown(target: Date, end: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff  = target.getTime() - now;
  const total = Math.max(diff, 0);
  const days  = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const mins  = Math.floor((total % 3600000) / 60000);
  const secs  = Math.floor((total % 60000) / 1000);
  return {
    days, hours, mins, secs,
    live:    diff <= 0 && now < end.getTime(),
    ended:   now >= end.getTime(),
    joinVisible: now >= target.getTime() && now < end.getTime(),
  };
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
  const { days, hours, mins, secs, live, ended, joinVisible } = useCountdown(EVENT_DATE, CLASS_END);

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
            {ended ? (
              <span
                className="inline-flex items-center gap-2 border px-5 py-2.5 text-xs font-medium tracking-[0.2em] uppercase"
                style={{ borderColor: "rgba(250,248,245,0.3)", color: "rgba(250,248,245,0.5)" }}
              >
                Event has ended
              </span>
            ) : live ? (
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

          {/* CTA buttons — below the counter */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={CALENDAR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between gap-8 border px-6 py-3.5 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white hover:!text-[#2f4f46]"
              style={{ borderColor: "rgba(250,248,245,0.6)", color: "rgba(250,248,245,0.85)" }}
            >
              Add session to calendar
              <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
            </a>
            {joinVisible && (
              <a
                href={MEET_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between gap-8 border px-6 py-3.5 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300"
                style={{ borderColor: "#C8A86B", color: "#C8A86B", backgroundColor: "rgba(200,168,107,0.1)" }}
              >
                Join the class
                <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
              </a>
            )}
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
              href={CALENDAR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between gap-8 border px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-forest hover:!text-white"
              style={{ borderColor: "#2F4F46", color: "#2F4F46" }}
            >
              Add session to calendar
              <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
            </a>
            {joinVisible && (
              <a
                href={MEET_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between gap-8 border px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#C8A86B] hover:border-[#C8A86B] hover:!text-white"
                style={{ borderColor: "#C8A86B", color: "#C8A86B" }}
              >
                Join the class
                <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
              </a>
            )}
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
