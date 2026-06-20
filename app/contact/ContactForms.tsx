"use client";

import { useState, useRef, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export default function ContactForms() {
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
      if (!res.ok) throw new Error();
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
      if (!res.ok) throw new Error();
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
    <div className="flex flex-col gap-8">
      {/* Tab switcher */}
      <div
        className="flex items-center gap-0 border w-fit"
        style={{ borderColor: "#2F4F46" }}
      >
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

      {/* Form area */}
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
            onClick={() => setSent(false)}
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
        <form onSubmit={handleTestimonialSubmit} className="flex flex-col gap-6">
          <p className="text-sm leading-relaxed" style={{ color: "rgba(34,34,34,0.55)" }}>
            Has yoga with Monalisa changed your life? Share your experience — after a quick
            review it may be featured on the Awakynn website.
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
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(47,79,70,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  value === opt ? "rgba(47,79,70,0.07)" : "transparent";
              }}
            >
              {value === opt && <span className="mr-2" style={{ color: "#C8A86B" }}>›</span>}
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
