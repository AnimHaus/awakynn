"use client";

import { useState, useEffect, useRef } from "react";
import { Video, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Time helpers ────────────────────────────────────────────────────────────
// Classes are scheduled in IST (UTC+5:30). Grid coordinates are IST absolute
// minutes. All *displayed* times are converted to the user's local locale.
const IST_OFFSET_MINS = 330; // 5h 30m

// Convert an IST hour+minute to a local-timezone Date (for display only)
function istToLocalDate(istH: number, istM: number): Date {
  const totalUtcMins = ((istH * 60 + istM - IST_OFFSET_MINS) % 1440 + 1440) % 1440;
  const d = new Date();
  d.setUTCHours(Math.floor(totalUtcMins / 60), totalUtcMins % 60, 0, 0);
  return d;
}

// Format IST h/m as local time string
function fmtLocalTime(istH: number, istM: number): string {
  return istToLocalDate(istH, istM).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Current time as IST absolute minutes (for grid position)
function nowToIstMins(): number {
  const d = new Date();
  return ((d.getUTCHours() * 60 + d.getUTCMinutes() + IST_OFFSET_MINS) % 1440);
}

// ── Schedule data ────────────────────────────────────────────────────────────
type ClassSlot = {
  id: string;
  title: string;
  category: string;
  days: number[];           // JS day indices (0=Sun…6=Sat)
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  colorKey: "yoga" | "meditation" | "workshop";
};

const COLOR: Record<ClassSlot["colorKey"], { bg: string; border: string; text: string; dot: string }> = {
  yoga:        { bg: "rgba(212,165,75,0.14)",  border: "var(--sp)",  text: "var(--sp)",  dot: "var(--sp)"  },
  meditation:  { bg: "rgba(124,158,135,0.15)", border: "#7c9e87",   text: "#5a7a63",    dot: "#7c9e87"    },
  workshop:    { bg: "rgba(184,149,106,0.15)", border: "#b8956a",   text: "#8a6a3a",    dot: "#b8956a"    },
};

const schedule: ClassSlot[] = [
  { id:"yoga-morning",  title:"Yoga — Asana & Pranayama", category:"Movement & Breath",    days:[2,4,6,0], startHour:8,  startMinute:0,  durationMinutes:60,  colorKey:"yoga"       },
  { id:"workshop",      title:"Sunday Workshop",           category:"Community Practice",    days:[0],       startHour:10, startMinute:0,  durationMinutes:60,  colorKey:"workshop"   },
  { id:"yoga-midday",   title:"Yoga — Asana & Pranayama", category:"Movement & Breath",    days:[2,4,6,0], startHour:11, startMinute:0,  durationMinutes:60,  colorKey:"yoga"       },
  { id:"yoga-evening1", title:"Yoga — Asana & Pranayama", category:"Movement & Breath",    days:[2,4,6,0], startHour:17, startMinute:0,  durationMinutes:60,  colorKey:"yoga"       },
  { id:"yoga-evening2", title:"Yoga — Asana & Pranayama", category:"Movement & Breath",    days:[2,4,6,0], startHour:18, startMinute:15, durationMinutes:60,  colorKey:"yoga"       },
  { id:"yoga-evening3", title:"Yoga — Asana & Pranayama", category:"Movement & Breath",    days:[2,4,6,0], startHour:19, startMinute:30, durationMinutes:60,  colorKey:"yoga"       },
  { id:"meditation",    title:"Breathing & Meditation",   category:"Inner Stillness",       days:[2,5],     startHour:20, startMinute:30, durationMinutes:45,  colorKey:"meditation" },
];

// Display column order: Mon-Sun (indices 1,2,3,4,5,6,0)
const COLUMNS = [
  { dayIndex: 1, short: "Mon", full: "Monday",    rest: true  },
  { dayIndex: 2, short: "Tue", full: "Tuesday",   rest: false },
  { dayIndex: 3, short: "Wed", full: "Wednesday", rest: false },
  { dayIndex: 4, short: "Thu", full: "Thursday",  rest: false },
  { dayIndex: 5, short: "Fri", full: "Friday",    rest: false },
  { dayIndex: 6, short: "Sat", full: "Saturday",  rest: false },
  { dayIndex: 0, short: "Sun", full: "Sunday",    rest: false },
];

// ── Time grid constants ──────────────────────────────────────────────────────
const GRID_START_MIN = 7 * 60;      // 7:00 AM
const GRID_END_MIN   = 21 * 60 + 30; // 9:30 PM
const TOTAL_MIN      = GRID_END_MIN - GRID_START_MIN;
const PX_PER_MIN     = 1.4;          // pixels per minute
const GRID_H         = TOTAL_MIN * PX_PER_MIN;
const RULER_W        = 52;

const HOUR_MARKS: number[] = [];
for (let h = 8; h <= 21; h++) HOUR_MARKS.push(h);

function minToY(absMins: number) {
  return (absMins - GRID_START_MIN) * PX_PER_MIN;
}

function fmtHour(istH: number): string {
  return fmtLocalTime(istH, 0);
}

function fmtTime(istH: number, istM: number): string {
  return fmtLocalTime(istH, istM);
}

// ── Meet helpers ─────────────────────────────────────────────────────────────
function getNextOccurrence(dayOfWeek: number, istHour: number, istMinute: number): Date {
  // Work in UTC to find the next occurrence of this IST day+time
  const nowUtcMins = nowToIstMins(); // current time in IST absolute mins
  const nowIstDay = new Date().getUTCDay(); // close enough for scheduling
  let daysAhead = (dayOfWeek - nowIstDay + 7) % 7;
  if (daysAhead === 0 && istHour * 60 + istMinute <= nowUtcMins) daysAhead = 7;
  const totalUtcMins = ((istHour * 60 + istMinute - IST_OFFSET_MINS) % 1440 + 1440) % 1440;
  const target = new Date();
  target.setUTCHours(Math.floor(totalUtcMins / 60), totalUtcMins % 60, 0, 0);
  target.setUTCDate(target.getUTCDate() + daysAhead);
  return target;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ── Slot block (shown in grid) ───────────────────────────────────────────────
type MeetState = "idle" | "loading" | "done" | "error";

function SlotBlock({ slot, dayIndex, compact }: { slot: ClassSlot; dayIndex: number; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [meetState, setMeetState] = useState<MeetState>("idle");
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const c = COLOR[slot.colorKey];
  const y = minToY(slot.startHour * 60 + slot.startMinute);
  const h = slot.durationMinutes * PX_PER_MIN;
  const nextOcc = getNextOccurrence(dayIndex, slot.startHour, slot.startMinute);
  const endDate = new Date(nextOcc.getTime() + slot.durationMinutes * 60000);

  // Auto-fetch meet link when popover opens
  useEffect(() => {
    if (!expanded || meetState !== "idle") return;
    setMeetState("loading");
    const params = new URLSearchParams({
      slot_id: slot.id,
      occurrence_iso: nextOcc.toISOString(),
      end_iso: endDate.toISOString(),
      title: slot.title,
      day_of_week: String(dayIndex),
    });
    fetch(`${API_BASE}/classes/sessions/next?${params}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((d) => { setMeetLink(d.meet_link); setMeetState("done"); })
      .catch(() => setMeetState("error"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  return (
    <div
      ref={ref}
      onClick={() => setExpanded(v => !v)}
      className="absolute left-1 right-1 rounded-lg overflow-hidden cursor-pointer select-none transition-shadow hover:shadow-md"
      style={{
        top: y + 2,
        height: h - 4,
        backgroundColor: c.bg,
        border: `1.5px solid ${c.border}`,
        zIndex: expanded ? 20 : 1,
      }}
    >
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ backgroundColor: c.border }} />

      <div className="pl-2.5 pr-1.5 py-1.5 h-full flex flex-col justify-between overflow-hidden">
        {compact ? (
          <p className="text-[9px] font-semibold leading-tight truncate" style={{ color: c.text }}>
            {slot.title.split("—")[0].trim()}
          </p>
        ) : (
          <>
            <div>
              <p className="text-[9px] font-semibold tracking-wider uppercase truncate" style={{ color: c.text }}>
                {slot.category}
              </p>
              {h > 36 && (
                <p className="text-[11px] font-medium leading-tight mt-0.5 line-clamp-2" style={{ color: "var(--st)" }}>
                  {slot.title}
                </p>
              )}
            </div>
            {h > 52 && (
              <p className="text-[9px] opacity-70" style={{ color: "var(--st2)" }}>
                {fmtTime(slot.startHour, slot.startMinute)}
              </p>
            )}
          </>
        )}
      </div>

      {/* Expanded popover */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            className="absolute left-0 top-full mt-1.5 w-64 rounded-xl shadow-xl border p-4 flex flex-col gap-3 z-50"
            style={{ backgroundColor: "var(--sb)", borderColor: "var(--sbr)" }}
          >
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: c.border }}>
                {slot.category}
              </p>
              <p className="font-heading font-medium text-base leading-snug" style={{ color: "var(--st)" }}>
                {slot.title}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--st2)" }}>
                {fmtTime(slot.startHour, slot.startMinute)} — {fmtTime(
                  Math.floor((slot.startHour * 60 + slot.startMinute + slot.durationMinutes) / 60),
                  (slot.startMinute + slot.durationMinutes) % 60
                )} · {slot.durationMinutes} min
              </p>
            </div>

            {meetState === "loading" && (
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--st2)" }}>
                <Loader2 size={12} className="animate-spin" /> Fetching meeting link…
              </div>
            )}
            {meetState === "done" && meetLink && (
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs font-medium px-3 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ backgroundColor: c.border, color: "var(--sb)" }}
              >
                <Video size={12} /> Join Google Meet
              </a>
            )}
            {meetState === "error" && (
              <div className="text-xs" style={{ color: "#e05a5a" }}>
                Could not load meeting link. Please try again later.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Current time indicator ───────────────────────────────────────────────────
function NowLine() {
  const [mins, setMins] = useState(() => nowToIstMins());
  useEffect(() => {
    const id = setInterval(() => setMins(nowToIstMins()), 30000);
    return () => clearInterval(id);
  }, []);

  if (mins < GRID_START_MIN || mins > GRID_END_MIN) return null;
  const y = minToY(mins);
  return (
    <div className="absolute left-0 right-0 pointer-events-none z-10 flex items-center" style={{ top: y }}>
      <div className="w-2.5 h-2.5 rounded-full shrink-0 -ml-1.5" style={{ backgroundColor: "var(--sp)" }} />
      <div className="flex-1 h-px" style={{ backgroundColor: "var(--sp)" }} />
    </div>
  );
}

// ── Time ruler ───────────────────────────────────────────────────────────────
function TimeRuler() {
  return (
    <div className="relative shrink-0" style={{ width: RULER_W, height: GRID_H }}>
      {HOUR_MARKS.map(h => (
        <div
          key={h}
          className="absolute right-2 text-right"
          style={{ top: minToY(h * 60) - 8, color: "var(--st2)" }}
        >
          <span className="text-[10px] font-medium">{fmtHour(h)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Grid lines ───────────────────────────────────────────────────────────────
function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {HOUR_MARKS.map(h => (
        <div
          key={h}
          className="absolute left-0 right-0 border-t"
          style={{ top: minToY(h * 60), borderColor: "var(--sbr)", opacity: 0.6 }}
        />
      ))}
    </div>
  );
}

// ── Week view ────────────────────────────────────────────────────────────────
function WeekView({ todayIdx }: { todayIdx: number }) {
  return (
    <div className="flex overflow-x-auto">
      {/* Time ruler */}
      <div className="sticky left-0 z-20 shrink-0" style={{ backgroundColor: "var(--sb)" }}>
        {/* header spacer */}
        <div style={{ height: 48 }} />
        <div className="relative" style={{ height: GRID_H }}>
          <TimeRuler />
        </div>
      </div>

      {/* Day columns */}
      <div className="flex flex-1 min-w-0">
        {COLUMNS.map(({ dayIndex, short, full, rest }) => {
          const isToday = dayIndex === todayIdx;
          const daySlots = schedule.filter(s => s.days.includes(dayIndex));
          return (
            <div key={dayIndex} className="flex flex-col flex-1 min-w-[100px]">
              {/* Column header */}
              <div
                className="sticky top-0 z-10 h-12 flex flex-col items-center justify-center gap-0.5 border-l"
                style={{
                  borderColor: "var(--sbr)",
                  backgroundColor: "var(--sb)",
                }}
              >
                <span className="text-[10px] font-semibold tracking-widest uppercase"
                  style={{ color: isToday ? "var(--sp)" : rest ? "var(--st2)" : "var(--st)", opacity: rest ? 0.5 : 1 }}>
                  {short}
                </span>
                {isToday && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--sp)" }} />}
              </div>

              {/* Column body */}
              <div
                className="relative flex-1 border-l"
                style={{ height: GRID_H, borderColor: "var(--sbr)", opacity: rest ? 0.35 : 1 }}
              >
                <GridLines />
                {!rest && daySlots.map(slot => (
                  <SlotBlock key={slot.id} slot={slot} dayIndex={dayIndex} compact />
                ))}
                {isToday && <NowLine />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Day view ─────────────────────────────────────────────────────────────────
function DayView({ dayIndex }: { dayIndex: number }) {
  const col = COLUMNS.find(c => c.dayIndex === dayIndex)!;
  const daySlots = schedule.filter(s => s.days.includes(dayIndex));
  const todayIdx = new Date().getDay();

  return (
    <div className="flex">
      {/* Ruler */}
      <div className="sticky left-0 shrink-0 z-10" style={{ backgroundColor: "var(--sb)" }}>
        <div style={{ height: 48 }} />
        <div className="relative" style={{ height: GRID_H }}>
          <TimeRuler />
        </div>
      </div>

      {/* Single day column */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="h-12 flex items-center px-4 border-l" style={{ borderColor: "var(--sbr)" }}>
          <span className="font-heading font-medium text-lg" style={{ color: "var(--st)" }}>
            {col.full}
            {col.rest && <span className="ml-2 text-xs font-sans" style={{ color: "var(--st2)" }}>Rest day</span>}
          </span>
        </div>
        <div className="relative flex-1 border-l" style={{ height: GRID_H, borderColor: "var(--sbr)", opacity: col.rest ? 0.35 : 1 }}>
          <GridLines />
          {!col.rest && daySlots.map(slot => (
            <SlotBlock key={slot.id} slot={slot} dayIndex={dayIndex} />
          ))}
          {dayIndex === todayIdx && <NowLine />}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function TimetablePage() {
  const [view, setView] = useState<"week" | "day">("week");
  const [activeDay, setActiveDay] = useState<number>(() => {
    const d = new Date().getDay();
    // If today is Mon (rest), default to Tue
    return d === 1 ? 2 : d;
  });
  const todayIdx = new Date().getDay();

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8" style={{ backgroundColor: "var(--sb)" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32, clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <h1 className="font-heading font-medium text-4xl md:text-5xl leading-none mb-3" style={{ color: "var(--st)" }}>
            Class <span className="italic" style={{ color: "var(--sp)" }}>Timetable</span>
          </h1>
          <p className="text-sm font-light max-w-sm leading-relaxed" style={{ color: "var(--st2)" }}>
            Click any class to see its Google Meet link. Times shown in your local timezone.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-3 mb-5"
        >
          {(Object.entries(COLOR) as [ClassSlot["colorKey"], typeof COLOR[keyof typeof COLOR]][]).map(([key, c]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c.border }} />
              <span className="text-xs capitalize" style={{ color: "var(--st2)" }}>
                {key === "yoga" ? "Yoga & Pranayama" : key === "meditation" ? "Breathing & Meditation" : "Sunday Workshop"}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-px" style={{ backgroundColor: "var(--sp)" }} />
            <span className="text-xs" style={{ color: "var(--st2)" }}>Now</span>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl border" style={{ borderColor: "var(--sbr)", backgroundColor: "var(--ss)" }}>
            {(["week", "day"] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 capitalize"
                style={{
                  backgroundColor: view === v ? "var(--sp)" : "transparent",
                  color: view === v ? "var(--sb)" : "var(--st2)",
                }}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Day selector (day view only) */}
          {view === "day" && (
            <div className="flex items-center gap-1 p-1 rounded-xl border flex-wrap" style={{ borderColor: "var(--sbr)", backgroundColor: "var(--ss)" }}>
              {COLUMNS.map(({ dayIndex, short, rest }) => {
                const isToday = dayIndex === todayIdx;
                const isActive = dayIndex === activeDay;
                return (
                  <button
                    key={dayIndex}
                    onClick={() => setActiveDay(dayIndex)}
                    disabled={rest}
                    className="relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isActive ? "var(--sp)" : "transparent",
                      color: isActive ? "var(--sb)" : rest ? "var(--st2)" : "var(--st)",
                      opacity: rest ? 0.4 : 1,
                    }}
                  >
                    {short}
                    {isToday && !isActive && (
                      <span className="absolute top-1 right-1 w-1 h-1 rounded-full" style={{ backgroundColor: "var(--sp)" }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "var(--sbr)", backgroundColor: "var(--sb)" }}
        >
          {view === "week"
            ? <WeekView todayIdx={todayIdx} />
            : <DayView dayIndex={activeDay} />
          }
        </motion.div>

        {/* Note */}
        <p className="mt-6 text-xs text-center leading-relaxed" style={{ color: "var(--st2)" }}>
          Monday is a full rest day. Not suitable for pregnant women, physically disabled, or those with movement restrictions.
        </p>
      </div>
    </main>
  );
}
