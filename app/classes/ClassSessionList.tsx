"use client";

import { motion } from "framer-motion";
import { Video, Clock, Calendar } from "lucide-react";

export type ClassSession = {
  id: string;
  slot_id: string;
  occurrence_date: string;
  end_date: string;
  title: string;
  meet_link: string;
};

const CATEGORY_MAP: Record<string, string> = {
  "yoga-morning":  "Movement & Breath",
  "yoga-midday":   "Movement & Breath",
  "yoga-evening1": "Movement & Breath",
  "yoga-evening2": "Movement & Breath",
  "yoga-evening3": "Movement & Breath",
  "meditation":    "Inner Stillness",
  "workshop":      "Community Practice",
};

const COLOR_MAP: Record<string, { border: string; bg: string; text: string }> = {
  "Movement & Breath":  { border: "#2F4F46", bg: "rgba(47,79,70,0.07)",   text: "#2F4F46" },
  "Inner Stillness":    { border: "#C8A86B", bg: "rgba(200,168,107,0.1)", text: "#8a6a2e" },
  "Community Practice": { border: "#3B312B", bg: "rgba(59,49,43,0.07)",   text: "#3B312B" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function durationMins(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

// serverTime is passed from the server so the upcoming/past split is
// deterministic between SSR and hydration — no hydration mismatch.
export default function ClassSessionList({
  sessions,
  serverTime,
  error,
}: {
  sessions: ClassSession[];
  serverTime: number;
  error: boolean;
}) {
  if (error) {
    return (
      <p className="text-sm" style={{ color: "#b94040" }}>
        Could not load classes. Please try again later.
      </p>
    );
  }

  if (sessions.length === 0) {
    return (
      <div
        className="py-20 text-center border"
        style={{ borderColor: "rgba(59,49,43,0.15)" }}
      >
        <p className="text-sm font-light" style={{ color: "#7a6a5a" }}>
          No classes scheduled yet. Check back soon.
        </p>
      </div>
    );
  }

  const upcoming = sessions.filter(
    (s) => new Date(s.occurrence_date).getTime() > serverTime,
  );
  const past = sessions.filter(
    (s) => new Date(s.occurrence_date).getTime() <= serverTime,
  );

  return (
    <>
      {upcoming.length > 0 && (
        <section className="mb-14">
          <p
            className="text-[0.62rem] font-medium tracking-[0.3em] uppercase mb-6"
            style={{ color: "#7a6a5a" }}
          >
            Upcoming
          </p>
          <div className="flex flex-col gap-3">
            {upcoming.map((s, i) => (
              <SessionCard key={s.id} session={s} index={i} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <p
            className="text-[0.62rem] font-medium tracking-[0.3em] uppercase mb-6"
            style={{ color: "#7a6a5a" }}
          >
            Past
          </p>
          <div className="flex flex-col gap-3">
            {past.map((s, i) => (
              <SessionCard key={s.id} session={s} index={i} past />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function SessionCard({
  session,
  index,
  past = false,
}: {
  session: ClassSession;
  index: number;
  past?: boolean;
}) {
  const category = CATEGORY_MAP[session.slot_id] ?? "Yoga & Wellness";
  const c = COLOR_MAP[category] ?? COLOR_MAP["Movement & Breath"];
  const mins = durationMins(session.occurrence_date, session.end_date);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between gap-6 border-l-2 px-6 py-5"
      style={{
        borderLeftColor: c.border,
        backgroundColor: c.bg,
        opacity: past ? 0.55 : 1,
      }}
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        <p
          className="text-[0.6rem] font-medium tracking-[0.25em] uppercase"
          style={{ color: c.text }}
        >
          {category}
        </p>
        <h3
          className="font-display text-lg font-light leading-snug"
          style={{ color: "#2F4F46" }}
        >
          {session.title}
        </h3>
        <div className="flex flex-wrap items-center gap-4 mt-1">
          <span
            className="flex items-center gap-1.5 text-[0.7rem]"
            style={{ color: "#7a6a5a" }}
          >
            <Calendar size={11} />
            {fmtDate(session.occurrence_date)}
          </span>
          <span
            className="flex items-center gap-1.5 text-[0.7rem]"
            style={{ color: "#7a6a5a" }}
          >
            <Clock size={11} />
            {fmtTime(session.occurrence_date)} · {mins} min
          </span>
        </div>
      </div>

      {session.meet_link && !past && (
        <a
          href={session.meet_link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 border text-[0.68rem] font-medium tracking-[0.18em] uppercase transition-all duration-300 hover:bg-forest hover:text-sand"
          style={{ borderColor: "#2F4F46", color: "#2F4F46" }}
        >
          <Video size={11} />
          Join
        </a>
      )}
    </motion.article>
  );
}
