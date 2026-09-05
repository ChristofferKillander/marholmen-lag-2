import type { VercelRequest, VercelResponse } from "@vercel/node";

// The React Native app and any local dev tooling hit this API cross-origin;
// there's no auth/session model in the spec, so a permissive CORS
// policy is fine for a weekend project.
export function withCors(req: VercelRequest, res: VercelResponse): boolean {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

export function sendError(res: VercelResponse, status: number, message: string) {
  res.status(status).json({ error: message });
}
