"use client";

import { useState, useRef, useEffect } from "react";
import TransitionLink from "../components/TransitionLink";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const socials = [
  { label: "Instagram", handle: "@awakynn.yoga", href: "https://instagram.com/awakynn.yoga" },
  { label: "YouTube", handle: "Awakynn", href: "https://www.youtube.com/@awakynn.yogaofficial" },
];

const faqs = [
  {
    q: "I'm a complete beginner. Can I join?",
    a: "Absolutely. Our classes welcome all levels. Let us know in your message and we'll suggest the best starting point.",
  },
  {
    q: "Do you offer private or 1-on-1 sessions?",
    a: "Yes — we offer personalised 1-on-1 sessions covering yoga, Ayurvedic diet, and mental clarity work. Mention it in your inquiry.",
  },
  {
    q: "What if I have a health condition?",
    a: "Please consult your physician first. Our resident doctors can also advise on suitability before you begin your practice.",
  },
];

export default function ContactContent() {
  const [tab, setTab] = useState<"contact" | "testimonial">("contact");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interest, setInterest] = useState("");

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(`${API_BASE}/contact/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone") ?? "",
          interest,
          message: fd.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTestimonialSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const ageRaw = fd.get("age") as string;
    try {
      const res = await fetch(`${API_BASE}/contact/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          age: ageRaw ? parseInt(ageRaw, 10) : null,
          note: fd.get("note") ?? "",
          message: fd.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleTabChange(t: "contact" | "testimonial") {
    setTab(t);
    setSent(false);
    setError(null);
  }

  return (
    <main style={{ backgroundColor: "#faf8f5", color: "#222222" }}>
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1500px] px-6 pt-28 pb-16 md:px-10">
        <h1
          className="font-display mt-5 text-5xl font-light leading-[0.95] md:text-7xl"
          style={{ color: "#2F4F46" }}
        >
          Begin the
          <br />
          <span className="italic" style={{ color: "#C8A86B" }}>
            conversation.
          </span>
        </h1>
        <p
          className="mt-7 max-w-md text-base leading-relaxed"
          style={{ color: "rgba(34,34,34,0.58)" }}
        >
          Questions about a class, a program, or simply curious about what
          practice could look like for you — write to us and we&apos;ll respond
          within 24 hours.
        </p>

        {/* Tab switcher */}
        <div className="mt-10 flex items-center gap-0 border w-fit" style={{ borderColor: "#2F4F46" }}>
          {(["contact", "testimonial"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className="px-6 py-2.5 text-[0.68rem] font-medium tracking-[0.2em] uppercase transition-all duration-200"
              style={{
                backgroundColor: tab === t ? "#2F4F46" : "transparent",
                color: tab === t ? "#faf8f5" : "#2F4F46",
              }}
            >
              {t === "contact" ? "Send a message" : "Share your story"}
            </button>
          ))}
        </div>
      </section>

      {/* ── Content grid ── */}
      <section className="mx-auto max-w-[1500px] px-6 pb-32 md:px-10">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24 lg:gap-36">

          {/* Left — form */}
          <div>
            {sent ? (
              <div
                className="flex flex-col items-start gap-4 border p-8"
                style={{ borderColor: "#2F4F46" }}
              >
                <span
                  className="block text-[0.65rem] font-medium tracking-[0.25em]"
                  style={{ color: "#C8A86B" }}
                >
                  {tab === "contact" ? "MESSAGE SENT" : "STORY RECEIVED"}
                </span>
                <p
                  className="font-display text-2xl font-light"
                  style={{ color: "#2F4F46" }}
                >
                  {tab === "contact"
                    ? "Thank you. We'll be in touch shortly."
                    : "Thank you for sharing. Your story will be reviewed before it appears on the site."}
                </p>
                <button
                  onClick={() => { setSent(false); }}
                  className="mt-2 text-sm font-medium underline underline-offset-4"
                  style={{ color: "rgba(34,34,34,0.5)" }}
                >
                  Submit another
                </button>
              </div>
            ) : tab === "contact" ? (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
                <Field label="Full name" name="name" type="text" required />
                <Field label="Email address" name="email" type="email" required />
                <Field label="Phone (optional)" name="phone" type="tel" />
                <SelectField
                  label="I'm interested in"
                  name="interest"
                  value={interest}
                  onChange={setInterest}
                  options={[
                    "Group yoga classes",
                    "Private / 1-on-1 sessions",
                    "Meditation & breathwork",
                    "Ayurvedic diet consulting",
                    "Mantra chanting",
                    "Inner clarity sessions",
                    "Other",
                  ]}
                />
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-[0.65rem] font-medium tracking-[0.18em]"
                    style={{ color: "rgba(34,34,34,0.45)" }}
                  >
                    YOUR MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell us a little about yourself and what you're looking for…"
                    className="border bg-transparent px-4 py-3 text-sm leading-relaxed outline-none focus:border-forest resize-none"
                    style={{ borderColor: "rgba(34,34,34,0.18)", color: "#222" }}
                  />
                </div>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 inline-flex items-center justify-between gap-8 border px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-forest hover:!text-white disabled:opacity-50"
                  style={{ borderColor: "#2F4F46", color: "#2F4F46" }}
                >
                  {loading ? "Sending…" : "Send message"}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
                </button>
              </form>
            ) : (
              /* Testimonial form */
              <form onSubmit={handleTestimonialSubmit} className="flex flex-col gap-6">
                <p className="text-sm leading-relaxed" style={{ color: "rgba(34,34,34,0.55)" }}>
                  Has yoga with Monalisa changed your life? Share your experience — after a quick review it may be featured on the Awakynn website.
                </p>
                <Field label="Your name" name="name" type="text" required />
                <Field label="Age (optional)" name="age" type="number" />
                <Field label="Any context (e.g. 'Neha's Mom', optional)" name="note" type="text" />
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="t-message"
                    className="text-[0.65rem] font-medium tracking-[0.18em]"
                    style={{ color: "rgba(34,34,34,0.45)" }}
                  >
                    YOUR STORY
                  </label>
                  <textarea
                    id="t-message"
                    name="message"
                    rows={7}
                    required
                    placeholder="Tell us about your journey, what changed, and what yoga means to you now…"
                    className="border bg-transparent px-4 py-3 text-sm leading-relaxed outline-none focus:border-forest resize-none"
                    style={{ borderColor: "rgba(34,34,34,0.18)", color: "#222" }}
                  />
                </div>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 inline-flex items-center justify-between gap-8 border px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-forest hover:!text-white disabled:opacity-50"
                  style={{ borderColor: "#2F4F46", color: "#2F4F46" }}
                >
                  {loading ? "Sending…" : "Share my story"}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
                </button>
              </form>
            )}
          </div>

          {/* Right — info */}
          <div className="flex flex-col gap-12">

            {/* Social */}
            <div>
              <span
                className="block text-[0.65rem] font-medium tracking-[0.25em]"
                style={{ color: "#C8A86B" }}
              >
                FIND US
              </span>
              <div className="mt-5 flex flex-col gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border px-5 py-4 transition-all duration-300 hover:border-forest"
                    style={{ borderColor: "rgba(34,34,34,0.12)" }}
                  >
                    <div>
                      <span
                        className="text-[0.62rem] tracking-[0.18em]"
                        style={{ color: "rgba(34,34,34,0.4)" }}
                      >
                        {s.label.toUpperCase()}
                      </span>
                      <p className="mt-0.5 text-sm font-medium" style={{ color: "#2F4F46" }}>
                        {s.handle}
                      </p>
                    </div>
                    <span
                      className="text-lg transition-transform duration-300 group-hover:translate-x-1"
                      style={{ color: "#C8A86B" }}
                    >
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div
              className="border p-6"
              style={{ borderColor: "rgba(34,34,34,0.1)", background: "rgba(47,79,70,0.04)" }}
            >
              <span
                className="block text-[0.65rem] font-medium tracking-[0.25em]"
                style={{ color: "#C8A86B" }}
              >
                RESPONSE TIME
              </span>
              <p className="font-display mt-3 text-2xl font-light" style={{ color: "#2F4F46" }}>
                Within 24 hours
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(34,34,34,0.5)" }}>
                We read every message personally. If your enquiry is urgent,
                mention it in the subject line.
              </p>
            </div>

            {/* FAQ */}
            <div>
              <span
                className="block text-[0.65rem] font-medium tracking-[0.25em]"
                style={{ color: "#C8A86B" }}
              >
                COMMON QUESTIONS
              </span>
              <div className="mt-5 flex flex-col gap-5">
                {faqs.map((f) => (
                  <div
                    key={f.q}
                    className="border-t pt-5"
                    style={{ borderColor: "rgba(34,34,34,0.1)" }}
                  >
                    <p className="text-sm font-medium" style={{ color: "#2F4F46" }}>
                      {f.q}
                    </p>
                    <p
                      className="mt-2 text-sm leading-relaxed"
                      style={{ color: "rgba(34,34,34,0.55)" }}
                    >
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

// ── Field helpers ─────────────────────────────────────────────────────────────
function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      <span
        className="text-[0.65rem] font-medium tracking-[0.18em]"
        style={{ color: "rgba(34,34,34,0.45)" }}
      >
        {label.toUpperCase()}
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between border px-4 py-3 text-sm text-left transition-colors duration-200"
        style={{
          borderColor: open ? "#2F4F46" : "rgba(34,34,34,0.18)",
          color: value ? "#222" : "rgba(34,34,34,0.38)",
          backgroundColor: "transparent",
        }}
      >
        <span>{value || "Select a program"}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", color: "#C8A86B" }}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
        </svg>
      </button>
      {open && (
        <div
          className="flex flex-col border"
          style={{ borderColor: "#2F4F46", backgroundColor: "#faf8f5", marginTop: "-1px" }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className="px-4 py-3 text-left text-sm transition-colors duration-150"
              style={{
                color: value === opt ? "#2F4F46" : "rgba(34,34,34,0.7)",
                backgroundColor: value === opt ? "rgba(47,79,70,0.07)" : "transparent",
                fontWeight: value === opt ? 500 : 400,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(47,79,70,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = value === opt ? "rgba(47,79,70,0.07)" : "transparent"; }}
            >
              {value === opt && (
                <span className="mr-2" style={{ color: "#C8A86B" }}>›</span>
              )}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-[0.65rem] font-medium tracking-[0.18em]"
        style={{ color: "rgba(34,34,34,0.45)" }}
      >
        {label.toUpperCase()}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="border bg-transparent px-4 py-3 text-sm outline-none focus:border-forest"
        style={{ borderColor: "rgba(34,34,34,0.18)", color: "#222" }}
      />
    </div>
  );
}
