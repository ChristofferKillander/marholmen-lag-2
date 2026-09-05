/** Formats an age in seconds as "now" / "Nm" / "Nh". Ported from the design's `ago()`. */
export function ago(sec: number): string {
  if (sec < 45) return 'now';
  if (sec < 3600) return `${Math.round(sec / 60)}m`;
  return `${Math.round(sec / 3600)}h`;
}

/** Seconds elapsed between an ISO timestamp and now (never negative). */
export function secondsSince(iso: string, now: number = Date.now()): number {
  return Math.max(0, (now - new Date(iso).getTime()) / 1000);
}
