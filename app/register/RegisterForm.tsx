"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TransitionLink from "@/app/components/TransitionLink";
import Script from "next/script";
import { offerings } from "@/app/lib/data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const REGISTRATION_FEE = 200;

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

type CustomPlan = "2days" | "4days";

const CUSTOM_PLANS: { id: CustomPlan; label: string; price: number; display: string; planId: string }[] = [
  { id: "2days", label: "2 Days / Week", price: 2000, display: "₹2,000 / month", planId: "plan_TGaOnvPJzmjHov" },
  { id: "4days", label: "4 Days / Week", price: 4000, display: "₹4,000 / month", planId: "plan_TGaPGny5ZBgP4S" },
];

type CashReceiptData = {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  planLabel?: string;
  date: string;
};

// ── Registration receipt ──────────────────────────────────────────────────────

function RegistrationReceipt({ receipt, onDone }: { receipt: CashReceiptData; onDone: () => void }) {
  const short = receipt.bookingId.slice(-8).toUpperCase();
  return (
    <div className="text-center">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-light mb-1" style={{ color: "var(--st)" }}>Registration Confirmed</h2>
        <p className="text-amber-600 text-xs tracking-[0.18em] uppercase font-medium">Registration Fee — Pending Cash Payment</p>
      </div>

      <div className="rounded-2xl border border-[var(--sbr)] p-6 text-left mb-5" style={{ backgroundColor: "var(--sb)" }}>
        <div className="flex justify-between items-start mb-5 pb-4 border-b border-[var(--sbr)]">
          <div>
            <p className="text-[0.6rem] tracking-[0.16em] uppercase mb-0.5" style={{ color: "var(--st2)" }}>Reference</p>
            <p className="font-mono font-bold text-lg tracking-widest" style={{ color: "var(--st)" }}>AWK-{short}</p>
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] tracking-[0.16em] uppercase mb-0.5" style={{ color: "var(--st2)" }}>Date</p>
            <p className="text-sm font-medium" style={{ color: "var(--st)" }}>{receipt.date}</p>
          </div>
        </div>
        <div className="space-y-2.5">
          <ReceiptRow label="Service" value={receipt.serviceName} />
          {receipt.planLabel && <ReceiptRow label="Plan" value={receipt.planLabel} />}
          <ReceiptRow label="Registration Fee" value={`₹${REGISTRATION_FEE}`} bold />
          <ReceiptRow label="Payment Method" value="Cash (to be paid in person)" />
          <div className="pt-3 mt-1 border-t border-[var(--sbr)] space-y-2.5">
            <ReceiptRow label="Customer" value={receipt.name} />
            {receipt.email && <ReceiptRow label="Email" value={receipt.email} />}
            <ReceiptRow label="Phone" value={receipt.phone} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/20 px-4 py-3 text-left mb-6" style={{ backgroundColor: "color-mix(in srgb, #f59e0b 6%, transparent)" }}>
        <p className="text-amber-700 text-xs leading-relaxed">
          <span className="font-semibold">Next step:</span> Present this reference to your instructor and pay ₹{REGISTRATION_FEE} in person. Your spot is reserved.
        </p>
      </div>

      <button
        onClick={onDone}
        className="w-full rounded-full py-3 text-sm tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "var(--sp)", color: "var(--sb)" }}
      >
        Done
      </button>
    </div>
  );
}

function ReceiptRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-[0.65rem] tracking-[0.12em] uppercase shrink-0" style={{ color: "var(--st2)" }}>{label}</span>
      <span className={`text-sm text-right ${bold ? "font-bold text-base" : ""}`} style={{ color: "var(--st)" }}>{value}</span>
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

function RegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get("service");
  const selectedOffering = serviceSlug ? (offerings.find((o) => o.slug === serviceSlug) ?? null) : null;
  const isCustomBundle = serviceSlug === "morning-ritual-bundle";

  const [form, setForm] = useState<FormState>(empty);
  const [customPlan, setCustomPlan] = useState<CustomPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cashReceipt, setCashReceipt] = useState<CashReceiptData | null>(null);

  function set(field: Field, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const allPersonalFieldsFilled =
    form.full_name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.age &&
    form.gender &&
    form.medical_history.trim();

  const showPaymentSection = !!selectedOffering && !!allPersonalFieldsFilled && (!isCustomBundle || !!customPlan);
  const planData = isCustomBundle && customPlan ? CUSTOM_PLANS.find((p) => p.id === customPlan) : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.full_name.trim()) { setError("Please enter your full name."); return; }
    if (!form.email.trim()) { setError("Please enter your email address."); return; }
    if (!form.phone.trim()) { setError("Please enter your phone number."); return; }
    if (!form.age) { setError("Please enter your age."); return; }
    if (!form.gender) { setError("Please select your gender."); return; }
    if (!form.medical_history.trim()) { setError("Please fill in your medical history (write \"nil\" if none)."); return; }
    if (isCustomBundle && !customPlan) { setError("Please select a plan."); return; }
    if (selectedOffering && !paymentMethod) { setError("Please choose a payment method."); return; }

    setLoading(true);
    try {
      // 1. Register user
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
          ...(serviceSlug && { service_slug: serviceSlug }),
          ...(planData && { service_plan: planData.label }),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail ?? "Submission failed. Please try again.");
        return;
      }

      // 2. Handle ₹200 registration fee (only when a service is selected)
      if (selectedOffering && paymentMethod) {
        const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

        if (paymentMethod === "cash") {
          const bookingRes = await fetch(`${API_BASE}/services/bookings/cash`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              service_slug: "registration-fee",
              service_name: "Registration Fee",
              amount: REGISTRATION_FEE,
              customer_name: form.full_name.trim(),
              customer_email: form.email.trim().toLowerCase(),
              customer_phone: form.phone.trim(),
              is_subscription: false,
            }),
          });
          const bookingData = await bookingRes.json().catch(() => ({}));
          setCashReceipt({
            bookingId: bookingData.id ?? "local-" + Date.now(),
            name: form.full_name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            serviceName: selectedOffering.name,
            planLabel: planData?.label,
            date,
          });
          return;
        } else {
          // Online payment — subscription for custom plans, one-time ₹200 reg fee for others
          if (planData) {
            // Subscription flow using Razorpay plan ID
            const bookingRes = await fetch(`${API_BASE}/services/subscriptions/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                plan_id: planData.planId,
                service_slug: selectedOffering.slug,
                service_name: `${selectedOffering.name} — ${planData.label}`,
                amount: planData.price,
                customer_name: form.full_name.trim(),
                customer_email: form.email.trim().toLowerCase(),
                customer_phone: form.phone.trim(),
              }),
            });
            if (!bookingRes.ok) {
              const err = await bookingRes.json().catch(() => ({ detail: "Failed to create subscription" }));
              throw new Error(err.detail ?? "Failed to create subscription");
            }
            const bookingData = await bookingRes.json();

            await new Promise<void>((resolve, reject) => {
              const rzp = new (
                window as unknown as { Razorpay: new (opts: object) => { open(): void } }
              ).Razorpay({
                key: bookingData.key_id,
                subscription_id: bookingData.subscription_id,
                name: "Awakynn",
                description: `${selectedOffering.name} — ${planData.label}`,
                prefill: { name: form.full_name.trim(), email: form.email.trim(), contact: form.phone.trim() },
                theme: { color: "#2F4F46" },
                handler: async (response: {
                  razorpay_subscription_id: string;
                  razorpay_payment_id: string;
                  razorpay_signature: string;
                }) => {
                  try {
                    const verifyRes = await fetch(
                      `${API_BASE}/services/subscriptions/${bookingData.booking_id}/verify-payment`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          razorpay_subscription_id: response.razorpay_subscription_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                        }),
                      }
                    );
                    if (!verifyRes.ok) throw new Error("Payment verification failed");
                    resolve();
                  } catch (err) {
                    reject(err);
                  }
                },
                modal: { ondismiss: () => reject(new Error("cancelled")) },
              });
              rzp.open();
            });
          } else {
            // One-time ₹200 registration fee
            const bookingRes = await fetch(`${API_BASE}/services/bookings/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                service_slug: "registration-fee",
                service_name: "Registration Fee",
                amount: REGISTRATION_FEE,
                customer_name: form.full_name.trim(),
                customer_email: form.email.trim().toLowerCase(),
                customer_phone: form.phone.trim(),
              }),
            });
            if (!bookingRes.ok) {
              const err = await bookingRes.json().catch(() => ({ detail: "Failed to initiate payment" }));
              throw new Error(err.detail ?? "Failed to initiate payment");
            }
            const bookingData = await bookingRes.json();

            await new Promise<void>((resolve, reject) => {
              const rzp = new (
                window as unknown as { Razorpay: new (opts: object) => { open(): void } }
              ).Razorpay({
                key: bookingData.key_id,
                amount: bookingData.amount,
                currency: bookingData.currency,
                order_id: bookingData.razorpay_order_id,
                name: "Awakynn",
                description: "Registration Fee",
                prefill: { name: form.full_name.trim(), email: form.email.trim(), contact: form.phone.trim() },
                theme: { color: "#2F4F46" },
                handler: async (response: {
                  razorpay_order_id: string;
                  razorpay_payment_id: string;
                  razorpay_signature: string;
                }) => {
                  try {
                    const verifyRes = await fetch(
                      `${API_BASE}/services/bookings/${bookingData.booking_id}/verify-payment`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                        }),
                      }
                    );
                    if (!verifyRes.ok) throw new Error("Payment verification failed");
                    resolve();
                  } catch (err) {
                    reject(err);
                  }
                },
                modal: { ondismiss: () => reject(new Error("cancelled")) },
              });
              rzp.open();
            });
          }

          setSuccess(true);
          setTimeout(() => router.push("/"), 3000);
        }
      } else {
        // No service — plain registration
        setSuccess(true);
        setTimeout(() => router.push("/"), 2500);
      }
    } catch (err) {
      if (err instanceof Error && err.message === "cancelled") {
        setError("Payment was cancelled. You can try again.");
      } else {
        setError(err instanceof Error ? err.message : "Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--sb)", color: "var(--st)" }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Top spacer for navbar */}
      <div className="h-16 md:h-20 shrink-0" />

      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {cashReceipt ? (
            <RegistrationReceipt receipt={cashReceipt} onDone={() => router.push("/")} />
          ) : success ? (
            <div className="text-center space-y-4">
              <div className="text-4xl" aria-label="success">🙏</div>
              <h1 className="text-2xl font-light tracking-widest uppercase" style={{ color: "var(--sp)" }}>
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

              {/* Service banner — pre-filled from URL param */}
              {selectedOffering && (
                <div className="mb-6 rounded-2xl border border-[var(--sbr)] overflow-hidden">
                  <div
                    className="px-4 py-3 flex items-center justify-between gap-3"
                    style={{ backgroundColor: "color-mix(in srgb, var(--sp) 8%, transparent)" }}
                  >
                    <div>
                      <p className="text-[0.6rem] tracking-[0.18em] uppercase font-medium mb-0.5" style={{ color: "var(--sp)" }}>
                        {selectedOffering.note}
                      </p>
                      <p className="text-sm font-medium" style={{ color: "var(--st)" }}>{selectedOffering.name}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-sm font-semibold block" style={{ color: "var(--sp)" }}>
                        {isCustomBundle ? "Custom" : selectedOffering.price}
                      </span>
                      {(isCustomBundle || selectedOffering.planId) && (
                        <span className="text-[0.6rem]" style={{ color: "var(--st2)" }}>+ ₹{REGISTRATION_FEE} reg. fee</span>
                      )}
                    </div>
                  </div>

                  {/* Plan picker for Morning Ritual Bundle */}
                  {isCustomBundle && (
                    <div className="p-4 border-t border-[var(--sbr)]">
                      <p className="text-[0.65rem] tracking-[0.2em] uppercase font-medium mb-3" style={{ color: "var(--st2)" }}>
                        Select your plan
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {CUSTOM_PLANS.map((plan) => (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setCustomPlan(plan.id)}
                            className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 transition-all text-center ${
                              customPlan === plan.id
                                ? "border-[var(--sp)]"
                                : "border-[var(--sbr)] hover:border-[var(--sp)]"
                            }`}
                            style={customPlan === plan.id ? { backgroundColor: "color-mix(in srgb, var(--sp) 8%, transparent)" } : {}}
                          >
                            <span className="text-[0.75rem] font-semibold" style={{ color: "var(--st)" }}>{plan.label}</span>
                            <span className="text-[0.7rem] font-bold" style={{ color: "var(--sp)" }}>{plan.display}</span>
                            <span className="text-[0.6rem]" style={{ color: "var(--st2)" }}>+ ₹{REGISTRATION_FEE} reg. fee</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

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

                {/* Payment section — appears after all fields are filled and service is selected */}
                {showPaymentSection && (
                  <div className="pt-1 space-y-4">

                    {/* Payment method picker */}
                    <div>
                      <p className="text-[0.65rem] tracking-[0.2em] uppercase font-medium mb-3" style={{ color: "var(--st2)" }}>
                        Payment Method
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("online")}
                          className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 transition-all ${
                            paymentMethod === "online"
                              ? "border-[var(--sp)]"
                              : "border-[var(--sbr)] hover:border-[var(--sp)]"
                          }`}
                          style={paymentMethod === "online" ? { backgroundColor: "color-mix(in srgb, var(--sp) 8%, transparent)" } : {}}
                        >
                          <span className="text-xl">💳</span>
                          <span className="text-[0.7rem] tracking-[0.12em] uppercase font-semibold" style={{ color: "var(--st)" }}>Pay Online</span>
                          <span className="text-[0.6rem]" style={{ color: "var(--st2)" }}>Razorpay · Auto-verified</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("cash")}
                          className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 transition-all ${
                            paymentMethod === "cash"
                              ? "border-amber-500 bg-amber-500/8"
                              : "border-[var(--sbr)] hover:border-[var(--sp)]"
                          }`}
                        >
                          <span className="text-xl">💵</span>
                          <span className="text-[0.7rem] tracking-[0.12em] uppercase font-semibold" style={{ color: "var(--st)" }}>Pay by Cash</span>
                          <span className="text-[0.6rem]" style={{ color: "var(--st2)" }}>Paid to instructor</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (!!selectedOffering && !paymentMethod)}
                  className="w-full mt-2 px-6 py-3.5 text-[0.72rem] font-medium tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: paymentMethod === "cash" ? "#f59e0b" : "var(--sp)",
                    color: "var(--sb)",
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  {loading
                    ? "Processing…"
                    : paymentMethod === "cash"
                    ? "Confirm & Pay Cash"
                    : paymentMethod === "online"
                    ? `Pay ₹${REGISTRATION_FEE} & Register`
                    : "Submit details"}
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

export default function RegisterForm() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: "var(--sb)" }} />}>
      <RegisterFormInner />
    </Suspense>
  );
}
