import type { Metadata } from "next";
import ClassBoard from "./ClassBoard";

export const metadata: Metadata = {
  title: "Live Classes",
  description:
    "Browse scheduled Awakynn yoga, meditation, and breathwork classes. Join live via Google Meet — no experience required.",
  alternates: { canonical: "https://awakynn.com/classes" },
  openGraph: {
    title: "Awakynn Live Classes",
    description:
      "Scheduled yoga, meditation, pranayama, and breathing classes on Google Meet. Open to all levels.",
    url: "https://awakynn.com/classes",
  },
};

export default function ClassesPage() {
  return <ClassBoard />;
}
