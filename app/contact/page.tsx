import type { Metadata } from "next";
import ContactContent from "./ContactContent";

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
  return <ContactContent />;
}
