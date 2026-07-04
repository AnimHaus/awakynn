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
    "yoga classes Kolkata",
    "yoga classes Hooghly",
    "yoga classes Chinsurah",
    "yoga classes Chandannagar",
    "yoga classes Bandel",
    "yoga classes Serampore",
    "yoga classes West Bengal",
    "yoga near Chinsurah",
    "yoga near Hooghly",
    "online yoga West Bengal",
    "meditation classes Kolkata",
    "meditation classes Hooghly",
    "Ayurvedic wellness Hooghly",
    "Ayurveda consulting West Bengal",
    "yoga teacher Chinsurah",
    "yoga teacher Hooghly",
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
  other: {
    "geo.region": "IN-WB",
    "geo.placename": "Chinsurah, Hooghly, West Bengal, India",
    "geo.position": "22.8998;88.3967",
    ICBM: "22.8998, 88.3967",
  },
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
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/logo_gold.png`,
        width: 512,
        height: 512,
        caption: "Awakynn",
      },
      sameAs: [
        "https://instagram.com/awakynn.yoga",
        "https://www.youtube.com/@awakynn.yogaofficial",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-91132-93167",
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["English", "Bengali", "Hindi"],
        },
        {
          "@type": "ContactPoint",
          telephone: "+91-82769-38020",
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["English", "Bengali", "Hindi"],
        },
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
      "@type": ["HealthAndBeautyBusiness", "LocalBusiness"],
      "@id": `${SITE_URL}/#business`,
      name: "Awakynn",
      url: SITE_URL,
      description:
        "Online yoga, meditation, pranayama, Ayurvedic diet consulting, and mental clarity sessions for all levels.",
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Online payment",
      telephone: "+91-91132-93167",
      image: OG_IMAGE,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chinsurah",
        addressRegion: "West Bengal",
        postalCode: "712101",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 22.8998,
        longitude: 88.3967,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "06:00",
          closes: "20:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "07:00",
          closes: "12:00",
        },
      ],
      areaServed: [
        { "@type": "City", name: "Kolkata" },
        { "@type": "City", name: "Chinsurah" },
        { "@type": "City", name: "Chandannagar" },
        { "@type": "City", name: "Hooghly" },
        { "@type": "City", name: "Bandel" },
        { "@type": "City", name: "Serampore" },
        { "@type": "City", name: "Rishra" },
        { "@type": "City", name: "Konnagar" },
        { "@type": "AdministrativeArea", name: "West Bengal" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Wellness Offerings",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Group Yoga Classes", provider: { "@id": `${SITE_URL}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Private 1-on-1 Yoga", provider: { "@id": `${SITE_URL}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Online Meditation Classes", provider: { "@id": `${SITE_URL}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pranayama & Breathwork", provider: { "@id": `${SITE_URL}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ayurvedic Diet Consulting", provider: { "@id": `${SITE_URL}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mantra Chanting", provider: { "@id": `${SITE_URL}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mental Clarity Sessions", provider: { "@id": `${SITE_URL}/#business` } } },
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
