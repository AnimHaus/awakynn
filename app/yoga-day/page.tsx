import type { Metadata } from "next";
import YogaDayContent from "./YogaDayContent";

export const metadata: Metadata = {
  title: "International Yoga Day 2026 – Free Open Workshop",
  description:
    "Join Awakynn's free International Yoga Day workshop on 21 June 2026 — live on Google Meet. Open to all ages and levels. Sun Salutations, pranayama, mantra chanting, and more.",
  alternates: { canonical: "https://awakynn.com/yoga-day" },
  openGraph: {
    title: "International Yoga Day 2026 – Free Open Workshop by Awakynn",
    description:
      "Free live yoga workshop on 21 June 2026. Sun Salutations, pranayama, mantra chanting & meditation. Join on Google Meet.",
    url: "https://awakynn.com/yoga-day",
  },
  keywords: [
    "International Yoga Day 2026",
    "free yoga workshop",
    "yoga day live stream",
    "21 June yoga",
    "online yoga workshop India",
    "Awakynn yoga day",
  ],
};

export default function YogaDayPage() {
  return <YogaDayContent />;
}
