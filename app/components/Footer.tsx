import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const links = [
  {
    heading: "Offerings",
    items: [
      { label: "Yoga & Pranayama", href: "#offerings" },
      { label: "Meditation", href: "#offerings" },
      { label: "Ayurvedic Consulting", href: "#offerings" },
      { label: "Mantra Chanting", href: "#offerings" },
      { label: "1-on-1 Sessions", href: "#offerings" },
    ],
  },
  {
    heading: "Awakynn",
    items: [
      { label: "Philosophy", href: "#philosophy" },
      { label: "About", href: "#about" },
      { label: "Connect", href: "#contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="border-t py-16 px-6"
      style={{ borderColor: "var(--sbr)", backgroundColor: "var(--ss)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Image
              src="/logo_gold.png"
              alt="Awakynn"
              width={140}
              height={42}
              className="h-10 w-auto object-contain"
            />
            <p
              className="text-sm font-light leading-relaxed max-w-sm"
              style={{ color: "var(--st2)" }}
            >
              A wellness brand offering structured, accessible, and deeply
              rooted practices in Yoga, Meditation, Ayurveda, and beyond.
              Not an institution — a way of life.
            </p>
            <p
              className="font-heading italic text-base"
              style={{ color: "var(--sp)", opacity: 0.7 }}
            >
              ॐ — Awaken. Align. Ascend.
            </p>
            <a
              href="https://www.instagram.com/awakynn.yoga"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 w-fit mt-1"
              style={{ color: "var(--sp)" }}
            >
              <FontAwesomeIcon icon={faInstagram} style={{ width: 16, height: 16 }} />
              @awakynn.yoga
            </a>
          </div>

          {/* Link columns */}
          {links.map(({ heading, items }) => (
            <div key={heading} className="flex flex-col gap-3">
              <h4
                className="text-xs font-semibold tracking-[0.2em] uppercase mb-1"
                style={{ color: "var(--st)" }}
              >
                {heading}
              </h4>
              {items.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm font-light nav-link transition-colors w-fit"
                  style={{ color: "var(--st2)" }}
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ borderColor: "var(--sbr)" }}
        >
          <p
            className="text-xs font-light"
            style={{ color: "var(--st2)" }}
          >
            © {new Date().getFullYear()} Awakynn. All rights reserved.
          </p>
          <p
            className="text-xs font-light"
            style={{ color: "var(--st2)" }}
          >
            Developed by{" "}
            <a
              href="https://animhaus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--sp)" }}
            >
              AnimHaus
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
