"use client";

import { useState, useEffect } from "react";

function relativeFromNow(input: string) {
  const d = new Date(input).getTime();
  const diffMs = Date.now() - d;
  const abs = Math.abs(diffMs);

  const sec = 1000;
  const min = 60 * sec;
  const hour = 60 * min;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (abs >= year) { value = Math.round(diffMs / year); unit = "year"; }
  else if (abs >= month) { value = Math.round(diffMs / month); unit = "month"; }
  else if (abs >= week) { value = Math.round(diffMs / week); unit = "week"; }
  else if (abs >= day) { value = Math.round(diffMs / day); unit = "day"; }
  else if (abs >= hour) { value = Math.round(diffMs / hour); unit = "hour"; }
  else if (abs >= min) { value = Math.round(diffMs / min); unit = "minute"; }
  else { value = Math.round(diffMs / sec); unit = "second"; }

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-value, unit);
}

export default function RelativeTime({ date }: { date: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    setText(relativeFromNow(date));
    const interval = setInterval(() => {
      setText(relativeFromNow(date));
    }, 60_000);
    return () => clearInterval(interval);
  }, [date]);

  if (!text) return null;
  return <>{text}</>;
}
