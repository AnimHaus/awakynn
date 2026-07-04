"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type Offering = {
  slug: string;
  name: string;
  price: string;
  amount: number;
  note: string;
  planId?: string;
};

type Props = {
  offering: Offering;
  onClose: () => void;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
};

export default function BookingModal({ offering, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Trap focus and close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (offering.amount === 0) {
      window.location.href = "/contact";
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (offering.planId) {
        // ── Subscription flow ────────────────────────────────────────────
        const res = await fetch(`${API_BASE}/services/subscriptions/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan_id: offering.planId,
            service_slug: offering.slug,
            service_name: offering.name,
            amount: offering.amount,
            customer_name: form.name,
            customer_email: form.email,
            customer_phone: form.phone,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: "Failed to create subscription" }));
          throw new Error(err.detail ?? "Failed to create subscription");
        }
        const data = await res.json();

        await new Promise<void>((resolve, reject) => {
          const rzp = new (
            window as unknown as { Razorpay: new (opts: object) => { open(): void } }
          ).Razorpay({
            key: data.key_id,
            subscription_id: data.subscription_id,
            name: "Awakynn",
            description: offering.name,
            prefill: {
              name: form.name,
              email: form.email,
              contact: form.phone,
            },
            theme: { color: "#2F4F46" },
            handler: async (response: {
              razorpay_subscription_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              try {
                const verifyRes = await fetch(
                  `${API_BASE}/services/subscriptions/${data.booking_id}/verify-payment`,
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
            modal: {
              ondismiss: () => reject(new Error("cancelled")),
            },
          });
          rzp.open();
        });
      } else {
        // ── One-time payment flow ────────────────────────────────────────
        const res = await fetch(`${API_BASE}/services/bookings/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_slug: offering.slug,
            service_name: offering.name,
            amount: offering.amount,
            customer_name: form.name,
            customer_email: form.email,
            customer_phone: form.phone,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: "Failed to create booking" }));
          throw new Error(err.detail ?? "Failed to create booking");
        }
        const data = await res.json();

        await new Promise<void>((resolve, reject) => {
          const rzp = new (
            window as unknown as { Razorpay: new (opts: object) => { open(): void } }
          ).Razorpay({
            key: data.key_id,
            amount: data.amount,
            currency: data.currency,
            order_id: data.razorpay_order_id,
            name: "Awakynn",
            description: offering.name,
            prefill: {
              name: form.name,
              email: form.email,
              contact: form.phone,
            },
            theme: { color: "#2F4F46" },
            handler: async (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              try {
                const verifyRes = await fetch(
                  `${API_BASE}/services/bookings/${data.booking_id}/verify-payment`,
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
            modal: {
              ondismiss: () => reject(new Error("cancelled")),
            },
          });
          rzp.open();
        });
      }

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "cancelled") {
        setError("Payment was cancelled. You can try again.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-transparent border border-[var(--sbr)] rounded-xl px-4 py-3 text-[var(--st)] placeholder:text-[var(--st2)] focus:outline-none focus:border-[var(--sp)] transition-colors text-sm";
  const labelCls = "block text-[0.65rem] tracking-[0.14em] uppercase text-[var(--st2)] mb-1.5";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm"
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      >
        <div className="relative w-full max-w-md bg-background rounded-3xl shadow-2xl p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-[var(--st2)] hover:text-[var(--st)] transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>

          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-5">
                <span className="text-forest text-2xl">✓</span>
              </div>
              <h2 className="font-display text-2xl font-light text-forest mb-3">Booking Confirmed</h2>
              <p className="text-[var(--st2)] text-sm leading-relaxed mb-6">
                {offering.planId
                  ? "Your subscription is active. Your first payment has been collected."
                  : "Your spot is reserved. We'll reach out shortly with session details."}
              </p>
              <button
                onClick={onClose}
                className="bg-forest text-background rounded-full px-7 py-2.5 text-sm tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-[0.6rem] tracking-[0.18em] uppercase text-[var(--st2)] mb-1">{offering.note}</p>
              <h2 className="font-display text-xl font-light text-[var(--st)] mb-1">{offering.name}</h2>
              <p className="text-gold font-semibold text-sm mb-6">{offering.price}</p>

              {offering.amount === 0 ? (
                <div>
                  <p className="text-[var(--st2)] text-sm leading-relaxed mb-6">
                    This offering is custom-priced. Fill in your details and we'll get back to you with a tailored plan.
                  </p>
                  <button
                    onClick={() => { window.location.href = "/contact"; }}
                    className="w-full bg-forest text-background rounded-full py-3 text-sm tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
                  >
                    Go to Contact →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className={labelCls}>Your Name</label>
                    <input
                      required
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      className={inputCls}
                      placeholder="Ananya Das"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className={inputCls}
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input
                      required
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className={inputCls}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full bg-forest text-background rounded-full py-3.5 text-sm tracking-widest uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {loading ? "Opening Payment…" : offering.planId ? `Subscribe ${offering.price}` : `Pay ${offering.price}`}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
