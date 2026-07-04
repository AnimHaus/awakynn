"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "./types";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const isOpen = lightboxIndex !== null;
  const current = isOpen ? items[lightboxIndex] : null;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => ((i ?? 0) + 1) % items.length);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => ((i ?? 0) - 1 + items.length) % items.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, items.length]);

  // Prevent body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-heading text-3xl font-light" style={{ color: "var(--st2)" }}>
          Coming soon.
        </p>
        <p className="mt-3 text-sm" style={{ color: "var(--st2)" }}>
          Our gallery is being filled — check back soon.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry-style responsive grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            className="break-inside-avoid mb-3 md:mb-4 group relative cursor-pointer overflow-hidden rounded-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: Math.min(idx * 0.04, 0.4) }}
            onClick={() => setLightboxIndex(idx)}
          >
            <img
              src={item.image_url}
              alt={item.title || item.caption || `Gallery photo ${idx + 1}`}
              className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover overlay */}
            {(item.title || item.caption) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                {item.title && (
                  <p className="text-white text-xs font-semibold leading-snug">{item.title}</p>
                )}
                {item.caption && (
                  <p className="text-white/80 text-[10px] mt-0.5 leading-snug">{item.caption}</p>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            ref={lightboxRef}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(20,16,12,0.95)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === lightboxRef.current) setLightboxIndex(null); }}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              onClick={() => setLightboxIndex((i) => ((i ?? 0) - 1 + items.length) % items.length)}
              className="absolute left-3 md:left-6 text-white/70 hover:text-white transition-colors p-2"
              aria-label="Previous"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIndex}
                className="flex flex-col items-center px-16 max-w-5xl w-full"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <img
                  src={current.image_url}
                  alt={current.title || current.caption || "Gallery photo"}
                  className="max-h-[80vh] max-w-full w-auto h-auto rounded-sm object-contain"
                />
                {(current.title || current.caption) && (
                  <div className="mt-4 text-center">
                    {current.title && (
                      <p className="text-white font-heading text-lg font-light">{current.title}</p>
                    )}
                    {current.caption && (
                      <p className="text-white/60 text-sm mt-1">{current.caption}</p>
                    )}
                  </div>
                )}
                <p className="text-white/30 text-xs mt-3">
                  {(lightboxIndex ?? 0) + 1} / {items.length}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Next */}
            <button
              onClick={() => setLightboxIndex((i) => ((i ?? 0) + 1) % items.length)}
              className="absolute right-3 md:right-6 text-white/70 hover:text-white transition-colors p-2"
              aria-label="Next"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
