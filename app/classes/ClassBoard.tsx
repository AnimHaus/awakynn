"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Video, Clock, Calendar } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ClassSession = {
  id: string;
  slot_id: string;
  day_of_week: number;
  occurrence_date: string;
  end_date: string;
  title: string;
  meet_link: string;
  created_at: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const CATEGORY_MAP: Record<string, string> = {
  "yoga-morning":  "Movement & Breath",
  "yoga-midday":   "Movement & Breath",
  "yoga-evening1": "Movement & Breath",
  "yoga-evening2": "Movement & Breath",
  "yoga-evening3": "Movement & Breath",
  "meditation":    "Inner Stillness",
  "workshop":      "Community Practice",
};

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  "Movement & Breath":   { border: "#2F4F46", bg: "rgba(47,79,70,0.07)",   text: "#2F4F46", dot: "#2F4F46" },
  "Inner Stillness":     { border: "#C8A86B", bg: "rgba(200,168,107,0.1)", text: "#8a6a2e", dot: "#C8A86B" },
  "Community Practice":  { border: "#3B312B", bg: "rgba(59,49,43,0.07)",   text: "#3B312B", dot: "#7a5c42" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function durationMins(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

function isUpcoming(iso: string) {
  return new Date(iso) > new Date();
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ── Board ─────────────────────────────────────────────────────────────────────
export default function ClassBoard() {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/classes/sessions/board`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { setSessions(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const upcoming = sessions.filter((s) => isUpcoming(s.occurrence_date));
  const past     = sessions.filter((s) => !isUpcoming(s.occurrence_date));

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 md:px-14" style={{ backgroundColor: "#faf8f5" }}>
      <div className="max-w-[900px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <h1 className="font-display text-5xl md:text-7xl font-light leading-[0.95] text-forest">
            Class <span className="italic text-gold">Board</span>
          </h1>
          <p className="mt-4 text-sm font-light max-w-sm leading-relaxed" style={{ color: "#7a6a5a" }}>
            Scheduled classes — join via Google Meet. Times shown in your local timezone.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-sm animate-pulse"
                style={{ backgroundColor: "rgba(59,49,43,0.07)" }}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm" style={{ color: "#b94040" }}>
            Could not load classes. Please try again later.
          </p>
        )}

        {/* Upcoming */}
        {!loading && !error && (
          <>
            {upcoming.length > 0 && (
              <section className="mb-14">
                <p className="text-[0.62rem] font-medium tracking-[0.3em] uppercase mb-6" style={{ color: "#7a6a5a" }}>
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
                <p className="text-[0.62rem] font-medium tracking-[0.3em] uppercase mb-6" style={{ color: "#7a6a5a" }}>
                  Past
                </p>
                <div className="flex flex-col gap-3">
                  {past.map((s, i) => (
                    <SessionCard key={s.id} session={s} index={i} past />
                  ))}
                </div>
              </section>
            )}

            {sessions.length === 0 && (
              <div
                className="py-20 text-center border"
                style={{ borderColor: "rgba(59,49,43,0.15)" }}
              >
                <p className="text-sm font-light" style={{ color: "#7a6a5a" }}>
                  No classes scheduled yet. Check back soon.
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}

// ── Session card ──────────────────────────────────────────────────────────────
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
      {/* Left: info */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <p
          className="text-[0.6rem] font-medium tracking-[0.25em] uppercase"
          style={{ color: c.text }}
        >
          {category}
        </p>
        <h3 className="font-display text-lg font-light leading-snug" style={{ color: "#2F4F46" }}>
          {session.title}
        </h3>
        <div className="flex flex-wrap items-center gap-4 mt-1">
          <span className="flex items-center gap-1.5 text-[0.7rem]" style={{ color: "#7a6a5a" }}>
            <Calendar size={11} />
            {fmtDate(session.occurrence_date)}
          </span>
          <span className="flex items-center gap-1.5 text-[0.7rem]" style={{ color: "#7a6a5a" }}>
            <Clock size={11} />
            {fmtTime(session.occurrence_date)} · {mins} min
          </span>
        </div>
      </div>

      {/* Right: join button */}
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
