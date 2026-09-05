import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withCors, sendError } from "../lib/http";
import { PALETTE, EMOJI, ENERGY_LEVELS, MOODS } from "../lib/constants";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (withCors(req, res)) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return sendError(res, 405, "Method not allowed");
  }

  res.status(200).json({
    colors: PALETTE,
    emojis: EMOJI,
    energyLevels: ENERGY_LEVELS,
    moods: MOODS,
  });
}
