import type { Metadata } from "next";
import GalleryGrid from "./GalleryGrid";
import type { GalleryItem } from "./types";

const SITE_URL = "https://awakynn.com";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A glimpse into life at Awakynn — moments from our yoga classes, meditation sessions, and wellness gatherings in Chinsurah, Hooghly and beyond.",
  keywords: [
    "Awakynn gallery",
    "yoga photos Chinsurah",
    "yoga class photos Hooghly",
    "meditation photos West Bengal",
    "wellness photos Kolkata",
    "yoga studio photos India",
  ],
  alternates: { canonical: `${SITE_URL}/gallery` },
  openGraph: {
    title: "Gallery – Awakynn",
    description:
      "Moments from our yoga classes, meditation sessions and wellness gatherings.",
    url: `${SITE_URL}/gallery`,
    images: [{ url: `${SITE_URL}/og.jpg`, width: 1200, height: 630, alt: "Awakynn Gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery – Awakynn",
    description: "Moments from our yoga classes, meditation and wellness sessions.",
    images: [`${SITE_URL}/og.jpg`],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Gallery", item: `${SITE_URL}/gallery` },
  ],
};

export default async function GalleryPage() {
  let items: GalleryItem[] = [];
  try {
    const res = await fetch(`${API_BASE}/gallery/?visible_only=true`, {
      next: { revalidate: 60 },
    });
    if (res.ok) items = await res.json();
  } catch {
    // render empty gracefully
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--sb)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Page header */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 pt-32 pb-10">
        <h1
          className="font-heading font-light leading-[0.95]"
          style={{ color: "var(--st)", fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
        >
          Our
          <br />
          <span className="italic" style={{ color: "var(--sp)" }}>
            Gallery
          </span>
        </h1>
        <p
          className="mt-5 max-w-sm text-sm leading-relaxed"
          style={{ color: "var(--st2)" }}
        >
          Moments from our classes, sessions and gatherings — a window into the
          Awakynn community.
        </p>
      </section>

      {/* Gallery grid */}
      <section className="mx-auto max-w-[1400px] px-4 md:px-8 pb-32">
        <GalleryGrid items={items} />
      </section>
    </main>
  );
}
