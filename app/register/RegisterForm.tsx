"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TransitionLink from "@/app/components/TransitionLink";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type Field = "full_name" | "email" | "phone" | "age" | "gender" | "medical_history";

interface FormState {
  full_name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  medical_history: string;
}

const empty: FormState = { full_name: "", email: "", phone: "", age: "", gender: "", medical_history: "" };

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function set(field: Field, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.full_name.trim()) { setError("Please enter your full name."); return; }
    if (!form.email.trim()) { setError("Please enter your email address."); return; }
    if (!form.phone.trim()) { setError("Please enter your phone number."); return; }
    if (!form.age) { setError("Please enter your age."); return; }
    if (!form.gender) { setError("Please select your gender."); return; }
    if (!form.medical_history.trim()) { setError("Please fill in your medical history (write \"nil\" if none)."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          age: form.age ? parseInt(form.age, 10) : null,
          gender: form.gender || null,
          medical_history: form.medical_history.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail ?? "Submission failed. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2500);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--sb)", color: "var(--st)" }}>
      {/* Top spacer for navbar */}
      <div className="h-16 md:h-20 shrink-0" />

      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {success ? (
            <div className="text-center space-y-4">
              <div
                className="text-4xl"
                aria-label="success"
              >
                🙏
              </div>
              <h1
                className="text-2xl font-light tracking-widest uppercase"
                style={{ color: "var(--sp)" }}
              >
                Welcome to Awakynn
              </h1>
              <p className="text-sm tracking-wide" style={{ color: "var(--st2)" }}>
                Your details has been recorded. Redirecting…
              </p>
            </div>
          ) : (
            <>
              <h1
                className="text-center text-[0.7rem] font-medium tracking-[0.3em] uppercase mb-1"
                style={{ color: "var(--sp)" }}
              >
                Join the community
              </h1>
              <p
                className="text-center text-[1.55rem] font-light tracking-wide mb-8"
                style={{ color: "var(--st)" }}
              >
                Register with us
              </p>

              {error && (
                <div
                  className="mb-5 px-4 py-3 text-sm tracking-wide border"
                  style={{ borderColor: "var(--sa)", color: "var(--sa)", backgroundColor: "color-mix(in srgb, var(--sa) 8%, transparent)" }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Full name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-[0.65rem] font-medium tracking-[0.25em] uppercase mb-1.5"
                    style={{ color: "var(--st2)" }}
                  >
                    Full Name *
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)}
                    className="w-full px-4 py-3 text-sm border bg-transparent outline-none transition-colors duration-200 focus:border-[var(--sp)]"
                    style={{ borderColor: "var(--sbr)", color: "var(--st)" }}
                    placeholder="Riya Sharma"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[0.65rem] font-medium tracking-[0.25em] uppercase mb-1.5"
                    style={{ color: "var(--st2)" }}
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full px-4 py-3 text-sm border bg-transparent outline-none transition-colors duration-200 focus:border-[var(--sp)]"
                    style={{ borderColor: "var(--sbr)", color: "var(--st)" }}
                    placeholder="riya@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[0.65rem] font-medium tracking-[0.25em] uppercase mb-1.5"
                    style={{ color: "var(--st2)" }}
                  >
                    Phone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className="w-full px-4 py-3 text-sm border bg-transparent outline-none transition-colors duration-200 focus:border-[var(--sp)]"
                    style={{ borderColor: "var(--sbr)", color: "var(--st)" }}
                    placeholder="+91 98765 43210"
                  />
                </div>

                {/* Age + Gender row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="age"
                      className="block text-[0.65rem] font-medium tracking-[0.25em] uppercase mb-1.5"
                      style={{ color: "var(--st2)" }}
                    >
                      Age *
                    </label>
                    <input
                      id="age"
                      type="number"
                      min={1}
                      max={120}
                      required
                      value={form.age}
                      onChange={(e) => set("age", e.target.value)}
                      className="w-full px-4 py-3 text-sm border bg-transparent outline-none transition-colors duration-200 focus:border-[var(--sp)]"
                      style={{ borderColor: "var(--sbr)", color: "var(--st)" }}
                      placeholder="28"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-[0.65rem] font-medium tracking-[0.25em] uppercase mb-1.5"
                      style={{ color: "var(--st2)" }}
                    >
                      Gender *
                    </label>
                    <select
                      id="gender"
                      required
                      value={form.gender}
                      onChange={(e) => set("gender", e.target.value)}
                      className="w-full px-4 py-3 text-sm border bg-transparent outline-none transition-colors duration-200 focus:border-[var(--sp)] appearance-none"
                      style={{ borderColor: "var(--sbr)", color: form.gender ? "var(--st)" : "var(--st2)", backgroundColor: "transparent" }}
                    >
                      <option value="" style={{ color: "var(--st)" }}>Select…</option>
                      <option value="female" style={{ color: "var(--st)" }}>Female</option>
                      <option value="male" style={{ color: "var(--st)" }}>Male</option>
                      <option value="non-binary" style={{ color: "var(--st)" }}>Non-binary</option>
                      <option value="prefer-not-to-say" style={{ color: "var(--st)" }}>Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Medical history */}
                <div>
                  <label
                    htmlFor="medical_history"
                    className="block text-[0.65rem] font-medium tracking-[0.25em] uppercase mb-1.5"
                    style={{ color: "var(--st2)" }}
                  >
                    Medical History *
                  </label>
                  <textarea
                    id="medical_history"
                    rows={3}
                    required
                    value={form.medical_history}
                    onChange={(e) => set("medical_history", e.target.value)}
                    className="w-full px-4 py-3 text-sm border bg-transparent outline-none transition-colors duration-200 focus:border-[var(--sp)] resize-none"
                    style={{ borderColor: "var(--sbr)", color: "var(--st)" }}
                    placeholder={'Write "nil" if you have no medical history to report…'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 px-6 py-3.5 text-[0.72rem] font-medium tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--sp)",
                    color: "var(--sb)",
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  {loading ? "Submitting…" : "Submit details"}
                </button>

                <p className="text-center text-xs mt-4" style={{ color: "var(--st2)" }}>
                  Have questions?{" "}
                  <TransitionLink
                    href="/contact"
                    className="underline underline-offset-4 transition-opacity hover:opacity-60"
                    style={{ color: "var(--sp)" }}
                  >
                    Contact us
                  </TransitionLink>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
