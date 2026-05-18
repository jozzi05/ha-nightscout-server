export const DIRECTION_ARROWS: Record<string, string> = {
  DoubleUp: "⇈",
  SingleUp: "↑",
  FortyFiveUp: "↗",
  Flat: "→",
  FortyFiveDown: "↘",
  SingleDown: "↓",
  DoubleDown: "⇊",
  "NOT COMPUTABLE": "?",
  "RATE OUT OF RANGE": "⚠",
};

export function formatTimeAgo(isoString: string, now = Date.now()): string {
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  if (diffMs < 0) return "just now";
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs === 1) return "1 hour ago";
  return `${hrs} hours ago`;
}

export interface GlucoseRanges {
  urgent_low: number;
  urgent_high: number;
  low: number;
  high: number;
  color_urgent: string;
  color_warning: string;
  color_ok: string;
}

export function getGlucoseColor(rawMgdl: number, ranges: GlucoseRanges): string {
  if (rawMgdl < ranges.urgent_low || rawMgdl > ranges.urgent_high) return ranges.color_urgent;
  if (rawMgdl < ranges.low || rawMgdl > ranges.high) return ranges.color_warning;
  return ranges.color_ok;
}
