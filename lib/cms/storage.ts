import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { CmsData } from "./types";

/**
 * Pluggable CMS storage. Default driver: a JSON file under content/cms/
 * (git-versioned, zero external dependencies). To move to the legacy
 * Supabase backend later, implement CmsDriver against the seo_pages /
 * org_schema tables and swap it in here — every consumer goes through
 * readCms()/writeCms() only.
 */
export interface CmsDriver {
  read(): CmsData;
  write(data: CmsData): void;
}

const DATA_PATH = path.join(process.cwd(), "content", "cms", "seo.json");

export function emptyCms(): CmsData {
  return {
    version: 1,
    global: {
      org: {
        companyName: "Giant Storage Integrated Solutions",
        logoUrl: "",
        website: "",
        phone: "",
        email: "",
        address: { street: "", city: "", country: "" },
        social: {},
      },
      notFound: { published: false, en: {}, ar: {} },
      robots: { rules: [], custom: "" },
    },
    pages: {},
    products: {},
    images: {},
    redirects: [],
  };
}

class JsonFileDriver implements CmsDriver {
  read(): CmsData {
    try {
      return JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) as CmsData;
    } catch {
      return emptyCms();
    }
  }
  write(data: CmsData): void {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    const tmp = DATA_PATH + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, DATA_PATH);
  }
}

const driver: CmsDriver = new JsonFileDriver();

/**
 * No in-memory cache here, deliberately: Next.js's production bundler
 * compiles API routes and page-render code into separate server chunks,
 * each getting its OWN module instance — a module-scope cache variable is
 * NOT a true cross-route singleton and goes stale the moment one chunk
 * writes while another still holds an old value. readCms() always reads
 * the file fresh; it's a small JSON file and this isn't a hot path (once
 * per page render for metadata), so the correctness this buys is worth
 * far more than the sub-millisecond sync read it costs.
 */
export function readCms(): CmsData {
  return driver.read();
}

export function writeCms(data: CmsData): void {
  driver.write(data);
}

/**
 * Generic version of the pattern above, for new CMS domains that need
 * their own file (kept separate from seo.json so it doesn't grow
 * unbounded — see lib/cms/translations-storage.ts, content-storage.ts).
 * Same no-cache-by-design rationale as readCms()/writeCms() above.
 */
export interface FileDriver<T> {
  read(): T;
  write(data: T): void;
}

export function createJsonFileDriver<T>(
  fileName: string,
  emptyValue: () => T
): FileDriver<T> {
  const filePath = path.join(process.cwd(), "content", "cms", fileName);
  return {
    read(): T {
      try {
        return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
      } catch {
        return emptyValue();
      }
    },
    write(data: T): void {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      const tmp = filePath + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
      fs.renameSync(tmp, filePath);
    },
  };
}
