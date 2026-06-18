import Hero from "./components/Hero";
import MarqueeStrip from "./components/MarqueeStrip";
import OfferingsSection from "./components/OfferingsSection";
import PhilosophySection from "./components/PhilosophySection";
import ScheduleSection from "./components/ScheduleSection";
import AboutSection from "./components/AboutSection";
import SisterBrandsSection from "./components/SisterBrandsSection";
import CTASection from "./components/CTASection";

export default function Home() {
  return (
    <main>
      <Hero />
      <MarqueeStrip />
      <OfferingsSection />
      <PhilosophySection />
      <ScheduleSection />
      <AboutSection />
      <SisterBrandsSection />
      <CTASection />
    </main>
  );
}


