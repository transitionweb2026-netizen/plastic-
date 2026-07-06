import "server-only";
import { readCms } from "./storage";

/**
 * Deliberately lean module (imports only the storage driver, not the full
 * seo.ts surface with its messages/articles/products data) — this is
 * called from proxy.ts on every single request, so it must stay cheap.
 */
export function findRedirect(pathname: string) {
  const norm = pathname.replace(/\/+$/, "") || "/";
  return readCms().redirects.find(
    (r) => (r.from.replace(/\/+$/, "") || "/") === norm
  );
}
