import TransitionLink from "./components/TransitionLink";

export default function Forbidden() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ backgroundColor: "#faf8f5" }}
    >
      {/* Giant background numeral */}
      <span
        className="font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[40vw] font-light leading-none"
        style={{ color: "rgba(200,168,107,0.08)" }}
        aria-hidden
      >
        403
      </span>

      <div className="relative z-10">
        <span
          className="mb-6 block text-[0.65rem] font-medium tracking-[0.25em]"
          style={{ color: "#C8A86B" }}
        >
          ACCESS RESTRICTED
        </span>

        <h1
          className="font-display text-5xl font-light leading-[0.95] md:text-7xl"
          style={{ color: "#2F4F46" }}
        >
          This space
          <br />
          <span className="italic" style={{ color: "#C8A86B" }}>
            is not yet yours.
          </span>
        </h1>

        <p
          className="mx-auto mt-7 max-w-sm text-base leading-relaxed"
          style={{ color: "rgba(34,34,34,0.55)" }}
        >
          You don&apos;t have permission to view this page. If you believe this
          is an error, please reach out and we will guide you through.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <TransitionLink
            href="/"
            className="group inline-flex items-center justify-between gap-6 border px-6 py-3.5 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300"
            style={{ borderColor: "#2F4F46", color: "#2F4F46" }}
          >
            Back to home
            <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
          </TransitionLink>
          <TransitionLink
            href="/contact"
            className="group inline-flex items-center justify-between gap-6 border px-6 py-3.5 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-70"
            style={{ borderColor: "rgba(34,34,34,0.2)", color: "rgba(34,34,34,0.55)" }}
          >
            Contact us
            <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
          </TransitionLink>
        </div>
      </div>
    </main>
  );
}
