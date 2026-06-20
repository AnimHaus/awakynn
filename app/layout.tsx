import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SeasonProvider } from "./components/SeasonProvider";
import LenisProvider from "./components/LenisProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ConsoleLogger from "./components/ConsoleLogger";
import PageTransitionProvider from "./components/PageTransitionProvider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const SITE_URL = "https://awakynn.com";
const OG_IMAGE = `${SITE_URL}/og.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Awakynn – Yoga, Meditation & Ayurvedic Wellness",
    template: "%s | Awakynn",
  },
  description:
    "Awakynn offers online and in-person yoga classes, guided meditation, pranayama, Ayurvedic diet consulting, and 1-on-1 mental clarity sessions — for all ages and levels.",
  keywords: [
    "yoga classes online",
    "yoga classes India",
    "online yoga",
    "meditation classes",
    "pranayama",
    "Ayurvedic wellness",
    "Ayurveda diet",
    "yoga for beginners",
    "yoga for seniors",
    "yoga for arthritis",
    "breathwork",
    "mantra chanting",
    "mental clarity",
    "wellness India",
    "Awakynn",
    "Monalisa yoga",
    "Google Meet yoga",
    "live yoga class",
  ],
  authors: [{ name: "Awakynn", url: SITE_URL }],
  creator: "Awakynn",
  publisher: "Awakynn",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Awakynn",
    title: "Awakynn – Yoga, Meditation & Ayurvedic Wellness",
    description:
      "Online and in-person yoga, meditation, pranayama, Ayurvedic diet consulting, and mental clarity sessions for all ages and levels.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Awakynn – Awaken Within",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@awakynn",
    creator: "@awakynn",
    title: "Awakynn – Yoga, Meditation & Ayurvedic Wellness",
    description:
      "Online yoga, meditation, pranayama, Ayurvedic diet consulting, and mental clarity sessions for all ages and levels.",
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "health",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Awakynn",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo_gold.png`,
      },
      sameAs: [
        "https://instagram.com/awakynn.yoga",
        "https://www.youtube.com/@awakynn.yogaofficial",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Awakynn",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?s={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "HealthAndBeautyBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Awakynn",
      url: SITE_URL,
      description:
        "Online yoga, meditation, pranayama, Ayurvedic diet consulting, and mental clarity sessions for all levels.",
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Online payment",
      areaServed: { "@type": "Country", name: "India" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Wellness Offerings",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Group Yoga Classes" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Private 1-on-1 Yoga" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Meditation & Breathwork" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ayurvedic Diet Consulting" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mantra Chanting" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mental Clarity Sessions" } },
        ],
      },
      sameAs: [
        "https://instagram.com/awakynn.yoga",
        "https://www.youtube.com/@awakynn.yogaofficial",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <SeasonProvider>
          <LenisProvider>
            <PageTransitionProvider>
              <Navbar />
              <ConsoleLogger />
              {children}
              <Footer />
            </PageTransitionProvider>
          </LenisProvider>
        </SeasonProvider>
      </body>
    </html>
  );
}
