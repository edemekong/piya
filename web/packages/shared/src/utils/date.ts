export function formatShortDate(
  timestamp?: number | null,
  fallback = "Not yet",
  locale = "en",
) {
  if (!timestamp) return fallback;

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}

export const formatDate = formatShortDate;

export function formatTime(timestamp: number, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

export function timestampToDateInput(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export function dateInputToTimestamp(value: string) {
  if (!value) return null;

  const timestamp = new Date(`${value}T00:00:00`).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function dateInputToDate(value: string) {
  if (!value) return null;

  return new Date(`${value}T00:00:00`);
}

export function dateToDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatRelativeTime(timestamp: number) {
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.round(hours / 24)}d ago`;
}
