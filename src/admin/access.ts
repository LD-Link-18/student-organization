import type { Saved } from "../content/load";
import type { Scope } from "./draft";
import { sections } from "./sections";

/**
 * What the signed-in admin may do (supabase/migrations/0008_admin_roles.sql): everything, or the ticked areas.
 * The panel only shows those; the database refuses anything else anyway.
 */
export interface Access {
  full: boolean;
  areas: string[];
}

export const can = (access: Access, area: string) => access.full || access.areas.includes(area);

/** The areas that aren't content sections; content sections are areas under their own id (see `sections`). */
export const otherAreas = [
  { id: "event-list", title: "Event list", group: "Events", hint: "Add and change events, their photos and sign-up forms." },
  { id: "signups", title: "Event sign-ups", group: "Personal data", hint: "See, move and delete who signed up for events." },
  { id: "applications", title: "Applications", group: "Personal data", hint: "Membership applications." },
  { id: "pitches", title: "Project pitches", group: "Personal data", hint: "Project ideas sent in." },
] as const;

/** The parts of a saved row (top-level keys of "tr" / "en" or "site") the admin's sections edit. */
export function editableKeys(access: Access, scope: Scope): string[] {
  return sections.filter((s) => can(access, s.id)).flatMap((s) => (scope === "site" ? s.site : s.content) as string[]);
}

/**
 * The row to save for an admin who isn't full: the latest saved row with only their sections' parts taken from
 * the draft. Everything else stays exactly as saved, which is what the database's check (content_guard) allows.
 */
export function rowToSave(access: Access, scope: Scope, saved: Saved[Scope], draft: Record<string, unknown>) {
  if (access.full) return draft;
  const base = saved && typeof saved === "object" && !Array.isArray(saved) ? (saved as Record<string, unknown>) : {};
  return { ...base, ...Object.fromEntries(editableKeys(access, scope).map((k) => [k, draft[k]])) };
}
