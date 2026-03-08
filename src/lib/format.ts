/**
 * Shared formatting utilities — single source of truth for
 * date formatting, relative time, and hash display.
 */

export function formatDate(input?: string) {
  if (!input) return null;
  try {
    return new Date(input).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return input;
  }
}

export function formatFullDateTime(input?: string) {
  if (!input) return null;
  try {
    return new Date(input).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return input;
  }
}

export function relativeFromNow(input?: string) {
  if (!input) return null;
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

export function shortHash(hash?: string) {
  return hash ? hash.slice(0, 7) : "";
}
