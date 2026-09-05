import { ENERGY_LEVELS, EMOJI, MOODS, PALETTE } from '../theme/tokens';
import type { VibeCheckApi } from './client';
import type { ColorBoardEntry, ComposeOptions, Energy, Pulse, Vibe, VibeCreate } from './types';

/**
 * In-memory mock backend, used until the real Vercel/Prisma API (built from
 * `api/vibe-check.openapi.yaml`) is deployed — see `src/api/index.ts` for the
 * switch. Seed data and the simulated "teammate posts" loop are ported 1:1
 * from `design/vibe-check/Vibe Check v2.dc.html` so the app feels alive with
 * zero backend.
 */

interface Seed {
  name: string;
  emoji: string;
  status: string;
  color: string;
  energy: Energy;
  /** Seconds before "now" this seed was posted. */
  ageSec: number;
}

const SEEDS: Seed[] = [
  { name: 'Aylin', emoji: '🚀', status: 'websocket sync is ALIVE', color: '#c4ff3d', energy: 5, ageSec: 40 },
  { name: 'Jonas', emoji: '☕', status: 'fourth coffee, second wind', color: '#ff6b2c', energy: 4, ageSec: 130 },
  { name: 'Priya', emoji: '🎧', status: 'deep in the particle canvas', color: '#2e5bff', energy: 4, ageSec: 260 },
  { name: 'Milo', emoji: '🐸', status: 'merge conflict purgatory', color: '#ffe066', energy: 2, ageSec: 420 },
  { name: 'Sara', emoji: '🪩', status: 'emoji picker done, streaks next', color: '#ff52d9', energy: 5, ageSec: 610 },
  { name: 'Otto', emoji: '🫠', status: 'css grid has defeated me', color: '#6bf2c4', energy: 2, ageSec: 880 },
  { name: 'Nadia', emoji: '✨', status: 'demo script draft one is up', color: '#b39bff', energy: 4, ageSec: 1150 },
  { name: 'Kris', emoji: '🔥', status: 'confetti cannon works. too well.', color: '#ff3d6e', energy: 5, ageSec: 1480 },
];

const BOT_LINES: Array<[name: string, emoji: string, status: string]> = [
  ['Aylin', '👾', 'reconnect logic shipped'],
  ['Milo', '⚡', 'out of merge hell, back on the wall'],
  ['Otto', '🛼', 'found the layout bug. it was me.'],
  ['Priya', '🌀', 'particles react to room energy now'],
  ['Nadia', '🧊', 'judges briefed, we present sixth'],
  ['Sara', '😵‍💫', 'sticker sheet done, brain empty'],
  ['Jonas', '🦆', "refill run — who's in?"],
  ['Kris', '🧠', 'snapshot export renders 4k'],
];

const BOT_INTERVAL_MS = 7000;
const MAX_VIBES = 40;

function seedVibes(): Vibe[] {
  const now = Date.now();
  return SEEDS.map((s, i) => ({
    id: `s${i}`,
    name: s.name,
    emoji: s.emoji,
    status: s.status,
    color: s.color,
    energy: s.energy,
    createdAt: new Date(now - s.ageSec * 1000).toISOString(),
  }));
}

// Module-level store so the simulated bot loop and every hook consuming the
// mock client share the same state, same as a real singleton backend would.
let vibes: Vibe[] = seedVibes();
let botIndex = 0;
let botLoopStarted = false;

function startBotLoop() {
  if (botLoopStarted) return;
  botLoopStarted = true;
  setInterval(() => {
    const i = botIndex % BOT_LINES.length;
    const [name, emoji, status] = BOT_LINES[i];
    const color = PALETTE[(i * 3 + 2) % PALETTE.length].hex;
    const energy = (2 + (i % 4)) as Energy;
    const vibe: Vibe = {
      id: `b${Date.now()}`,
      name,
      emoji,
      status,
      color,
      energy,
      createdAt: new Date().toISOString(),
    };
    vibes = [vibe, ...vibes].slice(0, MAX_VIBES);
    botIndex += 1;
  }, BOT_INTERVAL_MS);
}

function computePulse(): Pulse {
  const counts = new Map<string, number>();
  for (const v of vibes) counts.set(v.color, (counts.get(v.color) ?? 0) + 1);

  const ranked: ColorBoardEntry[] = PALETTE.map((p) => ({
    hex: p.hex,
    name: p.name,
    emoji: p.emoji,
    count: counts.get(p.hex) ?? 0,
  })).sort((a, b) => b.count - a.count);

  const avg = vibes.length ? vibes.reduce((sum, v) => sum + v.energy, 0) / vibes.length : 0;
  const moodIndex = Math.min(4, Math.max(0, Math.round(avg) - 1));

  const hypeLeaders = [...vibes]
    .sort((a, b) => b.energy - a.energy || (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);

  return {
    peopleOnline: new Set(vibes.map((v) => v.name)).size,
    teamEnergy: Math.round(avg * 10) / 10,
    mood: MOODS[moodIndex],
    loudestColor: ranked[0],
    colorBoard: ranked.filter((r) => r.count > 0),
    hypeLeaders,
  };
}

export function createMockClient(): VibeCheckApi {
  startBotLoop();

  return {
    async listVibes(params = {}) {
      const { limit = MAX_VIBES, since } = params;
      let list = vibes;
      if (since) {
        const cutoff = new Date(since).getTime();
        list = list.filter((v) => new Date(v.createdAt).getTime() > cutoff);
      }
      return list.slice(0, limit);
    },

    async postVibe(input: VibeCreate) {
      const status = input.status.trim();
      if (!status) throw new Error('status is required');
      const vibe: Vibe = {
        id: `u${Date.now()}`,
        name: input.name?.trim() || 'you',
        emoji: input.emoji || '🔥',
        status,
        color: input.color,
        energy: input.energy,
        createdAt: new Date().toISOString(),
      };
      vibes = [vibe, ...vibes].slice(0, MAX_VIBES);
      return vibe;
    },

    async getPulse() {
      return computePulse();
    },

    async getComposeOptions(): Promise<ComposeOptions> {
      return {
        colors: PALETTE.map((p) => ({ hex: p.hex, name: p.name, emoji: p.emoji })),
        emojis: EMOJI,
        energyLevels: ENERGY_LEVELS,
        moods: MOODS,
      };
    },
  };
}
