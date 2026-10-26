import * as z from "zod/mini";
import { areaKeys, avatarVariants, linkSources, navHrefs, projectStatuses, projectVisuals, sponsorTiers, type SiteData } from "./site";
import type { Content } from "./types";

/**
 * What the admin panel may change, and the rules it must follow. The panel refuses to save anything that
 * fails these checks, and the site ignores any saved section that fails them (keeping the default from
 * tr.ts / en.ts / site.ts instead), so a bad edit can't break a page.
 *
 * Must describe exactly the data fields of `Content` and `SiteData`: the checks at the bottom fail the
 * build otherwise. When adding a field to `Content`, make it optional here (and in types.ts) or add it to
 * both language files, so content saved before the change still passes.
 */

/** Any non-blank text. Not trimmed: some labels start with a space on purpose (" (opens in a new tab)"). */
const text = z.string().check(z.refine((s) => s.trim() !== "", "Required"));
const pair = z.tuple([text, text]);
const triple = z.tuple([text, text, text]);
/** Empty, or an address starting with https://, / or mailto:. */
const linkPattern = z.regex(/^(https?:\/\/\S+|\/\S*|mailto:\S+)?$/, "Must start with https://, / or mailto:");
const link = z.string().check(linkPattern);
const requiredLink = z.string().check(linkPattern, z.refine((s) => s !== "", "Required"));

const unique =
  <T,>(by: (item: T) => string, what: string) =>
  (items: T[], ctx: z.core.$RefinementCtx<T[]>) => {
    const seen = new Set<string>();
    items.forEach((item, i) => {
      if (seen.has(by(item))) ctx.addIssue({ code: "custom", message: `Duplicate ${what}`, path: [i] });
      seen.add(by(item));
    });
  };

const project = z.object({
  slug: z.string().check(z.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase letters, digits and dashes only (e.g. traffic-sim)")),
  name: text,
  category: text,
  status: z.enum(projectStatuses),
  description: text,
  stack: z.array(text),
  visual: z.enum(projectVisuals),
  started: text,
  overview: text,
  highlights: z.array(z.object({ value: text, label: text })).check(z.maxLength(4, "At most 4")),
  sections: z.array(z.object({ title: text, body: text })),
  timeline: z.array(z.object({ date: text, text: text })),
  team: z.optional(z.array(z.object({ name: text, role: z.optional(z.string()), href: z.optional(link) }))),
  repo: z.optional(link),
  demo: z.optional(link),
});

export const contentSchema = z.object({
  switcher: z.object({ groupLabel: text }),
  club: z.object({ name: text, wordmark: pair, university: text, semester: text }),
  common: z.object({
    joinClub: text,
    skipToContent: text,
    backToTop: text,
    logoLabel: text,
    newTab: text,
    openMenu: text,
    closeMenu: text,
    mainNav: text,
    footerNav: text,
    homeLabel: text,
  }),
  nav: z.array(z.object({ label: text, href: z.enum(navHrefs) })),
  socialFloat: z.object({
    region: text,
    whatsapp: z.object({ label: text, title: text }),
    instagram: z.object({ label: text }),
  }),
  hero: z.object({
    intakeOpen: text,
    tagline: text,
    words: triple,
    notes: pair,
    scale: z.number().check(z.gte(0.5, "Between 0.5 and 1.2"), z.lte(1.2, "Between 0.5 and 1.2")),
    intro: text,
    primaryCta: text,
    secondaryCta: text,
    chips: z.object({ robotics: text, ml: text, ai: text, automation: text }),
    sticker: text,
  }),
  tapeExtras: z.array(text),
  about: z.object({ title: pair, body: text, principles: z.array(text) }),
  stats: z.array(z.object({ value: text, label: text })),
  areas: z.object({
    title: text,
    intro: text,
    toolsLabel: text,
    items: z
      .array(z.object({ key: z.enum(areaKeys), title: text, blurb: text, tools: z.array(text) }))
      .check(z.superRefine(unique((a) => a.key, "icon"))),
  }),
  projects: z.object({
    title: pair,
    intro: text,
    pitch: text,
    stackLabel: text,
    statusLabel: text,
    status: z.object({ done: text, progress: text, prototype: text }),
    view: text,
    items: z.array(project).check(z.minLength(1, "Keep at least one project"), z.superRefine(unique((p) => p.slug, "slug"))),
  }),
  projectPage: z.object({
    home: text,
    breadcrumb: text,
    started: text,
    statusLabel: text,
    repo: text,
    demo: text,
    highlights: text,
    stack: text,
    timeline: text,
    team: text,
    join: z.object({ title: text, body: text, cta: text, pitch: text }),
    next: text,
    listDocTitle: text,
  }),
  events: z.object({
    title: text,
    calendar: text,
    nextUp: text,
    rsvp: text,
    rsvpClosed: text,
    items: z.array(
      z.object({
        day: text,
        month: text,
        title: text,
        category: text,
        description: text,
        place: text,
        rsvpOpen: z.optional(z.boolean()),
      }),
    ),
  }),
  team: z.object({
    title: pair,
    intro: text,
    members: text,
    takeSeat: text,
    people: z.array(
      z.object({ name: text, role: z.optional(z.string()), focus: text, avatar: z.literal(avatarVariants), href: z.optional(link) }),
    ),
  }),
  sponsors: z.object({
    title: text,
    intro: text,
    tiers: z
      .array(z.object({ key: z.enum(sponsorTiers), name: text, perks: z.array(text) }))
      .check(z.superRefine(unique((t) => t.key, "tier"))),
    yourLogo: text,
    cta: z.object({ title: text, body: text, deck: text }),
  }),
  join: z.object({
    words: triple,
    body: text,
    primary: text,
    secondary: text,
    memberName: text,
    memberSince: text,
    sticker: text,
  }),
  footer: z.object({ blurb: text, explore: text, follow: text }),
  soon: z.object({
    headline: pair,
    lead: z.object({ default: text, ...Object.fromEntries(linkSources.map((s) => [s, text])) } as Record<"default" | (typeof linkSources)[number], typeof text>),
    body: text,
    instagram: text,
    join: text,
    home: text,
    status: z.object({ title: text, steps: z.array(pair) }),
    sticker: text,
  }),
  notFound: z.object({
    title: text,
    lead: text,
    body: text,
    home: text,
    projects: text,
    quickLinks: text,
    camera: z.object({ feed: text, scanning: text, box: text, empty: text, chip: text }),
  }),
});

export const siteSchema = z.object({
  club: z.object({
    short: text,
    email: z.email("Not an email address"),
    joinUrl: requiredLink,
    projectUrl: requiredLink,
    socials: z.array(z.object({ label: text, source: z.enum(linkSources), href: link })),
  }),
  showSponsors: z.boolean(),
  discordHref: link,
  sponsorship: z.object({ minPerTier: z.int().check(z.gte(0, "0 to 12"), z.lte(12, "0 to 12")), deckUrl: link }),
  sponsors: z
    .array(z.object({ name: text, tier: z.enum(sponsorTiers), href: requiredLink, logo: z.optional(link) }))
    .check(z.superRefine(unique((s) => s.name, "sponsor name"))),
});

/** `T` without its function-valued fields (the copy that needs code, like plural rules). */
type Data<T> = T extends (...args: never[]) => unknown
  ? never
  : T extends readonly unknown[]
    ? { [K in keyof T]: Data<T[K]> }
    : T extends object
      ? { [K in keyof T as T[K] extends (...args: never[]) => unknown ? never : K]: Data<T[K]> }
      : T;

/** The part of `Content` the admin panel edits: everything but the functions and `locale`. */
export type EditableContent = Omit<Data<Content>, "locale">;

// Fail the type-check when the schemas drift from types.ts / site.ts (each must fit the other).
({}) as z.infer<typeof contentSchema> satisfies EditableContent;
({}) as EditableContent satisfies z.infer<typeof contentSchema>;
({}) as z.infer<typeof siteSchema> satisfies SiteData;
({}) as SiteData satisfies z.infer<typeof siteSchema>;
