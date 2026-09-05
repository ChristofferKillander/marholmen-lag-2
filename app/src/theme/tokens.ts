/**
 * Design tokens lifted directly from `design/vibe-check/Vibe Check v2.dc.html`.
 *
 * This screen does NOT use the "Modernist" design system's own tokens
 * (flat red/white, zero border-radius) — it hardcodes its own dark neon
 * palette inline. Keep these values in sync with the .dc.html if the design
 * changes; don't reach for the Modernist ramps here.
 */

export interface PaletteColor {
  hex: string;
  name: string;
  emoji: string;
}

/** The 8 selectable "vibe" colours, in the design's original order. */
export const PALETTE: PaletteColor[] = [
  { hex: '#c4ff3d', name: 'ACID LIME', emoji: '🍋' },
  { hex: '#ff52d9', name: 'HYPER PINK', emoji: '🪩' },
  { hex: '#ff6b2c', name: 'TANGERINE', emoji: '🔥' },
  { hex: '#b39bff', name: 'DIGITAL LAVENDER', emoji: '👾' },
  { hex: '#6bf2c4', name: 'ICE MINT', emoji: '🧊' },
  { hex: '#ffe066', name: 'BUTTER', emoji: '🧈' },
  { hex: '#2e5bff', name: 'ULTRABLUE', emoji: '🌀' },
  { hex: '#ff3d6e', name: 'HOT CORAL', emoji: '💅' },
];

export const EMOJI: string[] = [
  '🔥', '⚡', '🫠', '👾', '🧠', '🪩', '🍄', '🌀',
  '💅', '🐸', '🧊', '🛼', '☕', '😵‍💫', '🚀', '🎧', '🦆', '✨',
];

export const MOODS: string[] = ['horizontal', 'recovering', 'cruising', 'cooking', 'unhinged'];

export const ENERGY_LEVELS: number[] = [1, 2, 3, 4, 5];

/** Archivo is the design's one and only font, loaded via @expo-google-fonts/archivo. */
export const FONTS = {
  heading: 'Archivo_800ExtraBold',
  body: 'Archivo_700Bold',
} as const;

export const colors = {
  bg: '#0e0b14',
  bgGradientTop: '#241a3a',
  text: '#f6f2ff',

  sheetBg: '#1c1628',
  sheetBackdrop: 'rgba(8,5,14,0.6)',

  cta: '#ff52d9',
  ctaInk: '#170a14',
  ctaShadow: 'rgba(255,82,217,0.35)',

  tickerBg: '#c4ff3d',
  tickerInk: '#12101a',

  pillInactiveBg: 'rgba(255,255,255,0.08)',
  pillInactiveText: 'rgba(246,242,255,0.7)',
  pillActiveBg: '#f6f2ff',

  border: 'rgba(255,255,255,0.14)',
  borderStrong: 'rgba(255,255,255,0.18)',
  divider: 'rgba(255,255,255,0.12)',

  chipBg: 'rgba(0,0,0,0.14)',
  meterOff: 'rgba(24,13,18,0.2)',
  meterOn: 'rgba(24,13,18,0.85)',

  inputBg: 'rgba(255,255,255,0.07)',
  cardOverlaySoft: 'rgba(255,255,255,0.05)',
  cardOverlay: 'rgba(255,255,255,0.06)',
  trackBg: 'rgba(255,255,255,0.09)',

  onlineDot: '#c4ff3d',
} as const;

/** ROOM ENERGY header card gradient. */
export const energyCardGradient = ['#ff3d6e', '#ff6b2c', '#c4ff3d'] as const;
export const energyCardInk = '#180d12';

export const emojiPickerActiveBorder = '#c4ff3d';
export const emojiPickerActiveBg = 'rgba(196,255,61,0.16)';
