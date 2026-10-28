import { en } from "./en";
import { localizeEvents, type ClubEvent } from "./events";
import { resolveContent, resolveSite } from "./merge";
import { eventExtrasSchema, type EventExtras } from "./schema";
import type { SiteData } from "./site";
import { tr } from "./tr";
import type { Content, Locale } from "./types";

/** The bundled copy, shown as is when nothing has been saved in the admin panel. */
export const defaultContent: Record<Locale, Content> = { tr, en };

/**
 * Edits saved in the admin panel: rows "tr", "en" and "site" of the Supabase `content` table, and the rows of
 * the `events` table under "events".
 */
export type Saved = Partial<Record<Locale | "site" | "events", unknown>>;

const eventColumns =
  "id,starts_on,ends_on,title_tr,title_en,category_tr,category_en,place_tr,place_en,description_tr,description_en,rsvp_open";

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
 * Fetches the saved edits and the events with plain REST calls, side by side (supabase-js only loads in the
 * admin panel). Null when Supabase isn't configured, is slow or the content fails: the site then shows the
 * defaults. Events that fail to load just aren't listed.
 */
export async function fetchSaved(timeoutMs = 2000): Promise<Saved | null> {
  if (!supabaseUrl || !supabaseKey) return null;
  const get = (path: string) => fetch(`${supabaseUrl}/rest/v1/${path}`, { headers: { apikey: supabaseKey }, signal: AbortSignal.timeout(timeoutMs) });
  try {
    const [res, eventsRes] = await Promise.all([get("content?select=key,data"), get(`events?select=${eventColumns}`).catch(() => null)]);
    if (!res.ok) return null;
    const saved: Saved = Object.fromEntries(((await res.json()) as { key: string; data: unknown }[]).map((r) => [r.key, r.data]));
    if (eventsRes?.ok) saved.events = await eventsRes.json();
    const json = localLinks(JSON.stringify(saved));
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

/** Public URL of a file in the site-assets bucket (event photos), e.g. "events/12/…webp". */
export const assetUrl = (path: string) => `${supabaseUrl}/storage/v1/object/public/site-assets/${path}`;

/**
 * One event's write-up, photos and sign-up form, for its own page (the lists don't load them). Null when it
 * can't be loaded or fails the checks in schema.ts: the page then shows the short description, no photos and
 * no form.
 */
export async function fetchEventExtras(id: number): Promise<EventExtras | null> {
  if (!supabaseUrl || !supabaseKey) return null;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/events?id=eq.${id}&select=details_tr,details_en,photos,form,capacity`, {
      headers: { apikey: supabaseKey },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const result = eventExtrasSchema.safeParse(((await res.json()) as unknown[])[0]);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/** Calls a database function (supabase/migrations/0007_event_signups.sql) with plain REST. */
function rpc(name: string, args: Record<string, unknown>) {
  return fetch(`${supabaseUrl}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: supabaseKey!, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(10000),
  });
}

/** Places left on an event's list: a number (0 = waitlist only), null for no limit, undefined if unknown. */
export async function fetchPlacesLeft(id: number): Promise<number | null | undefined> {
  if (!supabaseUrl || !supabaseKey) return undefined;
  try {
    const res = await rpc("event_places_left", { p_event_id: id });
    return res.ok ? ((await res.json()) as number | null) : undefined;
  } catch {
    return undefined;
  }
}

export interface Signup {
  name: string;
  email: string;
  studentNo: string | null;
  phone: string | null;
  /** By question id: text, an option id, a list of option ids, or true. */
  answers: Record<string, string | string[] | boolean>;
  consent: boolean;
}

/**
 * Signs up for an event. "confirmed" (a place) or "waitlist"; otherwise why not, from the HTTP status the
 * database function answers with: closed (410), duplicate email (409), busy (429), or failed (anything else).
 */
export async function signUp(id: number, s: Signup): Promise<"confirmed" | "waitlist" | "closed" | "duplicate" | "busy" | "failed"> {
  if (!supabaseUrl || !supabaseKey) return "failed";
  try {
    const res = await rpc("sign_up_for_event", {
      p_event_id: id,
      p_name: s.name,
      p_email: s.email,
      p_student_no: s.studentNo,
      p_phone: s.phone,
      p_answers: s.answers,
      p_consent: s.consent,
    });
    if (res.ok) return (await res.json()) === "waitlist" ? "waitlist" : "confirmed";
    console.error("Sign-up not saved", res.status, await res.text());
    return ({ 410: "closed", 409: "duplicate", 429: "busy" } as const)[res.status as 410 | 409 | 429] ?? "failed";
  } catch {
    return "failed";
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

/** The copy, club data and events a page renders: defaults with the saved edits laid over them. */
export function resolve(locale: Locale, saved: Saved | null): { content: Content; site: SiteData; events: ClubEvent[] } {
  const site = resolveSite(saved?.site);
  const content = resolveContent(defaultContent[locale], saved?.[locale]);
  return {
    site,
    content: site.showSponsors ? content : { ...content, nav: content.nav.filter((l) => l.href !== "#sponsors") },
    events: localizeEvents(saved?.events, locale),
  };
}
