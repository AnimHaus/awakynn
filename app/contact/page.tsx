import type { Metadata } from "next";
import ContactForms from "./ContactForms";

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

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Awakynn — ask about yoga classes, private sessions, Ayurvedic consulting, or share your wellness story.",
  alternates: { canonical: "https://awakynn.com/contact" },
  openGraph: {
    title: "Contact Awakynn",
    description:
      "Reach out about yoga classes, private sessions, Ayurvedic diet consulting, meditation, and more.",
    url: "https://awakynn.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main style={{ backgroundColor: "#faf8f5", color: "#222222" }}>
      {/* Hero */}
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
          Questions about a class, a program, or simply curious about what practice could look
          like for you — write to us and we&apos;ll respond within 24 hours.
        </p>
      </section>

      {/* Content grid */}
      <section className="mx-auto max-w-[1500px] px-6 pb-32 md:px-10">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24 lg:gap-36">

          {/* Left — interactive forms (client component) */}
          <ContactForms />

          {/* Right — static info */}
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
                We read every message personally. If your enquiry is urgent, mention it in the
                subject line.
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
