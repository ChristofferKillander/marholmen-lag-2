import type { Vibe } from "@prisma/client";
import { PALETTE, moodForEnergy } from "./constants";

// Computed fresh from all live vibes on every request — cheap at
// hackathon scale, no need for a materialized/cached aggregate.
export function computePulse(vibes: Vibe[]) {
  const peopleOnline = new Set(vibes.map((v) => v.name)).size;

  const teamEnergy = vibes.length
    ? Math.round((vibes.reduce((sum, v) => sum + v.energy, 0) / vibes.length) * 10) / 10
    : 0;

  const mood = moodForEnergy(teamEnergy);

  const counts = new Map<string, number>();
  for (const v of vibes) {
    counts.set(v.color, (counts.get(v.color) ?? 0) + 1);
  }

  const colorBoard = PALETTE.map((p) => ({ ...p, count: counts.get(p.hex) ?? 0 }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);

  // `loudestColor` is required by the spec even with zero posts yet,
  // so fall back to the first palette entry (count 0) rather than null.
  const loudestColor = colorBoard[0] ?? { ...PALETTE[0], count: 0 };

  const hypeLeaders = [...vibes]
    .sort((a, b) => b.energy - a.energy || b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4);

  return { peopleOnline, teamEnergy, mood, loudestColor, colorBoard, hypeLeaders };
}
