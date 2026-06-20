import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "./components/Hero";
import BrandCards from "./components/BrandCards";
import InstructorSection from "./components/InstructorSection";

const HorizontalJourney = dynamic(() => import("./components/HorizontalJourney"));
const WellnessPathway = dynamic(() => import("./components/WellnessPathway"));
const OfferingsGallery = dynamic(() => import("./components/OfferingsGallery"));
const Testimonials = dynamic(() => import("./components/Testimonials"));

export const metadata: Metadata = {
  title: "Awakynn – Yoga, Meditation & Ayurvedic Wellness",
  description:
    "Awakynn offers online and in-person yoga classes, guided meditation, pranayama, Ayurvedic diet consulting, mantra chanting, and 1-on-1 mental clarity sessions — for all ages and levels.",
  alternates: { canonical: "https://awakynn.com" },
  openGraph: {
    title: "Awakynn – Yoga, Meditation & Ayurvedic Wellness",
    description:
      "Online and in-person yoga, meditation, pranayama, Ayurvedic diet consulting, and mental clarity sessions for all ages and levels.",
    url: "https://awakynn.com",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <OfferingsGallery />
      <InstructorSection />
      <HorizontalJourney />
      <BrandCards />
      <WellnessPathway />
      <Testimonials />
    </main>
  );
}