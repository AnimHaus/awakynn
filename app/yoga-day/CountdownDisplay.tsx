"use client";

import { useState, useEffect } from "react";

const EVENT_DATE = new Date("2026-06-21T01:30:00.000Z"); // 10:00 AM IST
const CLASS_END  = new Date("2026-06-21T02:30:00.000Z");

const CALENDAR_LINK = "https://calendar.app.google/8rXdcDLtCQ9SP5Rq9";
const MEET_LINK     = "https://meet.google.com/qba-iprk-bqn";

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff  = EVENT_DATE.getTime() - now;
  const total = Math.max(diff, 0);
  return {
    days:  Math.floor(total / 86400000),
    hours: Math.floor((total % 86400000) / 3600000),
    mins:  Math.floor((total % 3600000) / 60000),
    secs:  Math.floor((total % 60000) / 1000),
    live:        diff <= 0 && now < CLASS_END.getTime(),
    ended:       now >= CLASS_END.getTime(),
    joinVisible: now >= EVENT_DATE.getTime() && now < CLASS_END.getTime(),
  };
}

// Renders the countdown timer block + hero CTA buttons.
// Both are dynamic (time-dependent) so they live in this single client component.
export default function CountdownDisplay() {
  const { days, hours, mins, secs, live, ended, joinVisible } = useCountdown();

  return (
    <>
      {/* Countdown / live / ended */}
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
              { val: days,  label: "Days"  },
              { val: hours, label: "Hours" },
              { val: mins,  label: "Mins"  },
              { val: secs,  label: "Secs"  },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="font-display text-4xl font-light leading-none text-white md:text-5xl">
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

      {/* CTA buttons */}
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
    </>
  );
}
