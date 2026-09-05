import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../lib/prisma";
import { withCors, sendError } from "../lib/http";
import { computePulse } from "../lib/pulse";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (withCors(req, res)) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return sendError(res, 405, "Method not allowed");
  }

  const vibes = await prisma.vibe.findMany({ orderBy: { createdAt: "desc" } });
  res.status(200).json(computePulse(vibes));
}
