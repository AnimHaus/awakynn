"use client";

import { useState, useEffect, useRef } from "react";
import { Video, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Time helpers ────────────────────────────────────────────────────────────
const IST_OFFSET_MINS = 330;

function istToLocalDate(istH: number, istM: number): Date {
  const totalUtcMins = ((istH * 60 + istM - IST_OFFSET_MINS) % 1440 + 1440) % 1440;
  const d = new Date();
  d.setUTCHours(Math.floor(totalUtcMins / 60), totalUtcMins % 60, 0, 0);
  return d;
}

function fmtLocalTime(istH: number, istM: number): string {
  return istToLocalDate(istH, istM).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function nowToIstMins(): number {
  const d = new Date();
  return ((d.getUTCHours() * 60 + d.getUTCMinutes() + IST_OFFSET_MINS) % 1440);
}

// ── Schedule data ─────────────────────────────────────────────────────────
type ClassSlot = {
  id: string;
  title: string;
  category: string;
  days: number[];
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  colorKey: "yoga" | "meditation" | "workshop";
};

const COLOR: Record<ClassSlot["colorKey"], { bg: string; border: string; text: string }> = {
  yoga:       { bg: "rgba(47,79,70,0.12)",   border: "#2F4F46", text: "#2F4F46" },
  meditation: { bg: "rgba(200,168,107,0.13)", border: "#C8A86B", text: "#8a6a2e" },
  workshop:   { bg: "rgba(59,49,43,0.10)",   border: "#3B312B", text: "#3B312B" },
};

const schedule: ClassSlot[] = [
  { id:"yoga-morning",  title:"Yoga — Asana & Pranayama", category:"Movement & Breath",  days:[2,4,6,0], startHour:8,  startMinute:0,  durationMinutes:60, colorKey:"yoga"       },
  { id:"workshop",      title:"Sunday Workshop",           category:"Community Practice", days:[0],       startHour:10, startMinute:0,  durationMinutes:60, colorKey:"workshop"   },
  { id:"yoga-midday",   title:"Yoga — Asana & Pranayama", category:"Movement & Breath",  days:[2,4,6,0], startHour:11, startMinute:0,  durationMinutes:60, colorKey:"yoga"       },
  { id:"yoga-evening1", title:"Yoga — Asana & Pranayama", category:"Movement & Breath",  days:[2,4,6,0], startHour:17, startMinute:0,  durationMinutes:60, colorKey:"yoga"       },
  { id:"yoga-evening2", title:"Yoga — Asana & Pranayama", category:"Movement & Breath",  days:[2,4,6,0], startHour:18, startMinute:15, durationMinutes:60, colorKey:"yoga"       },
  { id:"yoga-evening3", title:"Yoga — Asana & Pranayama", category:"Movement & Breath",  days:[2,4,6,0], startHour:19, startMinute:30, durationMinutes:60, colorKey:"yoga"       },
  { id:"meditation",    title:"Breathing & Meditation",   category:"Inner Stillness",    days:[2,5],     startHour:20, startMinute:30, durationMinutes:45, colorKey:"meditation" },
];

const COLUMNS = [
  { dayIndex: 1, short: "Mon", full: "Monday",    rest: true  },
  { dayIndex: 2, short: "Tue", full: "Tuesday",   rest: false },
  { dayIndex: 3, short: "Wed", full: "Wednesday", rest: false },
  { dayIndex: 4, short: "Thu", full: "Thursday",  rest: false },
  { dayIndex: 5, short: "Fri", full: "Friday",    rest: false },
  { dayIndex: 6, short: "Sat", full: "Saturday",  rest: false },
  { dayIndex: 0, short: "Sun", full: "Sunday",    rest: false },
];

// ── Grid constants ────────────────────────────────────────────────────────
const GRID_START_MIN = 7 * 60;
const GRID_END_MIN   = 21 * 60 + 30;
const TOTAL_MIN      = GRID_END_MIN - GRID_START_MIN;
const PX_PER_MIN     = 1.4;
const GRID_H         = TOTAL_MIN * PX_PER_MIN;
const RULER_W        = 52;

const HOUR_MARKS: number[] = [];
for (let h = 8; h <= 21; h++) HOUR_MARKS.push(h);

function minToY(absMins: number) {
  return (absMins - GRID_START_MIN) * PX_PER_MIN;
}
function fmtHour(istH: number) { return fmtLocalTime(istH, 0); }
function fmtTime(istH: number, istM: number) { return fmtLocalTime(istH, istM); }

// ── Meet helper ───────────────────────────────────────────────────────────
function getNextOccurrence(dayOfWeek: number, istHour: number, istMinute: number): Date {
  const nowUtcMins = nowToIstMins();
  const nowIstDay = new Date().getUTCDay();
  let daysAhead = (dayOfWeek - nowIstDay + 7) % 7;
  if (daysAhead === 0 && istHour * 60 + istMinute <= nowUtcMins) daysAhead = 7;
  const totalUtcMins = ((istHour * 60 + istMinute - IST_OFFSET_MINS) % 1440 + 1440) % 1440;
  const target = new Date();
  target.setUTCHours(Math.floor(totalUtcMins / 60), totalUtcMins % 60, 0, 0);
  target.setUTCDate(target.getUTCDate() + daysAhead);
  return target;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ── Slot block ────────────────────────────────────────────────────────────
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
      .then(async (r) => { if (!r.ok) throw new Error(await r.text()); return r.json(); })
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
      className="absolute left-1 right-1 overflow-hidden cursor-pointer select-none transition-shadow hover:shadow-md"
      style={{
        top: y + 2,
        height: h - 4,
        backgroundColor: c.bg,
        borderLeft: `2px solid ${c.border}`,
        zIndex: expanded ? 20 : 1,
      }}
    >
      <div className="pl-2.5 pr-1.5 py-1.5 h-full flex flex-col justify-between overflow-hidden">
        {compact ? (
          <p className="text-[9px] font-semibold leading-tight truncate tracking-wide" style={{ color: c.text }}>
            {slot.title.split("—")[0].trim()}
          </p>
        ) : (
          <>
            <div>
              <p className="text-[9px] font-medium tracking-[0.18em] uppercase truncate" style={{ color: c.border }}>
                {slot.category}
              </p>
              {h > 36 && (
                <p className="text-[11px] font-medium leading-tight mt-0.5 line-clamp-2" style={{ color: "#222" }}>
                  {slot.title}
                </p>
              )}
            </div>
            {h > 52 && (
              <p className="text-[9px] opacity-60" style={{ color: "#222" }}>
                {fmtTime(slot.startHour, slot.startMinute)}
              </p>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            className="absolute left-0 top-full mt-2 w-64 border p-5 flex flex-col gap-3 z-50 shadow-xl"
            style={{ backgroundColor: "#faf8f5", borderColor: "#2F4F46" }}
          >
            <div>
              <p className="text-[0.62rem] font-medium tracking-[0.28em] uppercase mb-1.5" style={{ color: c.border }}>
                {slot.category}
              </p>
              <p className="font-display text-base font-light leading-snug" style={{ color: "#2F4F46" }}>
                {slot.title}
              </p>
              <p className="text-xs mt-1.5" style={{ color: "#7a6a5a" }}>
                {fmtTime(slot.startHour, slot.startMinute)} — {fmtTime(
                  Math.floor((slot.startHour * 60 + slot.startMinute + slot.durationMinutes) / 60),
                  (slot.startMinute + slot.durationMinutes) % 60
                )} · {slot.durationMinutes} min
              </p>
            </div>

            {meetState === "loading" && (
              <div className="flex items-center gap-2 text-xs" style={{ color: "#7a6a5a" }}>
                <Loader2 size={12} className="animate-spin" /> Fetching meeting link…
              </div>
            )}
            {meetState === "done" && meetLink && (
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-[0.7rem] font-medium tracking-[0.18em] uppercase px-4 py-2.5 border transition-all duration-300 hover:bg-forest hover:text-white"
                style={{ borderColor: "#2F4F46", color: "#2F4F46" }}
              >
                <Video size={11} /> Join Google Meet
              </a>
            )}
            {meetState === "error" && (
              <p className="text-xs" style={{ color: "#b94040" }}>
                Could not load meeting link. Please try again later.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Now line ──────────────────────────────────────────────────────────────
function NowLine() {
  const [mins, setMins] = useState(() => nowToIstMins());
  useEffect(() => {
    const id = setInterval(() => setMins(nowToIstMins()), 30000);
    return () => clearInterval(id);
  }, []);
  if (mins < GRID_START_MIN || mins > GRID_END_MIN) return null;
  return (
    <div className="absolute left-0 right-0 pointer-events-none z-10 flex items-center" style={{ top: minToY(mins) }}>
      <div className="w-2 h-2 rounded-full shrink-0 -ml-1" style={{ backgroundColor: "#C8A86B" }} />
      <div className="flex-1 h-px" style={{ backgroundColor: "#C8A86B" }} />
    </div>
  );
}

// ── Time ruler ────────────────────────────────────────────────────────────
function TimeRuler() {
  return (
    <div className="relative shrink-0" style={{ width: RULER_W, height: GRID_H }}>
      {HOUR_MARKS.map(h => (
        <div key={h} className="absolute right-2 text-right" style={{ top: minToY(h * 60) - 8 }}>
          <span className="text-[10px] tracking-wide" style={{ color: "#7a6a5a" }}>{fmtHour(h)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Grid lines ────────────────────────────────────────────────────────────
function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {HOUR_MARKS.map(h => (
        <div
          key={h}
          className="absolute left-0 right-0 border-t"
          style={{ top: minToY(h * 60), borderColor: "rgba(59,49,43,0.1)" }}
        />
      ))}
    </div>
  );
}

// ── Week view ─────────────────────────────────────────────────────────────
function WeekView({ todayIdx }: { todayIdx: number }) {
  return (
    <div className="flex overflow-x-auto">
      <div className="sticky left-0 z-20 shrink-0" style={{ backgroundColor: "#faf8f5" }}>
        <div style={{ height: 48 }} />
        <div className="relative" style={{ height: GRID_H }}>
          <TimeRuler />
        </div>
      </div>
      <div className="flex flex-1 min-w-0">
        {COLUMNS.map(({ dayIndex, short, rest }) => {
          const isToday = dayIndex === todayIdx;
          const daySlots = schedule.filter(s => s.days.includes(dayIndex));
          return (
            <div key={dayIndex} className="flex flex-col flex-1 min-w-[100px]">
              <div
                className="sticky top-0 z-10 h-12 flex flex-col items-center justify-center gap-0.5 border-l"
                style={{ borderColor: "rgba(59,49,43,0.12)", backgroundColor: "#faf8f5" }}
              >
                <span
                  className="text-[10px] font-medium tracking-[0.22em] uppercase"
                  style={{ color: isToday ? "#C8A86B" : rest ? "rgba(59,49,43,0.35)" : "#3B312B" }}
                >
                  {short}
                </span>
                {isToday && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#C8A86B" }} />}
              </div>
              <div
                className="relative flex-1 border-l"
                style={{ height: GRID_H, borderColor: "rgba(59,49,43,0.12)", opacity: rest ? 0.3 : 1 }}
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

// ── Day view ──────────────────────────────────────────────────────────────
function DayView({ dayIndex }: { dayIndex: number }) {
  const col = COLUMNS.find(c => c.dayIndex === dayIndex)!;
  const daySlots = schedule.filter(s => s.days.includes(dayIndex));
  const todayIdx = new Date().getDay();
  return (
    <div className="flex">
      <div className="sticky left-0 shrink-0 z-10" style={{ backgroundColor: "#faf8f5" }}>
        <div style={{ height: 48 }} />
        <div className="relative" style={{ height: GRID_H }}>
          <TimeRuler />
        </div>
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="h-12 flex items-center px-4 border-l" style={{ borderColor: "rgba(59,49,43,0.12)" }}>
          <span className="font-display text-lg font-light" style={{ color: "#2F4F46" }}>
            {col.full}
            {col.rest && <span className="ml-3 font-sans text-xs tracking-widest uppercase" style={{ color: "#7a6a5a" }}>Rest day</span>}
          </span>
        </div>
        <div className="relative flex-1 border-l" style={{ height: GRID_H, borderColor: "rgba(59,49,43,0.12)", opacity: col.rest ? 0.3 : 1 }}>
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

// ── Page ──────────────────────────────────────────────────────────────────
export default function TimetablePage() {
  const [view, setView] = useState<"week" | "day">("week");
  const [activeDay, setActiveDay] = useState<number>(() => {
    const d = new Date().getDay();
    return d === 1 ? 2 : d;
  });
  const todayIdx = new Date().getDay();

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 md:px-14" style={{ backgroundColor: "#faf8f5" }}>
      <div className="max-w-[1500px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h1 className="font-display mt-3 text-5xl md:text-7xl font-light leading-[0.95] text-forest">
            Class <span className="italic text-gold">Timetable</span>
          </h1>
          <p className="mt-4 text-sm font-light max-w-sm leading-relaxed" style={{ color: "#7a6a5a" }}>
            Click any class to see its Google Meet link. Times shown in your local timezone.
          </p>
        </motion.div>

        {/* Legend + controls row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          {/* Legend */}
          <div className="flex flex-wrap gap-5">
            {(Object.entries(COLOR) as [ClassSlot["colorKey"], typeof COLOR[keyof typeof COLOR]][]).map(([key, c]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-3 border-l-2" style={{ borderColor: c.border, backgroundColor: c.bg }} />
                <span className="text-[0.68rem] tracking-[0.18em] uppercase font-medium" style={{ color: "#7a6a5a" }}>
                  {key === "yoga" ? "Yoga & Pranayama" : key === "meditation" ? "Breathing & Meditation" : "Sunday Workshop"}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-3 h-px" style={{ backgroundColor: "#C8A86B" }} />
              <span className="text-[0.68rem] tracking-[0.18em] uppercase font-medium" style={{ color: "#7a6a5a" }}>Now</span>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0 border" style={{ borderColor: "#2F4F46" }}>
            {(["week", "day"] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-5 py-2 text-[0.68rem] font-medium tracking-[0.2em] uppercase transition-all duration-200"
                style={{
                  backgroundColor: view === v ? "#2F4F46" : "transparent",
                  color: view === v ? "#faf8f5" : "#2F4F46",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Day selector (day view) */}
        {view === "day" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-1 mb-6"
          >
            {COLUMNS.map(({ dayIndex, short, rest }) => {
              const isToday = dayIndex === todayIdx;
              const isActive = dayIndex === activeDay;
              return (
                <button
                  key={dayIndex}
                  onClick={() => !rest && setActiveDay(dayIndex)}
                  disabled={rest}
                  className="relative px-4 py-2 text-[0.68rem] font-medium tracking-[0.2em] uppercase border transition-all duration-200 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isActive ? "#2F4F46" : "transparent",
                    borderColor: isActive ? "#2F4F46" : rest ? "rgba(59,49,43,0.2)" : "rgba(59,49,43,0.35)",
                    color: isActive ? "#faf8f5" : rest ? "rgba(59,49,43,0.3)" : "#3B312B",
                  }}
                >
                  {short}
                  {isToday && !isActive && (
                    <span className="absolute top-1 right-1 w-1 h-1 rounded-full" style={{ backgroundColor: "#C8A86B" }} />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="border overflow-hidden"
          style={{ borderColor: "rgba(59,49,43,0.18)", backgroundColor: "#faf8f5" }}
        >
          {view === "week"
            ? <WeekView todayIdx={todayIdx} />
            : <DayView dayIndex={activeDay} />
          }
        </motion.div>

        {/* Note */}
        <p className="mt-6 text-[0.68rem] tracking-[0.12em] text-center uppercase" style={{ color: "#7a6a5a" }}>
          Monday is a full rest day · Not suitable for pregnant women or those with movement restrictions
        </p>
      </div>
    </main>
  );
}