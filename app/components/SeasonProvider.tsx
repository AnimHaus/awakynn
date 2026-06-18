"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Season = "summer" | "monsoon" | "autumn" | "winter";

interface SeasonCtx {
  season: Season;
  setSeason: (s: Season) => void;
  heroVideoActive: boolean;
  setHeroVideoActive: (v: boolean) => void;
}

const SeasonContext = createContext<SeasonCtx>({
  season: "summer",
  setSeason: () => {},
  heroVideoActive: false,
  setHeroVideoActive: () => {},
});

export function useSeasonContext() {
  return useContext(SeasonContext);
}

function detectSeason(): Season {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return "summer";
  if (m >= 6 && m <= 9) return "monsoon";
  if (m >= 10 && m <= 11) return "autumn";
  return "winter";
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export function SeasonProvider({ children }: { children: React.ReactNode }) {
  const [season, setSeason] = useState<Season>(detectSeason());
  const [heroVideoActive, setHeroVideoActive] = useState(false);

  // Fetch season from backend on mount; fall back to calendar detection
  useEffect(() => {
    fetch(`${API_BASE}/settings/season`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.season) setSeason(d.season as Season); })
      .catch(() => { /* keep detected season */ });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-season", season);
  }, [season]);

  return (
    <SeasonContext.Provider value={{ season, setSeason, heroVideoActive, setHeroVideoActive }}>
      {children}
    </SeasonContext.Provider>
  );
}
