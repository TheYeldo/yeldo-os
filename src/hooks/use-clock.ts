"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/routing";

export function useClock(locale: Locale, format: "12" | "24") {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initial = window.setTimeout(() => setNow(new Date()), 0);
    const timer = window.setInterval(() => setNow(new Date()), 1_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  if (!now) return { time: "--:--", date: "" };

  return {
    time: new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: format === "12",
    }).format(now),
    date: new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(now),
  };
}
