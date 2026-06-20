import type { Metadata } from "next";
import ClassSessionList, { type ClassSession } from "./ClassSessionList";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const metadata: Metadata = {
  title: "Live Classes",
  description:
    "Browse scheduled Awakynn yoga, meditation, and breathwork classes. Join live via Google Meet — no experience required.",
  alternates: { canonical: "https://awakynn.com/classes" },
  openGraph: {
    title: "Awakynn Live Classes",
    description:
      "Scheduled yoga, meditation, pranayama, and breathing classes on Google Meet. Open to all levels.",
    url: "https://awakynn.com/classes",
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
