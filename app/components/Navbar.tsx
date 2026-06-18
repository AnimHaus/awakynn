"use client";

import { useState, useEffect } from "react";
import TransitionLink from "./TransitionLink";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "color-mix(in srgb, var(--sb) 30%, transparent)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--sbr)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.4)" : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <TransitionLink href="/" className="flex items-center">
          <Image
            src="/logo_gold.png"
            alt="Awakynn"
            width={120}
            height={36}
            className="h-16 w-auto object-contain"
            priority
          />
        </TransitionLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <TransitionLink
            href="/timetable"
            className="text-sm font-medium tracking-wide transition-colors"
            style={{ color: "var(--st)" }}
          >
            Timetable
          </TransitionLink>
          <a
            href="#contact"
            className="text-sm font-medium px-5 py-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: "var(--sp)",
              color: "var(--sb)",
            }}
          >
            Book a Session
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "var(--st)" }}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden border-t px-6 pt-4 pb-6 flex flex-col gap-4"
          style={{ backgroundColor: "var(--sb)", borderColor: "var(--sbr)" }}
        >
          <TransitionLink
            href="/timetable"
            className="text-base font-medium py-1"
            style={{ color: "var(--st)" }}
            onClick={() => setOpen(false)}
          >
            Timetable
          </TransitionLink>
          <a
            href="#contact"
            className="text-sm font-medium px-5 py-2.5 rounded-full text-center transition-all"
            style={{ backgroundColor: "var(--sp)", color: "var(--sb)" }}
            onClick={() => setOpen(false)}
          >
            Book a Session
          </a>
        </div>
      )}
    </header>
  );
}