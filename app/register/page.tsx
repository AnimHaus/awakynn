import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

const SITE_URL = "https://awakynn.com";

export const metadata: Metadata = {
  title: "Create Account – Awakynn",
  description:
    "Join the Awakynn community. Create a free account to book classes, track your wellness journey, and stay connected with our instructors.",
  alternates: { canonical: `${SITE_URL}/register` },
  openGraph: {
    title: "Create Account – Awakynn",
    description: "Join the Awakynn community. Create a free account to book classes and stay connected.",
    url: `${SITE_URL}/register`,
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "Awakynn" }],
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
