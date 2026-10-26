import { en } from "./en";
import { resolveContent, resolveSite } from "./merge";
import type { SiteData } from "./site";
import { tr } from "./tr";
import type { Content, Locale } from "./types";

/** The bundled copy, shown as is when nothing has been saved in the admin panel. */
export const defaultContent: Record<Locale, Content> = { tr, en };

/** Edits saved in the admin panel: rows "tr", "en" and "site" of the Supabase `content` table. */
export type Saved = Partial<Record<Locale | "site", unknown>>;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const cacheKey = "saved-content";

/** The last saved edits this browser fetched, so repeat visits render right away. */
export function readCache(): Saved | null {
  try {
    return JSON.parse(localStorage.getItem(cacheKey) ?? "null");
  } catch {
    return null;
  }
}

/**
 * Fetches the saved edits with a plain REST call (supabase-js only loads in the admin panel).
 * Null when Supabase isn't configured, is slow or fails: the site then shows the defaults.
 */
export async function fetchSaved(timeoutMs = 2000): Promise<Saved | null> {
  if (!supabaseUrl || !supabaseKey) return null;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/content?select=key,data`, {
      headers: { apikey: supabaseKey },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    let json = JSON.stringify(Object.fromEntries(((await res.json()) as { key: string; data: unknown }[]).map((r) => [r.key, r.data])));
    // Dev server only (see localLinksInDev in vite.config.ts): links to the live site stay local.
    const origin = import.meta.env.DEV_PRODUCTION_ORIGIN;
    if (origin) json = json.replaceAll(`${origin}/`, "/").replaceAll(origin, "/");
    try {
      localStorage.setItem(cacheKey, json);
    } catch {
      // Private mode or storage disabled: just no instant repeat visits.
    }
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** The copy and club data a page renders: defaults with the saved edits laid over them. */
export function resolve(locale: Locale, saved: Saved | null): { content: Content; site: SiteData } {
  const site = resolveSite(saved?.site);
  const content = resolveContent(defaultContent[locale], saved?.[locale]);
  return {
    site,
    content: site.showSponsors ? content : { ...content, nav: content.nav.filter((l) => l.href !== "#sponsors") },
  };
}
