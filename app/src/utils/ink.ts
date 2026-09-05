/**
 * Picks a readable ink (text) colour for a given background hex, using
 * relative luminance (WCAG-style). Ported 1:1 from the design's `ink()`.
 */
export function ink(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  return luminance > 0.42 ? '#14101c' : '#fdfbff';
}
