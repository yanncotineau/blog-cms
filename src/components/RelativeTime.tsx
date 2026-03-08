"use client";

import { useState, useEffect } from "react";
import { relativeFromNow } from "@/lib/format";

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
