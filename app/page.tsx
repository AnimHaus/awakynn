import dynamic from "next/dynamic";
import Hero from "./components/Hero";
import BrandCards from "./components/BrandCards";
import InstructorSection from "./components/InstructorSection";

const HorizontalJourney = dynamic(() => import("./components/HorizontalJourney"));
const WellnessPathway = dynamic(() => import("./components/WellnessPathway"));
const OfferingsGallery = dynamic(() => import("./components/OfferingsGallery"));
const Testimonials = dynamic(() => import("./components/Testimonials"));

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