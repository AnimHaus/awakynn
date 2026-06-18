"use client";

import { useRef, useEffect, useState } from "react";
import { useSeasonContext } from "./SeasonProvider";

const seasonVideos: Record<string, string> = {
  summer: "https://cdn.awakynn.com/summer.mp4",
  monsoon: "https://cdn.awakynn.com/monsoon.mp4",
  autumn: "https://pub-0b947e01d36c4316b149e9a8f91919c7.r2.dev/autumn.mp4",
  winter: "https://cdn.awakynn.com/winter.mp4",
};

export default function Hero() {
  const { season, setHeroVideoActive } = useSeasonContext();
  const videoSrc = seasonVideos[season];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollable = containerRef.current.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      setScrollProgress(progress);
      const containerInView = rect.bottom > 0;
      setHeroVideoActive(containerInView && progress > 0.25);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setHeroVideoActive]);

  const maskScale = 1 + scrollProgress * 28;        // logo window grows aggressively
  const videoCounterScale = 1 / maskScale;           // video stays cover-fit
  const textOpacity = Math.max(0, 1 - scrollProgress / 0.2);
  const cardsOpacity = Math.max(0, (scrollProgress - 0.45) / 0.15);
  // Fade out between 25%–45% scroll → complete by ~1.5 viewport heights
  const maskOpacity = Math.max(0, 1 - (scrollProgress - 0.25) / 0.2);

  return (
    <div ref={containerRef} className="relative" style={{ height: "350vh" }}>
      <section
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: "var(--sb)" }}
      >
        {/* ── Background video (fades in as logo fades out) ────── */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 0, opacity: 1 - maskOpacity }}
        >
          <video
            key={videoSrc}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className="absolute"
          style={{
            // Base size — large enough so the logo reads clearly
            width: "clamp(380px, 58vw, 1200px)",
            height: "clamp(380px, 58vw, 1200px)",
            // Mask punches the logo shape into this div
            WebkitMaskImage: "url(/logo.png)",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: "url(/logo.png)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            // Scale the window — grows the hole
            transform: `scale(${maskScale})`,
            // Fade out the logo mask as it scales
            opacity: isLoaded ? maskOpacity : 0,
            transition: 'opacity 0.2s ease-out, transform 0.1s ease-out',
            zIndex: 1,
          }}
        >
          {/* Video counter-scaled so it always looks fullscreen */}
          <div
            style={{
              position: "absolute",
              // Expand to viewport size then counter-scale back
              width: "100vw",
              height: "100vh",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${videoCounterScale})`,
              transformOrigin: "center center",
            }}
          >
            <video
              key={videoSrc}
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* ── Text layer ─────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex items-center justify-between px-6 md:px-12 lg:px-20 pointer-events-none"
          style={{ zIndex: 2, opacity: textOpacity }}
        >
          <div
            className={`text-left transition-all duration-700 ease-out ${
              isLoaded ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            <h1
              className="font-heading font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight max-w-md"
              style={{ color: "var(--st)" }}
            >
              Experience that{" "}
              <span className="italic" style={{ color: "var(--sp)" }}>
                awakens.
              </span>
            </h1>
          </div>

          <div
            className={`text-right transition-all duration-700 ease-out delay-300 ${
              isLoaded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
          >
            <p
              className="text-base md:text-lg leading-relaxed mb-6 max-w-sm ml-auto"
              style={{ color: "var(--st2)" }}
            >
              Our role is to guide you back to yourself — transforming ancient wisdom
              into modern practice that breathes, flows, and evolves with you.
            </p>
            <a
              href="#offerings"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 pointer-events-auto"
              style={{ backgroundColor: "var(--sp)", color: "var(--sb)" }}
            >
              Discover Offerings
            </a>
          </div>
        </div>

        {/* ── Cards layer ────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex items-end justify-center pb-16 px-6"
          style={{
            zIndex: 3,
            opacity: cardsOpacity,
            pointerEvents: cardsOpacity > 0.5 ? "auto" : "none",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {[
              {
                title: "Yoga & Asanas",
                body: "Ancient postures designed to align body, breath, and mind in perfect harmony.",
              },
              {
                title: "Meditation",
                body: "Journey inward through guided practices that quiet the noise and awaken clarity.",
              },
              {
                title: "Ayurvedic Diet",
                body: "Personalized nutrition rooted in ancient wisdom, balancing your unique constitution.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="backdrop-blur-md rounded-2xl p-6 border"
                style={{
                  backgroundColor: season === "monsoon" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.45)",
                  borderColor: season === "monsoon" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)",
                }}
              >
                <h3 className="font-heading text-2xl mb-3" style={{ color: "white" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}