#!/usr/bin/env node
/**
 * Runs `npx prisma …` with DATABASE_URL resolved the same way as lib/prisma.ts
 * (dev prefers DATABASE_PUBLIC_URL so Railway works from a laptop).
 * Loads `.env.local` when present so `npm run db:push` works without a separate dotenv step.
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const out = {};
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const root = process.cwd();
const fromFile = parseEnvFile(join(root, ".env.local"));
const merged = { ...process.env, ...fromFile };

const pub = merged.DATABASE_PUBLIC_URL?.trim();
const main = merged.DATABASE_URL?.trim();
const nodeEnv = merged.NODE_ENV?.trim();
const usePub = nodeEnv !== "production" && Boolean(pub);
const databaseUrl = usePub ? pub : main || pub;

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL (set it in .env.local or the environment). Optional: DATABASE_PUBLIC_URL for local dev against Railway.",
  );
  process.exit(1);
}

const prismaArgs = process.argv.slice(2);
if (prismaArgs.length === 0) {
  console.error("Usage: node scripts/run-prisma.mjs <prisma-args…>");
  console.error("Example: node scripts/run-prisma.mjs db push");
  process.exit(1);
}

const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
const r = spawnSync(cmd, ["prisma", ...prismaArgs], {
  stdio: "inherit",
  env: { ...merged, DATABASE_URL: databaseUrl },
  cwd: root,
});

process.exit(r.status === null ? 1 : r.status);
