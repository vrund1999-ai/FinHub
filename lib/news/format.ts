// Relative time for an ISO timestamp, e.g. "14 min ago", "3h ago", "2d ago".
// Takes `now` explicitly so callers render deterministically per request.
export function formatTimeAgo(iso: string, now: Date): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// Rough read-time estimate at ~200 wpm, floored at 1 minute. Finnhub gives no
// read time, so we estimate from whatever text we have.
export function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
