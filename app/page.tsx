import Hero from "./components/Hero";
import BrandCards from "./components/BrandCards";
import HorizontalJourney from "./components/HorizontalJourney";
import WellnessPathway from "./components/WellnessPathway";
import OfferingsGallery from "./components/OfferingsGallery";
import JournalSection from "./components/JournalSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <BrandCards />
      <HorizontalJourney />
      <WellnessPathway />
      <OfferingsGallery />
      <JournalSection />
    </main>
  );
}