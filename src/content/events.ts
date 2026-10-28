import { eventRowSchema, type EventRow } from "./schema";
import type { Locale } from "./types";

/** An event as the pages show it: one language; dates as YYYY-MM-DD, `end` = `start` for a one-day event. */
export interface ClubEvent {
  id: number;
  start: string;
  end: string;
  title: string;
  category: string;
  place: string;
  description: string;
  rsvpOpen: boolean;
}

/**
 * The saved `events` rows in the page's language. Rows that fail the checks in schema.ts are left out (with
 * a warning), so one bad row can't break the page; anything that isn't a list means no events.
 */
export function localizeEvents(rows: unknown, locale: Locale): ClubEvent[] {
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((row) => {
    const result = eventRowSchema.safeParse(row);
    if (!result.success) {
      console.warn("Ignoring a saved event: it fails the checks in schema.ts.", row, result.error.issues);
      return [];
    }
    const e: EventRow = result.data;
    return [
      {
        id: e.id,
        start: e.starts_on,
        end: e.ends_on ?? e.starts_on,
        title: e[`title_${locale}`],
        category: e[`category_${locale}`],
        place: e[`place_${locale}`],
        description: e[`description_${locale}`],
        rsvpOpen: e.rsvp_open,
      },
    ];
  });
}

/** Today in Turkey, where the events happen, as YYYY-MM-DD: an event is past from the day after it ends. */
export function today(): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Upcoming (including ongoing) soonest first; past most recent first. */
export function splitEvents(events: ClubEvent[], now = today()) {
  return {
    upcoming: events.filter((e) => e.end >= now).sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end)),
    past: events.filter((e) => e.end < now).sort((a, b) => b.start.localeCompare(a.start) || b.end.localeCompare(a.end)),
  };
}

export const isOngoing = (e: ClubEvent, now = today()) => e.start <= now && now <= e.end;

/**
 * The big date on an event row: "20" / "Eki", "20–22" / "Eki", or across months "30–2" / "Eki–Kas". With
 * `withYear` the year follows the month ("Eki 2026"), for past events.
 */
export function dateParts(e: ClubEvent, locale: Locale, withYear = false) {
  const date = (s: string) => new Date(`${s}T12:00:00Z`);
  // Three letters in both languages ("Eki", "Oct"; English would otherwise write "Sept").
  const month = (s: string) =>
    new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", { month: "short", timeZone: "UTC" }).format(date(s)).replace(".", "").slice(0, 3);
  const dayOf = (s: string) => String(Number(s.slice(8, 10)));
  const sameMonth = e.start.slice(0, 7) === e.end.slice(0, 7);
  return {
    day: e.start === e.end ? dayOf(e.start) : `${dayOf(e.start)}–${dayOf(e.end)}`,
    month: (sameMonth ? month(e.start) : `${month(e.start)}–${month(e.end)}`) + (withYear ? ` ${e.end.slice(0, 4)}` : ""),
  };
}

/** "20–22 Ekim 2026" / "20–22 October 2026", or one day: the event pages' date. */
export function fullDate(e: ClubEvent, locale: Locale) {
  const format = new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const date = (s: string) => new Date(`${s}T12:00:00Z`);
  return e.start === e.end ? format.format(date(e.start)) : format.formatRange(date(e.start), date(e.end));
}

/** Whether the event takes sign-ups now: switched on, and not over yet. */
export const signupOpen = (e: ClubEvent, now = today()) => e.rsvpOpen && e.end >= now;
