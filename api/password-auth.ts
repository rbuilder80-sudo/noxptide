import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { env } from "./lib/env";
import { getSessionCookieOptions } from "./lib/cookies";
import { Session } from "@contracts/constants";
import { signSessionToken } from "./kimi/session";

/**
 * Self-contained email/password admin login.
 * The site is self-hosted (Railway) and Kimi OAuth only accepts its original
 * platform redirect URI, so the admin panel authenticates directly against
 * the users table (scrypt-hashed passwords).
 */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

const loginInput = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(128),
});

// Simple in-memory rate limit: 10 attempts / 5 min per IP.
const attempts = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 });
    return false;
  }
  entry.count++;
  return entry.count > 10;
}

export function createPasswordLoginHandler() {
  return async (c: Context) => {
   try {
    const ip = c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for") ?? "unknown";
    if (rateLimited(ip)) {
      return c.json({ error: "Too many attempts — try again in a few minutes." }, 429);
    }

    let input: z.infer<typeof loginInput>;
    try {
      input = loginInput.parse(await c.req.json());
    } catch {
      return c.json({ error: "Invalid request." }, 400);
    }

    const email = input.email.trim().toLowerCase();
    const [user] = await getDb()
      .select()
      .from(users)
      .where(eq(users.unionId, `local:${email}`))
      .limit(1);

    if (!user?.passwordHash || !verifyPassword(input.password, user.passwordHash)) {
      return c.json({ error: "Incorrect email or password." }, 401);
    }

    const token = await signSessionToken({ unionId: user.unionId, clientId: env.appId });
    setCookie(c, Session.cookieName, token, {
      ...getSessionCookieOptions(c.req.raw.headers),
      maxAge: Session.maxAgeMs / 1000,
    });
    return c.json({ ok: true, name: user.name, role: user.role });
   } catch (err) {
    const e = err as { message?: string; cause?: { message?: string } };
    return c.json({ error: "debug", detail: String(e?.message).slice(0, 300), cause: String(e?.cause?.message ?? "").slice(0, 300) }, 500);
   }
  };
}
