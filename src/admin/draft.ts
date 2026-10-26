import { defaultContent, type Saved } from "../content/load";
import { resolveContent, resolveSite } from "../content/merge";
import { contentSchema, siteSchema, type EditableContent } from "../content/schema";
import type { SiteData } from "../content/site";
import type { Locale } from "../content/types";

/** Everything the panel edits: the copy in both languages plus the language-independent data. */
export interface Draft {
  tr: EditableContent;
  en: EditableContent;
  site: SiteData;
}
export type Scope = keyof Draft;
export type Path = (string | number)[];
export const scopes: Scope[] = ["tr", "en", "site"];

/** Plain data only: drops the function fields (plural rules etc.) and `locale`, which stay in code. */
function editable(locale: Locale, saved: unknown): EditableContent {
  const { locale: _, ...data } = JSON.parse(JSON.stringify(resolveContent(defaultContent[locale], saved)));
  return data;
}

/** Pads the shorter of two lists that must line up item for item (TR item 3 = EN item 3). */
function pad(a: unknown[] = [], b: unknown[] = []) {
  while (a.length < b.length) a.push(structuredClone(b[a.length]));
  while (b.length < a.length) b.push(structuredClone(a[b.length]));
}

/**
 * The editor's starting point: what the site currently shows. Lists edited side by side in both
 * languages are padded to the same length, in case the saved data ever got out of step.
 */
export function toDraft(saved: Saved | null): Draft {
  const draft: Draft = { tr: editable("tr", saved?.tr), en: editable("en", saved?.en), site: resolveSite(saved?.site) };
  const lists = (c: EditableContent) => [
    c.nav,
    c.stats,
    c.areas.items,
    c.projects.items,
    c.events.items,
    c.team.people,
    c.sponsors.tiers,
    c.soon.status.steps,
  ];
  const tr = lists(draft.tr);
  lists(draft.en).forEach((list, i) => pad(tr[i], list));
  draft.tr.projects.items.forEach((p, i) => {
    const q = draft.en.projects.items[i];
    pad(p.highlights, q.highlights);
    pad(p.sections, q.sections);
    pad(p.timeline, q.timeline);
    if (p.team || q.team) pad((p.team ??= []), (q.team ??= []));
  });
  return draft;
}

export const getAt = (value: unknown, path: Path): unknown =>
  path.reduce<unknown>((v, k) => (v == null ? undefined : (v as Record<string | number, unknown>)[k]), value);

/** Copy of `value` with `path` set; `undefined` removes the key (optional fields). */
export function setAt<T>(value: T, path: Path, next: unknown): T {
  if (!path.length) return next as T;
  const [k, ...rest] = path;
  const copy = (Array.isArray(value) ? [...value] : { ...(value as object) }) as Record<string | number, unknown>;
  const child = setAt(copy[k], rest, next);
  if (child === undefined && !Array.isArray(copy)) delete copy[k];
  else copy[k] = child;
  return copy as T;
}

/** Validation messages keyed by "scope:path.to.field" (see `errorKey`). */
export type Errors = Map<string, string>;
export const errorKey = (scope: Scope, path: Path) => `${scope}:${path.join(".")}`;

export function validate(draft: Draft): Errors {
  const errors: Errors = new Map();
  for (const scope of scopes) {
    const result = (scope === "site" ? siteSchema : contentSchema).safeParse(draft[scope]);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = errorKey(scope, issue.path as Path);
        if (!errors.has(key)) errors.set(key, issue.message);
      }
    }
  }
  return errors;
}
