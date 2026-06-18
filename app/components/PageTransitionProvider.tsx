"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";

interface PageTransitionContextValue {
  navigate: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigate: () => {},
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

function getSeasonColor(): string {
  if (typeof window === "undefined") return "#D4A54B";
  return getComputedStyle(document.documentElement).getPropertyValue("--sp").trim() || "#D4A54B";
}

// 18 strips — equal height for a tight venetian-blind wipe
const FLEX_VALS = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
const N = FLEX_VALS.length;

const COVER_DUR  = 0.32;
const REVEAL_DUR = 0.30;
const STAGGER    = 0.028;
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  // One animation control per strip — must be declared unconditionally (18 strips)
  const c0  = useAnimation(); const c1  = useAnimation(); const c2  = useAnimation();
  const c3  = useAnimation(); const c4  = useAnimation(); const c5  = useAnimation();
  const c6  = useAnimation(); const c7  = useAnimation(); const c8  = useAnimation();
  const c9  = useAnimation(); const c10 = useAnimation(); const c11 = useAnimation();
  const c12 = useAnimation(); const c13 = useAnimation(); const c14 = useAnimation();
  const c15 = useAnimation(); const c16 = useAnimation(); const c17 = useAnimation();
  const controls = [c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14,c15,c16,c17];

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stripColor, setStripColor] = useState("#D4A54B");

  function waitForPaint(): Promise<void> {
    return new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
  }

  /**
   * COVER: strips expand from scaleY 0 → 1, in-place.
   * Bottom strip first → wave rolls upward.
   */
  async function coverScreen() {
    // Reset all to collapsed
    controls.forEach((ctrl) => ctrl.set({ scaleY: 0 }));
    return Promise.all(
      controls.map((ctrl, i) =>
        ctrl.start({
          scaleY: 1,
          transition: { duration: COVER_DUR, ease: EASE, delay: (N - 1 - i) * STAGGER },
        })
      )
    );
  }

  /**
   * REVEAL: strips collapse from scaleY 1 → 0, in-place.
   * Top strip first → wave rolls downward.
   * Only called AFTER new page has painted.
   */
  async function revealScreen() {
    return Promise.all(
      controls.map((ctrl, i) =>
        ctrl.start({
          scaleY: 0,
          transition: { duration: REVEAL_DUR, ease: EASE, delay: i * STAGGER },
        })
      )
    );
  }

  // Initial page load: cover instantly then reveal after paint
  useEffect(() => {
    setStripColor(getSeasonColor());
    controls.forEach((ctrl) => ctrl.set({ scaleY: 1 }));

    const reveal = async () => {
      await waitForPaint();
      await revealScreen();
    };

    if (document.readyState === "complete") {
      reveal();
    } else {
      window.addEventListener("load", reveal, { once: true });
      return () => window.removeEventListener("load", reveal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After pathname changes: wait for paint, then reveal
  useEffect(() => {
    if (!isTransitioning) return;
    const reveal = async () => {
      await waitForPaint();
      await revealScreen();
      setIsTransitioning(false);
    };
    reveal();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const navigate = useCallback(
    async (href: string) => {
      if (href === pathname || isTransitioning) return;
      // Inner pages (non-home) use forest green; home uses seasonal gold
      setStripColor(href === "/" ? getSeasonColor() : "#2F4F46");
      setIsTransitioning(true);
      await coverScreen();
      window.scrollTo({ top: 0, behavior: "instant" });
      router.push(href);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, router, isTransitioning]
  );

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      {children}

      {/* Venetian-blind overlay: strips fixed in place, scale vertically */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none flex flex-col"
        style={{ zIndex: 9990 }}
      >
        {FLEX_VALS.map((flex, i) => (
          <div key={i} style={{ flex, width: "100%", overflow: "hidden" }}>
            <motion.div
              initial={{ scaleY: 1 }}
              animate={controls[i]}
              style={{
                backgroundColor: stripColor,
                width: "100%",
                height: "100%",
                transformOrigin: "center",
              }}
            />
          </div>
        ))}
      </div>
    </PageTransitionContext.Provider>
  );
}