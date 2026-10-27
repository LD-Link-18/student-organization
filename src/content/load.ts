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

/** Dev server only (see localLinksInDev in vite.config.ts): saved links to the live site stay local. */
function localLinks(json: string) {
  const origin = import.meta.env.DEV_PRODUCTION_ORIGIN;
  return origin ? json.replaceAll(`${origin}/`, "/").replaceAll(origin, "/") : json;
}

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
    const json = localLinks(JSON.stringify(Object.fromEntries(((await res.json()) as { key: string; data: unknown }[]).map((r) => [r.key, r.data]))));
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

/**
 * Preview of unsaved admin edits. The panel keeps its current draft under this localStorage key (same
 * browser, same origin; nothing reaches the database). A page opened with `?preview` shows that draft
 * instead of the saved content, and so does every page this tab visits afterwards until "Exit preview".
 * The draft is only there while the panel has unsaved changes (it's removed on save and sign-out); without
 * one, a preview page shows the live site, so `?preview` changes nothing for anyone but an admin mid-edit.
 */
export const previewKey = "admin-preview";
export interface Preview {
  draft: Saved;
  /** Fields failing the checks in schema.ts: those sections show the defaults instead. */
  problems: number;
}

export function inPreview(): boolean {
  try {
    if (new URLSearchParams(window.location.search).has("preview")) sessionStorage.setItem(previewKey, "1");
    return sessionStorage.getItem(previewKey) === "1";
  } catch {
    return false;
  }
}

export function readPreview(): Preview | null {
  try {
    return JSON.parse(localLinks(localStorage.getItem(previewKey) ?? "null"));
  } catch {
    return null;
  }
}

export function clearPreview() {
  try {
    localStorage.removeItem(previewKey);
  } catch {
    // Storage blocked: nothing was stored either.
  }
}

export function exitPreview() {
  try {
    sessionStorage.removeItem(previewKey);
  } catch {
    // Nothing stored, nothing to clear.
  }
  const url = new URL(window.location.href);
  url.searchParams.delete("preview");
  window.location.replace(url);
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
