import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "./components/Hero";
import BrandCards from "./components/BrandCards";
import InstructorSection from "./components/InstructorSection";

const HorizontalJourney = dynamic(() => import("./components/HorizontalJourney"));
const WellnessPathway = dynamic(() => import("./components/WellnessPathway"));
const OfferingsGallery = dynamic(() => import("./components/OfferingsGallery"));
const Testimonials = dynamic(() => import("./components/Testimonials"));

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type ApprovedTestimonial = {
  id: string;
  name: string;
  age: number | null;
  note: string;
  message: string;
};

export const metadata: Metadata = {
  title: "Awakynn – Yoga, Meditation & Ayurvedic Wellness",
  description:
    "Awakynn offers online and in-person yoga classes, guided meditation, pranayama, Ayurvedic diet consulting, mantra chanting, and 1-on-1 mental clarity sessions — for all ages, all levels, with certified instructors.",
  keywords: [
    "yoga classes online India",
    "yoga for beginners",
    "yoga for seniors",
    "yoga for arthritis",
    "online yoga classes",
    "guided meditation online",
    "pranayama classes",
    "Ayurvedic diet consulting",
    "mantra chanting online",
    "mental clarity sessions",
    "live yoga Google Meet",
    "Awakynn yoga",
    "Monalisa yoga teacher",
    "wellness India",
  ],
  alternates: { canonical: "https://awakynn.com" },
  openGraph: {
    title: "Awakynn – Yoga, Meditation & Ayurvedic Wellness",
    description:
      "Online and in-person yoga, meditation, pranayama, Ayurvedic diet consulting, and mental clarity sessions for all ages and levels.",
    url: "https://awakynn.com",
    images: [{ url: "https://awakynn.com/og.jpg", width: 1200, height: 630, alt: "Awakynn – Awaken Within" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Awakynn – Yoga, Meditation & Ayurvedic Wellness",
    description: "Online yoga, meditation, pranayama, Ayurvedic diet consulting and mental clarity sessions for all ages.",
    images: ["https://awakynn.com/og.jpg"],
  },
};

export default async function Home() {
  let approvedTestimonials: ApprovedTestimonial[] = [];
  try {
    const res = await fetch(`${API_BASE}/contact/testimonials/approved`, {
      next: { revalidate: 300 },
    });
    if (res.ok) approvedTestimonials = await res.json();
  } catch {
    // silently fall back to hardcoded testimonials
  }

  return (
    <main>
      <Hero />
      <OfferingsGallery />
      <InstructorSection />
      <HorizontalJourney />
      <BrandCards />
      <WellnessPathway />
      <Testimonials serverTestimonials={approvedTestimonials} />
    </main>
  );
}