"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type MagneticProps = {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  as?: "div" | "button" | "a";
  href?: string;
  onClick?: () => void;
};

export default function Magnetic({
  children,
  strength = 0.4,
  className,
  as = "div",
  href,
  onClick,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 15, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref as never}
      href={href as never}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      data-hovered={hovered}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
