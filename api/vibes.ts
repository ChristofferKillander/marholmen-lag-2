import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../lib/prisma";
import { withCors, sendError } from "../lib/http";
import { HEX_COLOR_RE } from "../lib/constants";

const DEFAULT_LIMIT = 40;
const MAX_LIMIT = 100;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (withCors(req, res)) return;

  if (req.method === "GET") {
    return listVibes(req, res);
  }
  if (req.method === "POST") {
    return postVibe(req, res);
  }
  res.setHeader("Allow", "GET, POST, OPTIONS");
  return sendError(res, 405, "Method not allowed");
}

async function listVibes(req: VercelRequest, res: VercelResponse) {
  const limitParam = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
  const sinceParam = Array.isArray(req.query.since) ? req.query.since[0] : req.query.since;

  let limit = DEFAULT_LIMIT;
  if (limitParam !== undefined) {
    const parsed = Number(limitParam);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_LIMIT) {
      return sendError(res, 400, `limit must be an integer between 1 and ${MAX_LIMIT}`);
    }
    limit = parsed;
  }

  let since: Date | undefined;
  if (sinceParam !== undefined) {
    const parsed = new Date(sinceParam);
    if (Number.isNaN(parsed.getTime())) {
      return sendError(res, 400, "since must be a valid ISO date-time");
    }
    since = parsed;
  }

  const vibes = await prisma.vibe.findMany({
    where: since ? { createdAt: { gt: since } } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  res.status(200).json({ vibes });
}

async function postVibe(req: VercelRequest, res: VercelResponse) {
  const body = req.body ?? {};
  const { name, emoji, status, color, energy } = body;

  if (typeof status !== "string" || status.trim().length === 0 || status.length > 140) {
    return sendError(res, 400, "status is required (1-140 characters)");
  }
  if (typeof color !== "string" || !HEX_COLOR_RE.test(color)) {
    return sendError(res, 400, "color is required and must be a hex colour like #c4ff3d");
  }
  if (!Number.isInteger(energy) || energy < 1 || energy > 5) {
    return sendError(res, 400, "energy is required and must be an integer between 1 and 5");
  }
  if (name !== undefined && (typeof name !== "string" || name.length > 40)) {
    return sendError(res, 400, "name must be a string of at most 40 characters");
  }
  if (emoji !== undefined && typeof emoji !== "string") {
    return sendError(res, 400, "emoji must be a string");
  }

  const vibe = await prisma.vibe.create({
    data: {
      name: name?.trim() || "you",
      emoji: emoji || "🔥",
      status: status.trim(),
      color,
      energy,
    },
  });

  res.status(201).json(vibe);
}
