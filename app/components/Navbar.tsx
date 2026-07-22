"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import TransitionLink from "./TransitionLink";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type ActiveEvent = {
  slug: string;
  title: string;
  logo_url: string;
  end_date: string;
};

function useActiveEvent() {
  const [event, setEvent] = useState<ActiveEvent | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/events/active`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        const ended = new Date(data.end_date) < new Date();
        if (!ended && data.logo_url) setEvent(data);
      })
      .catch(() => {});
  }, []);

  return event;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const activeEvent = useActiveEvent();

  // Some pages always use the scrolled (dark) appearance regardless of scroll
  const alwaysDark = pathname !== "/" && pathname !== "/yoga-day";
  const isDark = alwaysDark || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On hero (top): white text on dark image. After scroll / on inner pages: dark frosted bar.
  const navTextColor = isDark ? "var(--st)" : "rgba(255,255,255,0.92)";

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: isDark
          ? "color-mix(in srgb, var(--sb) 88%, transparent)"
          : "transparent",
        borderBottom: isDark ? "1px solid var(--sbr)" : "1px solid transparent",
        backdropFilter: isDark ? "blur(20px) saturate(1.5)" : "none",
        WebkitBackdropFilter: isDark ? "blur(20px) saturate(1.5)" : "none",
      }}
    >
      <nav className="mx-auto max-w-[1500px] px-6 md:px-14 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <TransitionLink href="/" className="flex items-center">
            <Image
              src="/logo_gold.png"
              alt="Awakynn"
              width={120}
              height={36}
              className="h-12 md:h-16 w-auto object-contain"
              priority
            />
          </TransitionLink>
          {activeEvent && (
            <>
              <span className="text-white" style={{ color: navTextColor }}>|</span>
              <TransitionLink
                href={`/${activeEvent.slug}`}
                className="flex flex-col items-center gap-0.5 transition-opacity duration-300 hover:opacity-60"
              >
                <Image
                  src={activeEvent.logo_url}
                  alt={activeEvent.title}
                  width={90}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              </TransitionLink>
            </>
          )}

        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <TransitionLink
            href="/classes"
            className="text-[0.72rem] font-medium tracking-[0.22em] uppercase transition-colors duration-300 hover:opacity-60"
            style={{ color: navTextColor }}
          >
            Classes
          </TransitionLink>
          <TransitionLink
            href="/gallery"
            className="text-[0.72rem] font-medium tracking-[0.22em] uppercase transition-colors duration-300 hover:opacity-60"
            style={{ color: navTextColor }}
          >
            Gallery
          </TransitionLink>
          <TransitionLink
            href="/register"
            className="text-[0.72rem] font-medium tracking-[0.22em] uppercase transition-colors duration-300 hover:opacity-60"
            style={{ color: navTextColor }}
          >
            Register
          </TransitionLink>
          <TransitionLink
            href="/contact"
            className="ml-2 flex items-center justify-between gap-6 px-5 py-2.5 border text-[0.72rem] font-medium tracking-[0.22em] uppercase transition-all duration-300"
            style={{
              borderColor: isDark ? "var(--st)" : "rgba(255,255,255,0.75)",
              color: navTextColor,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = isDark ? "var(--st)" : "rgba(255,255,255,1)";
              el.style.color = isDark ? "var(--sb)" : "#000";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = "transparent";
              el.style.color = navTextColor;
            }}
          >
            Share your story
          </TransitionLink>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-px w-full transition-all duration-300 origin-center"
            style={{
              backgroundColor: navTextColor,
              transform: open ? "translateY(7px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block h-px w-full transition-all duration-300"
            style={{
              backgroundColor: navTextColor,
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block h-px w-full transition-all duration-300 origin-center"
            style={{
              backgroundColor: navTextColor,
              transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500"
        style={{
          maxHeight: open ? "400px" : "0px",
          backgroundColor: "color-mix(in srgb, var(--sb) 96%, transparent)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: open ? "1px solid var(--sbr)" : "none",
        }}
      >
        <div className="px-6 pt-5 pb-7 flex flex-col gap-5">
          <TransitionLink
            href="/classes"
            className="text-xs font-medium tracking-[0.22em] uppercase py-1 transition-opacity hover:opacity-60"
            style={{ color: "var(--st)" }}
            onClick={() => setOpen(false)}
          >
            Classes
          </TransitionLink>
          <TransitionLink
            href="/gallery"
            className="text-xs font-medium tracking-[0.22em] uppercase py-1 transition-opacity hover:opacity-60"
            style={{ color: "var(--st)" }}
            onClick={() => setOpen(false)}
          >
            Gallery
          </TransitionLink>
          {activeEvent && (
            <TransitionLink
              href={`/${activeEvent.slug}`}
              className="flex flex-col items-start gap-0.5 py-1 transition-opacity hover:opacity-60"
              onClick={() => setOpen(false)}
            >
              <Image
                src={activeEvent.logo_url}
                alt={activeEvent.title}
                width={90}
                height={36}
                className="h-9 w-auto object-contain"
              />
            </TransitionLink>
          )}
          <TransitionLink
            href="/register"
            className="text-xs font-medium tracking-[0.22em] uppercase py-1 transition-opacity hover:opacity-60"
            style={{ color: "var(--st)" }}
            onClick={() => setOpen(false)}
          >
            Register
          </TransitionLink>
          <TransitionLink
            href="/contact"
            className="mt-1 flex items-center justify-between px-5 py-3 border text-xs font-medium tracking-[0.22em] uppercase"
            style={{ borderColor: "var(--st)", color: "var(--st)" }}
            onClick={() => setOpen(false)}
          >
            Share your story <span>›</span>
          </TransitionLink>
        </div>
      </div>
    </header>
  );
}