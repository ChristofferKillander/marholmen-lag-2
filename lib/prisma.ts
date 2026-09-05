import { PrismaClient } from "@prisma/client";

// Reuse the client across invocations in Vercel's serverless runtime
// (and across hot reloads in `vercel dev`) instead of opening a new
// connection pool per request.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
