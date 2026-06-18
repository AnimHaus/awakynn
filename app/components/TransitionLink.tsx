"use client";

import { usePageTransition } from "./PageTransitionProvider";
import type { ComponentPropsWithoutRef } from "react";

type TransitionLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
};

export default function TransitionLink({ href, onClick, children, ...props }: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks (cmd/ctrl/shift/middle) pass through normally
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    // External links or hash-only links pass through
    if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#")) return;

    e.preventDefault();
    onClick?.(e);
    navigate(href);
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
