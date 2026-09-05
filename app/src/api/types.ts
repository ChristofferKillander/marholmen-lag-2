/**
 * Types mirroring the schemas in `api/vibe-check.openapi.yaml`.
 * Keep these in sync with the spec if it changes.
 */

export type Energy = 1 | 2 | 3 | 4 | 5;

export interface Vibe {
  id: string;
  name: string;
  emoji: string;
  status: string;
  /** Hex colour, e.g. "#c4ff3d". */
  color: string;
  energy: Energy;
  /** ISO 8601 date-time. */
  createdAt: string;
}

export interface VibeCreate {
  name?: string;
  emoji?: string;
  status: string;
  color: string;
  energy: Energy;
}

export interface ColorBoardEntry {
  hex: string;
  name: string;
  emoji: string;
  count: number;
}

export interface Pulse {
  peopleOnline: number;
  teamEnergy: number;
  mood: string;
  loudestColor: ColorBoardEntry;
  colorBoard: ColorBoardEntry[];
  hypeLeaders: Vibe[];
}

export interface ComposeColorOption {
  hex: string;
  name: string;
  emoji: string;
}

export interface ComposeOptions {
  colors: ComposeColorOption[];
  emojis: string[];
  energyLevels: number[];
  moods: string[];
}

export interface ApiError {
  error: string;
}
