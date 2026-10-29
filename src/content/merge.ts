import type { ZodMiniType } from "zod/mini";
import { contentSchema, siteSchema } from "./schema";
import { siteDefaults, type SiteData } from "./site";
import type { Content } from "./types";

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Objects merge key by key; arrays and plain values in `over` replace the ones in `base`. */
function deepMerge(base: unknown, over: unknown): unknown {
  if (over === undefined) return base;
  if (!isObject(base) || !isObject(over)) return over;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = deepMerge(base[k], v);
  return out;
}

/**
 * Lays saved admin edits over the bundled defaults, one top-level section at a time. Fields missing
 * from the saved data keep their default; a section that fails its schema check is ignored as a whole
 * (default kept, warning in the console). Function fields aren't in the schemas, so they always come
 * from the defaults.
 */
function applySections<T extends object>(defaults: T, saved: unknown, shape: Record<string, ZodMiniType>, label: string): T {
  if (!isObject(saved)) return defaults;
  const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
  for (const [key, schema] of Object.entries(shape)) {
    if (!(key in saved)) continue;
    const base = out[key];
    const result = schema.safeParse(deepMerge(base, saved[key]));
    if (result.success) out[key] = deepMerge(base, result.data);
    else console.warn(`Ignoring saved ${label}.${key}: it fails the checks in schema.ts.`, result.error.issues);
  }
  return out as T;
}

export const resolveContent = (defaults: Content, saved: unknown): Content =>
  applySections(defaults, saved, contentSchema.shape, defaults.locale);

export const resolveSite = (saved: unknown): SiteData => applySections(siteDefaults, saved, siteSchema.shape, "site");
