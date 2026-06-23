import { notFound } from "next/navigation";
import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type EventData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  logo_url: string;
  youtube_video_id: string;
  start_date: string;
  end_date: string;
};

async function getEvent(slug: string): Promise<EventData | null> {
  try {
    const res = await fetch(`${API_BASE}/events/${slug}`, { next: { revalidate: 60 } });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Not Found" };
  return {
    title: event.title,
    description: event.description || `Join us for ${event.title} — an Awakynn event.`,
    alternates: { canonical: `https://awakynn.com/${event.slug}` },
    openGraph: {
      title: `${event.title} – Awakynn`,
      description: event.description || `Join us for ${event.title}.`,
      url: `https://awakynn.com/${event.slug}`,
      images: event.logo_url ? [{ url: event.logo_url, width: 1200, height: 630, alt: event.title }] : [],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const now = new Date();
  const ended = new Date(event.end_date) < now;

  return (
    <main style={{ backgroundColor: "#faf8f5", color: "#222222" }}>
      {/* Hero */}
      <section
        className="grain relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
        style={{ backgroundColor: "#2F4F46" }}
      >
        <div className="relative z-10 flex flex-col items-center gap-5">
          <span
            className="block text-[0.65rem] font-medium tracking-[0.28em]"
            style={{ color: "#C8A86B" }}
          >
            {formatDate(event.start_date)}
            {" · "}
            {ended ? "EVENT ENDED" : "UPCOMING EVENT"}
          </span>
          {event.logo_url ? (
            <img
              src={event.logo_url}
              alt={event.title}
              className="h-20 w-auto object-contain"
            />
          ) : (
            <h1 className="font-display max-w-3xl text-5xl font-light leading-[0.95] text-white md:text-7xl">
              {event.title}
            </h1>
          )}
          {event.description && (
            <p
              className="max-w-xl text-base leading-relaxed"
              style={{ color: "rgba(250,248,245,0.65)" }}
            >
              {event.description}
            </p>
          )}
          {ended && (
            <span
              className="inline-flex items-center gap-2 border px-5 py-2.5 text-xs font-medium tracking-[0.2em] uppercase"
              style={{ borderColor: "rgba(250,248,245,0.3)", color: "rgba(250,248,245,0.5)" }}
            >
              This event has ended
            </span>
          )}
        </div>
      </section>

      {/* YouTube embed */}
      {event.youtube_video_id && (
        <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10">
          <div className="relative w-full overflow-hidden" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${event.youtube_video_id}`}
              title={event.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </section>
      )}

      {/* Event dates info */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 md:px-10">
        <div
          className="flex flex-col gap-4 border p-8 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "rgba(34,34,34,0.1)" }}
        >
          <div>
            <span
              className="block text-[0.65rem] font-medium tracking-[0.25em]"
              style={{ color: "#C8A86B" }}
            >
              EVENT DATES
            </span>
            <p className="font-display mt-3 text-2xl font-light" style={{ color: "#2F4F46" }}>
              {formatDate(event.start_date)} — {formatDate(event.end_date)}
            </p>
          </div>
          <a
            href="/contact"
            className="group inline-flex items-center justify-between gap-8 border px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#2F4F46] hover:!text-white"
            style={{ borderColor: "#2F4F46", color: "#2F4F46" }}
          >
            Get in touch
            <span className="transition-transform duration-300 group-hover:translate-x-1">&rsaquo;</span>
          </a>
        </div>
      </section>
    </main>
  );
}
