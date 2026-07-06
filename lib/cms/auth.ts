import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin session for the SEO CMS. Single-admin password auth via the
 * ADMIN_PASSWORD env var (dev fallback below with a loud warning in the
 * login UI). The session cookie stores a hash of the password so rotating
 * the password invalidates existing sessions.
 *
 * NOTE: the legacy React CMS used Supabase Auth; swap this module for a
 * Supabase session check when that backend is reconnected.
 */

export const DEV_FALLBACK_PASSWORD = "giant-admin";
const COOKIE = "gs_admin";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEV_FALLBACK_PASSWORD;
}

export function usingDevPassword(): boolean {
  return !process.env.ADMIN_PASSWORD;
}

function tokenFor(password: string): string {
  return createHash("sha256").update(`gs-cms:${password}`).digest("hex");
}

export function verifyPassword(password: string): boolean {
  const a = Buffer.from(tokenFor(password));
  const b = Buffer.from(tokenFor(adminPassword()));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, tokenFor(adminPassword()), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE)?.value === tokenFor(adminPassword());
}
