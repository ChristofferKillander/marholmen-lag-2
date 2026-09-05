// Compose-sheet choices, kept in sync with the design
// (design/vibe-check/Vibe Check v2.dc.html — PALETTE / EMOJI / MOODS).
// Update both places together if the design changes.

export const PALETTE = [
  { hex: "#c4ff3d", name: "ACID LIME", emoji: "🍋" },
  { hex: "#ff52d9", name: "HYPER PINK", emoji: "🪩" },
  { hex: "#ff6b2c", name: "TANGERINE", emoji: "🔥" },
  { hex: "#b39bff", name: "DIGITAL LAVENDER", emoji: "👾" },
  { hex: "#6bf2c4", name: "ICE MINT", emoji: "🧊" },
  { hex: "#ffe066", name: "BUTTER", emoji: "🧈" },
  { hex: "#2e5bff", name: "ULTRABLUE", emoji: "🌀" },
  { hex: "#ff3d6e", name: "HOT CORAL", emoji: "💅" },
] as const;

export const EMOJI = [
  "🔥", "⚡", "🫠", "👾", "🧠", "🪩", "🍄", "🌀",
  "💅", "🐸", "🧊", "🛼", "☕", "😵‍💫", "🚀", "🎧", "🦆", "✨",
] as const;

export const MOODS = ["horizontal", "recovering", "cruising", "cooking", "unhinged"] as const;

export const ENERGY_LEVELS = [1, 2, 3, 4, 5] as const;

export const VALID_COLORS = new Set(PALETTE.map((p) => p.hex));
export const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function moodForEnergy(avgEnergy: number): string {
  const index = Math.min(4, Math.max(0, Math.round(avgEnergy) - 1));
  return MOODS[index];
}
