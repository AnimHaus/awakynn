"use client";

import { useState, useEffect } from "react";

const EVENT_DATE = new Date("2026-06-21T04:30:00.000Z");
const CLASS_END  = new Date("2026-06-22T01:30:00.000Z");
const MEET_LINK  = "https://meet.google.com/qba-iprk-bqn";

// Checks once on mount whether we're inside the live window.
// No interval needed — the button appearance doesn't need to update per-second.
export default function ConditionalJoinButton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const now = Date.now();
    setVisible(now >= EVENT_DATE.getTime() && now < CLASS_END.getTime());
  }, []);

  if (!visible) return null;

  return (
    <a
      href={MEET_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "group inline-flex items-center justify-between gap-8 border px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#C8A86B] hover:border-[#C8A86B] hover:!text-white"
      }
      style={style ?? { borderColor: "#C8A86B", color: "#C8A86B" }}
    >
      Join the class
      <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
    </a>
  );
}
