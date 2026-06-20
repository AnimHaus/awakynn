import type { Metadata } from "next";
import ClassSessionList, { type ClassSession } from "./ClassSessionList";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const metadata: Metadata = {
  title: "Live Yoga & Meditation Class Schedule",
  description:
    "Browse and join Awakynn's scheduled live yoga, meditation, pranayama, and breathwork classes on Google Meet. New sessions added weekly — open to all ages and experience levels.",
  keywords: [
    "live yoga classes schedule",
    "online yoga timetable",
    "yoga Google Meet India",
    "meditation schedule online",
    "pranayama classes India",
    "beginner yoga online",
    "yoga for seniors schedule",
    "Awakynn class schedule",
  ],
  alternates: { canonical: "https://awakynn.com/classes" },
  openGraph: {
    title: "Live Yoga & Meditation Schedule – Awakynn",
    description:
      "Scheduled live yoga, meditation, pranayama, and breathwork classes via Google Meet. New sessions weekly — all levels welcome.",
    url: "https://awakynn.com/classes",
    images: [{ url: "https://awakynn.com/og.jpg", width: 1200, height: 630, alt: "Awakynn Live Classes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Yoga & Meditation Schedule – Awakynn",
    description: "Scheduled live yoga, meditation and breathwork classes on Google Meet. All levels welcome.",
    images: ["https://awakynn.com/og.jpg"],
  },
};

export default async function ClassesPage() {
  let sessions: ClassSession[] = [];
  let error = false;
  try {
    const res = await fetch(`${API_BASE}/classes/sessions/board`, {
      next: { revalidate: 30 },
    });
    if (res.ok) sessions = await res.json();
    else error = true;
  } catch {
    error = true;
  }

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 md:px-14" style={{ backgroundColor: "#faf8f5" }}>
      <div className="max-w-[900px] mx-auto">
        <div className="mb-14">
          <h1 className="font-display text-5xl md:text-7xl font-light leading-[0.95] text-forest">
            Class <span className="italic text-gold">Board</span>
          </h1>
          <p className="mt-4 text-sm font-light max-w-sm leading-relaxed" style={{ color: "#7a6a5a" }}>
            Scheduled classes — join via Google Meet. Times shown in your local timezone.
          </p>
        </div>
        <ClassSessionList sessions={sessions} serverTime={Date.now()} error={error} />
      </div>
    </main>
  );
}
