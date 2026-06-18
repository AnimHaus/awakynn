"use client";

import { journal } from "../lib/data";
import TransitionLink from "./TransitionLink";

const layout: Record<string, string> = {
  lg: "md:col-span-7 md:row-span-2 aspect-[4/3] md:aspect-auto",
  md: "md:col-span-5 md:col-start-8 aspect-[4/3]",
  sm: "md:col-span-4 aspect-[4/3]",
};

const tones = [
  { bg: "linear-gradient(155deg,#2F4F46,#1c322c)", fg: "#FAF8F5" },
  { bg: "linear-gradient(155deg,#FFFFFF,#F4EFE8)", fg: "#222222" },
  { bg: "linear-gradient(155deg,#C8A86B,#b1924f)", fg: "#222222" },
  { bg: "linear-gradient(155deg,#222222,#383838)", fg: "#FAF8F5" },
];

export default function JournalSection() {
  return (
    <section id="journal" className="relative overflow-hidden bg-sand py-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="font-display mt-4 max-w-2xl text-5xl font-light leading-[0.95] text-forest md:text-7xl">
              Notes on living
              <span className="italic text-gold"> well.</span>
            </h2>
          </div>
          <TransitionLink href="/journal" className="group inline-flex items-center gap-2 text-sm font-medium text-forest">
            Read the journal
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-forest/30 transition-all duration-300 group-hover:bg-forest group-hover:text-background">
              →
            </span>
          </TransitionLink>
        </div>

        {/* Bento grid */}
        <div className="flex flex-col gap-5">

          {/* Row 1: left large + right 2-stack */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {/* Col 1 — large card */}
            <JournalCard post={journal[0]} tone={tones[0]} className="aspect-[4/3] md:col-span-7 md:aspect-auto md:min-h-[480px]" titleSize="text-3xl md:text-5xl" />

            {/* Col 2 — two cards stacked */}
            <div className="flex flex-col gap-5 md:col-span-5 md:col-start-8">
              <JournalCard post={journal[1]} tone={tones[1]} className="aspect-[4/3] md:aspect-auto md:flex-1 md:min-h-[220px]" titleSize="text-2xl md:text-3xl" />
              <JournalCard post={journal[2]} tone={tones[2]} className="aspect-[4/3] md:aspect-auto md:flex-1 md:min-h-[220px]" titleSize="text-2xl md:text-3xl" />
            </div>
          </div>

          {/* Row 2: full-width stretched card */}
          <JournalCard post={journal[3]} tone={tones[3]} className="aspect-[4/3] md:aspect-[16/5]" titleSize="text-3xl md:text-5xl" />

        </div>
      </div>
    </section>
  );
}

import type { JournalPost } from "../lib/data";

function JournalCard({
  post,
  tone,
  className,
  titleSize,
}: {
  post: JournalPost;
  tone: { bg: string; fg: string };
  className?: string;
  titleSize: string;
}) {
  return (
    <TransitionLink
      href={`/journal/${post.slug}`}
      className={`grain group relative cursor-pointer overflow-hidden rounded-[1.6rem] border border-charcoal/5 p-7 shadow-[0_30px_70px_-40px_rgba(34,34,34,0.4)] transition-transform duration-500 hover:-translate-y-2 md:p-9 ${className ?? ""}`}
      style={{ background: tone.bg, color: "#FAF8F5" }}
    >
      <img src={post.image} alt={post.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/25 to-charcoal/10" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-background/35 px-3 py-1 text-[0.62rem] font-medium tracking-[0.18em] text-background/90">
            {post.tag.toUpperCase()}
          </span>
          <span className="text-[0.7rem] text-background/70">{post.read} read</span>
        </div>
        <div>
          <h3 className={`font-display font-light leading-[0.98] text-background ${titleSize}`}>
            {post.title}
          </h3>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-background opacity-0 transition-all duration-400 group-hover:opacity-90">
            Read story <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </TransitionLink>
  );
}
