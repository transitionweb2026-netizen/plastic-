/** Recursively merges a plain-object override tree onto a base tree.
 *  Non-object leaves in `override` win outright; arrays replace wholesale
 *  (next-intl message trees are always `{ [ns]: { [key]: string } }`,
 *  never containing arrays, so no splice/concat semantics are needed). */
export function deepMergeMessages(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const b = base[key];
    const o = override[key];
    if (isPlainObject(b) && isPlainObject(o)) {
      out[key] = deepMergeMessages(b, o);
    } else if (o !== undefined) {
      out[key] = o;
    }
  }
  return out;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Trim-or-fallback field merge, shared by localizeProduct/
 *  localizeIndustryModal/localizeArticle: a string field only replaces the
 *  base when non-empty after trim; array/other fields replace wholesale
 *  when present. Mirrors lib/cms/seo.ts's effectiveSeo() discipline. Kept
 *  in this plain (non "server-only") file since lib/products.ts and
 *  lib/industries.ts are imported by client components. */
export function applyContentOverride<T extends Record<string, unknown>>(
  base: T,
  override?: Partial<T>
): T {
  if (!override) return base;
  const out = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(override)) {
    const v = (override as Record<string, unknown>)[key];
    if (typeof v === "string") {
      if (v.trim()) out[key] = v;
    } else if (v !== undefined) {
      out[key] = v;
    }
  }
  return out as T;
}

/** Dot-path helpers for single-key reads/writes into a sparse override
 *  tree (e.g. "nav.home" -> tree.nav.home), used by the translations API
 *  route so one field can be saved/cleared without touching the rest. */
export function getAtPath(tree: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let cur: unknown = tree;
  for (const part of parts) {
    if (!isPlainObject(cur)) return undefined;
    cur = cur[part];
  }
  return cur;
}

export function setAtPath(
  tree: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const parts = path.split(".");
  const next: Record<string, unknown> = { ...tree };
  let cur = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const existing = cur[part];
    cur[part] = isPlainObject(existing) ? { ...existing } : {};
    cur = cur[part] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
  return next;
}

export function deleteAtPath(
  tree: Record<string, unknown>,
  path: string
): Record<string, unknown> {
  const parts = path.split(".");
  const next: Record<string, unknown> = { ...tree };
  const stack: Record<string, unknown>[] = [next];
  let cur = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const existing = cur[part];
    if (!isPlainObject(existing)) return next; // path doesn't exist, nothing to delete
    cur[part] = { ...existing };
    cur = cur[part] as Record<string, unknown>;
    stack.push(cur);
  }
  delete cur[parts[parts.length - 1]];
  // Prune now-empty parent objects so the override file doesn't accumulate
  // empty shells (keeps it legible and keeps "no override" == "key absent").
  for (let i = stack.length - 1; i > 0; i--) {
    const parent = stack[i - 1];
    const key = parts[i - 1];
    if (isPlainObject(parent[key]) && Object.keys(parent[key] as object).length === 0) {
      delete parent[key];
    }
  }
  return next;
}
