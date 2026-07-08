import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Single server-side Supabase client for the whole CMS. Uses the
 * service-role key (bypasses RLS) — safe because every caller of this
 * module is itself server-only (Server Components, Route Handlers, the
 * proxy); nothing here is ever bundled for the browser.
 */
let client: SupabaseClient | undefined;

export function supabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars — see .env.local.example"
    );
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
