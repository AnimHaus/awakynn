"use client";

import { motion } from "framer-motion";
import { journal, type JournalPost } from "../lib/data";
import TransitionLink from "./TransitionLink";

const ease = [0.22, 1, 0.36, 1] as const;

export default function JournalStory({ post }: { post: JournalPost }) {
  const more = journal.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main style={{ backgroundColor: "#faf8f5", color: "#222222" }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <article className="mx-auto max-w-[820px] px-6 pt-36 pb-16 md:pt-44">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="eyebrow text-gold"
        >
          {post.tag}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease, delay: 0.1 }}
          className="font-display mt-5 text-4xl font-light leading-[1.02] text-forest md:text-6xl"
        >
          {post.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.25 }}
          className="mt-7 max-w-xl text-lg leading-relaxed md:text-xl"
          style={{ color: "rgba(34,34,34,0.65)" }}
        >
          {post.excerpt}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 flex items-center gap-4 text-[0.78rem] font-medium tracking-[0.12em]"
          style={{ color: "rgba(34,34,34,0.45)" }}
        >
          <span>{post.author.toUpperCase()}</span>
          <span className="h-px w-8" style={{ backgroundColor: "rgba(34,34,34,0.2)" }} />
          <span>{post.date}</span>
          <span className="h-px w-8" style={{ backgroundColor: "rgba(34,34,34,0.2)" }} />
          <span>{post.read} read</span>
        </motion.div>
      </article>

      {/* ── Cover image ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.3 }}
          className="aspect-[16/9] overflow-hidden"
        >
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <article className="mx-auto max-w-[680px] px-6 py-20 md:py-28">
        {post.body.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease }}
            className={`text-lg leading-[1.8] md:text-xl ${
              i === 0
                ? "first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-light first-letter:leading-[0.8] first-letter:text-forest"
                : "mt-7"
            }`}
            style={{ color: "rgba(34,34,34,0.8)" }}
          >
            {para}
          </motion.p>
        ))}

        <div className="mt-16 border-t pt-10" style={{ borderColor: "rgba(34,34,34,0.1)" }}>
          <TransitionLink
            href="/#journal"
            className="group inline-flex items-center gap-3 text-sm font-medium text-forest"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-forest/30 transition-all duration-300 group-hover:bg-forest group-hover:text-white">
              ←
            </span>
            All stories
          </TransitionLink>
        </div>
      </article>

      {/* ── More stories ──────────────────────────────────────────── */}
      <section className="bg-sand py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <span className="eyebrow text-gold">Keep reading</span>
          <h2 className="font-display mt-4 text-3xl font-light text-forest md:text-5xl">
            More from the journal
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {more.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease, delay: i * 0.1 }}
              >
                <TransitionLink href={`/journal/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                    <span className="absolute left-4 top-4 border border-white/40 px-3 py-1 text-[0.6rem] font-medium tracking-[0.18em] text-white">
                      {p.tag.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-display mt-4 text-xl font-light leading-snug text-forest md:text-2xl">
                    {p.title}
                  </h3>
                  <span className="mt-2 inline-block text-[0.72rem] tracking-[0.12em]" style={{ color: "rgba(34,34,34,0.5)" }}>
                    {p.read} read
                  </span>
                </TransitionLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
