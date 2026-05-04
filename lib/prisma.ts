import { PrismaClient } from "@prisma/client";

/**
 * Bump this string whenever `prisma/schema.prisma` gains/changes models so
 * `next dev` can replace the singleton after `npx prisma generate` without
 * only relying on a full process restart (stale client → prisma.venue undefined).
 */
const PRISMA_SCHEMA_EPOCH = "2026-05-04-gallery";

const globalForPrisma = globalThis as unknown as {
  __br_prisma__?: PrismaClient;
  __br_prisma_epoch__?: string;
};

function resolveDatabaseUrl(): string | undefined {
  const pub = process.env.DATABASE_PUBLIC_URL?.trim();
  const main = process.env.DATABASE_URL?.trim();
  if (process.env.NODE_ENV !== "production" && pub) return pub;
  return main || pub;
}

function createClient() {
  const databaseUrl = resolveDatabaseUrl();
  return new PrismaClient({
    log: ["error"],
    ...(databaseUrl
      ? { datasources: { db: { url: databaseUrl } } }
      : {}),
  });
}

function getPrisma(): PrismaClient {
  const g = globalForPrisma;
  if (g.__br_prisma__ && g.__br_prisma_epoch__ === PRISMA_SCHEMA_EPOCH) {
    return g.__br_prisma__;
  }
  if (g.__br_prisma__) {
    void g.__br_prisma__.$disconnect();
  }
  const client = createClient();
  g.__br_prisma__ = client;
  g.__br_prisma_epoch__ = PRISMA_SCHEMA_EPOCH;
  return client;
}

export const prisma = getPrisma();
