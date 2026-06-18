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

export const metadata: Metadata = {
  title: "Awakynn – Awaken Within",
  description:
    "A wellness brand offering Yoga, Meditation, Ayurvedic diet consulting, Mantra chanting, and 1-on-1 mental clarity sessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full`}>
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
