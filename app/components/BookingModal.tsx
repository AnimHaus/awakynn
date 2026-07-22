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

type CashReceipt = {
  bookingId: string;
  service: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  date: string;
  isSubscription: boolean;
};

// ── Receipt screen ────────────────────────────────────────────────────────────

function ReceiptScreen({ receipt, onClose }: { receipt: CashReceipt; onClose: () => void }) {
  const short = receipt.bookingId.slice(-8).toUpperCase();

  function handlePrint() {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Awakynn Receipt — AWK-${short}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; color: #1a1a1a; background: #fff; padding: 40px; max-width: 560px; margin: 0 auto; }
    .logo { font-size: 22px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #2F4F46; margin-bottom: 4px; }
    .subtitle { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #e9a84c; font-weight: 600; margin-bottom: 32px; }
    .card { border: 1px solid #ddd; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
    .ref-row { display: flex; justify-content: space-between; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid #eee; }
    .label { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: #888; margin-bottom: 3px; }
    .value { font-size: 14px; color: #1a1a1a; }
    .ref { font-family: monospace; font-size: 18px; font-weight: 700; letter-spacing: 0.2em; color: #2F4F46; }
    .row { display: flex; justify-content: space-between; align-items: baseline; padding: 5px 0; }
    .row-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #888; }
    .row-value { font-size: 13px; color: #1a1a1a; text-align: right; }
    .row-value.bold { font-weight: 700; font-size: 16px; }
    .divider { border: none; border-top: 1px solid #eee; margin: 12px 0; }
    .notice { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 14px 16px; font-size: 12px; line-height: 1.6; color: #92400e; }
    .notice strong { font-weight: 600; }
    .footer { margin-top: 28px; font-size: 10px; color: #aaa; text-align: center; letter-spacing: 0.1em; }
  </style>
</head>
<body>
  <div class="logo">Awakynn</div>
  <div class="subtitle">Cash Booking Receipt · Pending Payment</div>
  <div class="card">
    <div class="ref-row">
      <div>
        <div class="label">Booking Reference</div>
        <div class="ref">AWK-${short}</div>
      </div>
      <div style="text-align:right">
        <div class="label">Date</div>
        <div class="value">${receipt.date}</div>
      </div>
    </div>
    <div class="row"><span class="row-label">Service</span><span class="row-value">${receipt.service}</span></div>
    <div class="row"><span class="row-label">Type</span><span class="row-value">${receipt.isSubscription ? "Monthly Subscription" : "One-time Booking"}</span></div>
    <div class="row"><span class="row-label">Amount</span><span class="row-value bold">₹${receipt.amount}</span></div>
    <div class="row"><span class="row-label">Payment Method</span><span class="row-value">Cash</span></div>
    <hr class="divider" />
    <div class="row"><span class="row-label">Customer</span><span class="row-value">${receipt.name}</span></div>
    ${receipt.email ? `<div class="row"><span class="row-label">Email</span><span class="row-value">${receipt.email}</span></div>` : ""}
    <div class="row"><span class="row-label">Phone</span><span class="row-value">${receipt.phone}</span></div>
  </div>
  <div class="notice">
    <strong>Next step:</strong> Please present this receipt to your instructor before or during your first session.
    Your booking is confirmed — payment will be collected in person.
  </div>
  <div class="footer">awakynn.com · This is a booking confirmation, not a payment receipt.</div>
  <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; }</script>
</body>
</html>`;
    const w = window.open("", "_blank", "width=640,height=800");
    if (w) { w.document.write(html); w.document.close(); }
  }

  return (
    <div className="text-center">
      <div>
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-light text-[var(--st)] mb-1">Cash Booking Receipt</h2>
          <p className="text-amber-600 text-xs tracking-[0.18em] uppercase font-medium">Pending — Payment to be collected</p>
        </div>

        {/* Receipt card */}
        <div className="bg-[var(--sb)] border border-[var(--sbr)] rounded-2xl p-6 text-left mb-6">
          <div className="flex justify-between items-start mb-5 pb-4 border-b border-[var(--sbr)]">
            <div>
              <p className="text-[0.6rem] tracking-[0.16em] uppercase text-[var(--st2)] mb-0.5">Booking Reference</p>
              <p className="font-mono font-bold text-[var(--st)] text-lg tracking-widest">AWK-{short}</p>
            </div>
            <div className="text-right">
              <p className="text-[0.6rem] tracking-[0.16em] uppercase text-[var(--st2)] mb-0.5">Date</p>
              <p className="text-[var(--st)] text-sm font-medium">{receipt.date}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Row label="Service" value={receipt.service} />
            <Row label="Type" value={receipt.isSubscription ? "Monthly Subscription" : "One-time Booking"} />
            <Row label="Amount" value={`₹${receipt.amount}`} bold />
            <Row label="Payment Method" value="Cash" />
            <div className="pt-3 mt-3 border-t border-[var(--sbr)]">
              <Row label="Customer" value={receipt.name} />
              {receipt.email && <Row label="Email" value={receipt.email} />}
              <Row label="Phone" value={receipt.phone} />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 text-left mb-6">
          <p className="text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
            <span className="font-semibold">Next step:</span> Please present this receipt to your instructor
            before or during your first session. Your booking is confirmed — payment will be collected in person.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 border border-[var(--sbr)] text-[var(--st2)] hover:text-[var(--st)] rounded-full py-2.5 text-sm tracking-widest uppercase font-medium transition-colors"
          >
            Save / Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-forest text-background rounded-full py-2.5 text-sm tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-[0.65rem] tracking-[0.12em] uppercase text-[var(--st2)] shrink-0">{label}</span>
      <span className={`text-[var(--st)] text-sm text-right ${bold ? "font-bold text-base" : ""}`}>{value}</span>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function BookingModal({ offering, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cashReceipt, setCashReceipt] = useState<CashReceipt | null>(null);

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

  async function handleCashSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/services/bookings/cash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_slug: offering.slug,
          service_name: offering.name,
          amount: offering.amount,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          is_subscription: !!offering.planId,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to create booking" }));
        throw new Error(err.detail ?? "Failed to create booking");
      }
      const data = await res.json();
      setCashReceipt({
        bookingId: data.id,
        service: offering.name,
        name: form.name,
        email: form.email,
        phone: form.phone,
        amount: offering.amount,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        isSubscription: !!offering.planId,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOnlineSubmit(e: React.FormEvent) {
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
            prefill: { name: form.name, email: form.email, contact: form.phone },
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
            modal: { ondismiss: () => reject(new Error("cancelled")) },
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
            prefill: { name: form.name, email: form.email, contact: form.phone },
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
            modal: { ondismiss: () => reject(new Error("cancelled")) },
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

  function renderBody() {
    // Cash receipt
    if (cashReceipt) {
      return <ReceiptScreen receipt={cashReceipt} onClose={onClose} />;
    }

    // Online success
    if (success) {
      return (
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
      );
    }

    // Free / contact offering
    if (offering.amount === 0) {
      return (
        <>
          <p className="text-[0.6rem] tracking-[0.18em] uppercase text-[var(--st2)] mb-1">{offering.note}</p>
          <h2 className="font-display text-xl font-light text-[var(--st)] mb-1">{offering.name}</h2>
          <p className="text-gold font-semibold text-sm mb-6">{offering.price}</p>
          <p className="text-[var(--st2)] text-sm leading-relaxed mb-6">
            This offering is custom-priced. Fill in your details and we'll get back to you with a tailored plan.
          </p>
          <button
            onClick={() => { window.location.href = "/contact"; }}
            className="w-full bg-forest text-background rounded-full py-3 text-sm tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
          >
            Go to Contact →
          </button>
        </>
      );
    }

    const detailsFilled = form.name.trim() && form.email.trim() && form.phone.trim();

    return (
      <>
        <p className="text-[0.6rem] tracking-[0.18em] uppercase text-[var(--st2)] mb-1">{offering.note}</p>
        <h2 className="font-display text-xl font-light text-[var(--st)] mb-1">{offering.name}</h2>
        <p className="text-gold font-semibold text-sm mb-6">{offering.price}</p>

        {/* Step 1: details form — always shown */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!paymentMethod) return;
            if (paymentMethod === "cash") handleCashSubmit(e);
            else handleOnlineSubmit(e);
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className={labelCls}>Your Name</label>
            <input required type="text" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Ananya Das" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input required type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="you@email.com" />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input required type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
          </div>

          {/* Step 2: payment method picker — appears after details */}
          {detailsFilled && (
            <div className="mt-1">
              <p className={labelCls}>Choose payment method</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 transition-all ${
                    paymentMethod === "online"
                      ? "border-forest bg-forest/8"
                      : "border-[var(--sbr)] hover:border-[var(--sp)]"
                  }`}
                >
                  <span className="text-xl">💳</span>
                  <span className="text-[0.7rem] tracking-[0.12em] uppercase font-semibold text-[var(--st)]">Pay Online</span>
                  <span className="text-[0.6rem] text-[var(--st2)]">Razorpay · Auto-verified</span>
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
                  <span className="text-[0.7rem] tracking-[0.12em] uppercase font-semibold text-[var(--st)]">Pay by Cash</span>
                  <span className="text-[0.6rem] text-[var(--st2)]">Paid to instructor</span>
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-xs">{error}</p>}

          {paymentMethod && (
            <button
              type="submit"
              disabled={loading}
              className={`mt-1 w-full rounded-full py-3.5 text-sm tracking-widest uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-60 ${
                paymentMethod === "cash"
                  ? "bg-amber-500 text-white"
                  : "bg-forest text-background"
              }`}
            >
              {loading
                ? paymentMethod === "cash" ? "Confirming…" : "Opening Payment…"
                : paymentMethod === "cash"
                ? "Confirm Cash Booking"
                : offering.planId
                ? `Subscribe ${offering.price}`
                : `Pay ${offering.price}`}
            </button>
          )}
        </form>
      </>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm"
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      >
        <div className="relative w-full max-w-md bg-background rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-[var(--st2)] hover:text-[var(--st)] transition-colors text-xl leading-none no-print"
            aria-label="Close"
          >
            ×
          </button>
          {renderBody()}
        </div>
      </div>
    </>
  );
}